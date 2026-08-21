import os
# pyrefly: ignore [missing-import]
import streamlit as st
import pandas as pd
# pyrefly: ignore [missing-import]
from dotenv import load_dotenv

# Load environment variables from .env
load_dotenv()

# Configure the Streamlit page
st.set_page_config(
    page_title="Catalyst 2026",
    page_icon="⚡",
    layout="wide",
    initial_sidebar_state="expanded"
)

# Custom styling for a polished look
st.markdown("""
<style>
    .main-header {
        font-size: 2.2rem;
        font-weight: 700;
        margin-bottom: 0.5rem;
    }
    .sub-header {
        color: #6b7280;
        font-size: 1.1rem;
        margin-bottom: 1.5rem;
    }
    .metric-card {
        background-color: #f8fafc;
        border-radius: 8px;
        padding: 1rem;
        border: 1px solid #e2e8f0;
    }
</style>
""", unsafe_allow_html=True)

# ==================== AUTHENTICATION & SESSION MANAGEMENT ====================
# Initialize session state
if "logged_in" not in st.session_state:
    st.session_state.logged_in = False
    st.session_state.user_role = None
    st.session_state.username = None

# Hardcoded credentials
MANAGER_CREDS = {"username": "manager", "password": "manager123"}
EMPLOYEE_CREDS = {"username": "employee", "password": "employee123"}

# Mock data for projects and employees
if "projects" not in st.session_state:
    st.session_state.projects = {
        "Project Alpha": {"employees": ["employee"], "sous_chefs": [], "status": "active"},
        "Project Beta": {"employees": [], "sous_chefs": [], "status": "active"},
        "Project Gamma": {"employees": ["employee"], "sous_chefs": ["sous_chef_user"], "status": "active"},
    }

if "employees" not in st.session_state:
    st.session_state.employees = {
        "employee": {"name": "John Doe", "role": "employee", "projects": ["Project Alpha", "Project Gamma"]},
        "sous_chef_user": {"name": "Jane Smith", "role": "sous_chef", "projects": ["Project Gamma"]},
        "emp2": {"name": "Bob Wilson", "role": "employee", "projects": []},
    }

def login(username, password):
    """Authenticate user"""
    if username == MANAGER_CREDS["username"] and password == MANAGER_CREDS["password"]:
        st.session_state.logged_in = True
        st.session_state.user_role = "manager"
        st.session_state.username = username
        return True
    elif username == EMPLOYEE_CREDS["username"] and password == EMPLOYEE_CREDS["password"]:
        st.session_state.logged_in = True
        st.session_state.user_role = "employee"
        st.session_state.username = username
        return True
    return False

def logout():
    """Logout user"""
    st.session_state.logged_in = False
    st.session_state.user_role = None
    st.session_state.username = None

# ==================== LOGIN PAGE ====================
if not st.session_state.logged_in:
    st.markdown('<div class="main-header">⚡ Catalyst 2026 Console</div>', unsafe_allow_html=True)
    st.markdown('<div class="sub-header">Role-Based Team Management System</div>', unsafe_allow_html=True)
    
    st.divider()
    
    col1, col2, col3 = st.columns([1, 2, 1])
    with col2:
        st.subheader("🔐 Login")
        
        username = st.text_input("Username", placeholder="Enter your username")
        password = st.text_input("Password", type="password", placeholder="Enter your password")
        
        if st.button("Login", type="primary", use_container_width=True):
            if login(username, password):
                st.success(f"✅ Welcome, {username}!")
                st.rerun()
            else:
                st.error("❌ Invalid username or password")
        
        st.divider()
        st.subheader("📋 Test Credentials")
        col_m, col_e = st.columns(2)
        with col_m:
            st.info("**Manager:**\nUsername: `manager`\nPassword: `manager123`")
        with col_e:
            st.info("**Employee:**\nUsername: `employee`\nPassword: `employee123`")
    
    st.stop()

# ==================== MAIN APPLICATION ====================
# Sidebar with logout
with st.sidebar:
    st.image("https://img.icons8.com/isometric/100/lightning-bolt.png", width=64)
    st.title("⚡ Catalyst 2026")
    st.caption("CISSA Hackathon Team Workspace")
    st.divider()
    
    st.write(f"👤 **Logged in as:**")
    st.write(f"- {st.session_state.username.upper()}")
    st.write(f"- Role: **{st.session_state.user_role.upper()}**")
    
    if st.button("🚪 Logout", use_container_width=True):
        logout()
        st.rerun()
    
    st.divider()
    
    # Role-based navigation
    if st.session_state.user_role == "manager":
        mode = st.radio(
            "Manager Console",
            ["📊 Dashboard", "👥 Manage Employees", "📁 Projects", "👨‍🍳 Sous-Chefs", "⚙️ Settings"],
            index=0
        )
    else:  # employee
        mode = st.radio(
            "Employee Console",
            ["📊 Dashboard", "📁 My Projects", "⚙️ Settings"],
            index=0
        )
    
    st.divider()
    api_key_set = bool(os.getenv("GEMINI_API_KEY"))
    if api_key_set:
        st.success("✅ Gemini API Key Detected")
    else:
        st.warning("⚠️ No API Key found in .env (Demo Mode)")

# ==================== MANAGER CONSOLE ====================
if st.session_state.user_role == "manager":
    
    # MANAGER: Dashboard
    if mode == "📊 Dashboard":
        st.markdown('<div class="main-header">📊 Manager Dashboard</div>', unsafe_allow_html=True)
        st.markdown('<div class="sub-header">Overview of projects, employees, and team structure</div>', unsafe_allow_html=True)
        
        col1, col2, col3 = st.columns(3)
        with col1:
            st.metric(label="Total Projects", value=len(st.session_state.projects))
        with col2:
            st.metric(label="Total Employees", value=len(st.session_state.employees))
        with col3:
            active_projects = sum(1 for p in st.session_state.projects.values() if p["status"] == "active")
            st.metric(label="Active Projects", value=active_projects)
        
        st.divider()
        
        st.subheader("📊 Projects Overview")
        projects_data = []
        for proj_name, proj_info in st.session_state.projects.items():
            projects_data.append({
                "Project": proj_name,
                "Employees": len(proj_info["employees"]),
                "Sous-Chefs": len(proj_info["sous_chefs"]),
                "Status": proj_info["status"]
            })
        st.dataframe(pd.DataFrame(projects_data), use_container_width=True)
    
    # MANAGER: Manage Employees
    elif mode == "👥 Manage Employees":
        st.markdown('<div class="main-header">👥 Manage Employees</div>', unsafe_allow_html=True)
        
        st.subheader("📋 Employee List")
        employees_data = []
        for emp_id, emp_info in st.session_state.employees.items():
            employees_data.append({
                "ID": emp_id,
                "Name": emp_info["name"],
                "Role": emp_info["role"],
                "Projects": ", ".join(emp_info["projects"]) if emp_info["projects"] else "None"
            })
        st.dataframe(pd.DataFrame(employees_data), use_container_width=True)
        
        st.divider()
        
        col1, col2 = st.columns(2)
        
        # Kick employee from project
        with col1:
            st.subheader("❌ Remove Employee from Project")
            emp_to_remove = st.selectbox("Select Employee", list(st.session_state.employees.keys()), key="remove_emp")
            project_to_remove_from = st.selectbox("Select Project", list(st.session_state.projects.keys()), key="remove_proj")
            
            if st.button("🔴 Kick Employee", use_container_width=True):
                if emp_to_remove in st.session_state.employees:
                    if project_to_remove_from in st.session_state.employees[emp_to_remove]["projects"]:
                        st.session_state.employees[emp_to_remove]["projects"].remove(project_to_remove_from)
                        st.session_state.projects[project_to_remove_from]["employees"].remove(emp_to_remove)
                        st.success(f"✅ {emp_to_remove} removed from {project_to_remove_from}")
                        st.rerun()
                    else:
                        st.warning(f"⚠️ {emp_to_remove} is not assigned to {project_to_remove_from}")
        
        # Add/Assign employee to project
        with col2:
            st.subheader("✅ Assign Employee to Project")
            emp_to_assign = st.selectbox("Select Employee", list(st.session_state.employees.keys()), key="assign_emp")
            project_to_assign = st.selectbox("Select Project", list(st.session_state.projects.keys()), key="assign_proj")
            
            if st.button("🟢 Assign Employee", use_container_width=True):
                if emp_to_assign in st.session_state.employees:
                    if project_to_assign not in st.session_state.employees[emp_to_assign]["projects"]:
                        st.session_state.employees[emp_to_assign]["projects"].append(project_to_assign)
                        st.session_state.projects[project_to_assign]["employees"].append(emp_to_assign)
                        st.success(f"✅ {emp_to_assign} assigned to {project_to_assign}")
                        st.rerun()
                    else:
                        st.warning(f"⚠️ {emp_to_assign} is already assigned to {project_to_assign}")
    
    # MANAGER: Projects
    elif mode == "📁 Projects":
        st.markdown('<div class="main-header">📁 Projects Management</div>', unsafe_allow_html=True)
        
        st.subheader("🔍 View Projects")
        for proj_name, proj_info in st.session_state.projects.items():
            with st.expander(f"📌 {proj_name} ({proj_info['status'].upper()})"):
                col1, col2 = st.columns(2)
                with col1:
                    st.write("**Employees:**")
                    for emp in proj_info["employees"]:
                        st.write(f"- {emp}")
                with col2:
                    st.write("**Sous-Chefs:**")
                    for sc in proj_info["sous_chefs"]:
                        st.write(f"- {sc}")
        
        st.divider()
        
        st.subheader("➕ Create New Project")
        new_proj_name = st.text_input("Project Name")
        if st.button("Create Project", use_container_width=True):
            if new_proj_name and new_proj_name not in st.session_state.projects:
                st.session_state.projects[new_proj_name] = {
                    "employees": [],
                    "sous_chefs": [],
                    "status": "active"
                }
                st.success(f"✅ Project '{new_proj_name}' created!")
                st.rerun()
            elif new_proj_name in st.session_state.projects:
                st.warning("⚠️ Project already exists!")
    
    # MANAGER: Sous-Chefs Management
    elif mode == "👨‍🍳 Sous-Chefs":
        st.markdown('<div class="main-header">👨‍🍳 Sous-Chefs Management</div>', unsafe_allow_html=True)
        st.write("Manage sous-chefs and assign them to projects")
        
        st.subheader("👨‍🍳 Current Sous-Chefs")
        sous_chefs = {k: v for k, v in st.session_state.employees.items() if v["role"] == "sous_chef"}
        if sous_chefs:
            sc_data = []
            for sc_id, sc_info in sous_chefs.items():
                sc_data.append({
                    "ID": sc_id,
                    "Name": sc_info["name"],
                    "Projects": ", ".join(sc_info["projects"]) if sc_info["projects"] else "None"
                })
            st.dataframe(pd.DataFrame(sc_data), use_container_width=True)
        else:
            st.info("ℹ️ No sous-chefs assigned yet")
        
        st.divider()
        
        col1, col2 = st.columns(2)
        
        # Assign sous-chef to project
        with col1:
            st.subheader("✅ Assign Sous-Chef to Project")
            if sous_chefs:
                sc_to_assign = st.selectbox("Select Sous-Chef", list(sous_chefs.keys()), key="assign_sc")
                project_for_sc = st.selectbox("Select Project", list(st.session_state.projects.keys()), key="sc_proj")
                
                if st.button("🟢 Assign Sous-Chef", use_container_width=True):
                    if project_for_sc not in st.session_state.employees[sc_to_assign]["projects"]:
                        st.session_state.employees[sc_to_assign]["projects"].append(project_for_sc)
                        st.session_state.projects[project_for_sc]["sous_chefs"].append(sc_to_assign)
                        st.success(f"✅ {sc_to_assign} assigned as sous-chef to {project_for_sc}")
                        st.rerun()
                    else:
                        st.warning(f"⚠️ Already assigned")
            else:
                st.info("ℹ️ Create some employees with sous-chef role first")
        
        # Remove sous-chef from project
        with col2:
            st.subheader("❌ Remove Sous-Chef from Project")
            if sous_chefs:
                sc_to_remove = st.selectbox("Select Sous-Chef", list(sous_chefs.keys()), key="remove_sc")
                project_for_sc_remove = st.selectbox("Select Project", list(st.session_state.projects.keys()), key="remove_sc_proj")
                
                if st.button("🔴 Remove Sous-Chef", use_container_width=True):
                    if project_for_sc_remove in st.session_state.employees[sc_to_remove]["projects"]:
                        st.session_state.employees[sc_to_remove]["projects"].remove(project_for_sc_remove)
                        st.session_state.projects[project_for_sc_remove]["sous_chefs"].remove(sc_to_remove)
                        st.success(f"✅ {sc_to_remove} removed from {project_for_sc_remove}")
                        st.rerun()
                    else:
                        st.warning(f"⚠️ Not assigned to this project")
    
    # MANAGER: Settings
    elif mode == "⚙️ Settings":
        st.markdown('<div class="main-header">⚙️ Manager Settings</div>', unsafe_allow_html=True)
        
        st.subheader("🔧 Configuration Options")
        st.toggle("Enable Email Notifications", value=True)
        st.toggle("Auto-assign based on availability", value=False)
        
        st.subheader("📊 System Status")
        col1, col2 = st.columns(2)
        with col1:
            api_key_set = bool(os.getenv("GEMINI_API_KEY"))
            st.info(f"API Status: {'✅ Connected' if api_key_set else '⚠️ Demo Mode'}")
        with col2:
            st.info(f"Database: {'✅ Active' if st.session_state else '❌ Inactive'}")

# ==================== EMPLOYEE CONSOLE ====================
elif st.session_state.user_role == "employee":
    
    # EMPLOYEE: Dashboard
    if mode == "📊 Dashboard":
        st.markdown('<div class="main-header">📊 Employee Dashboard</div>', unsafe_allow_html=True)
        st.markdown('<div class="sub-header">Your projects and responsibilities</div>', unsafe_allow_html=True)
        
        employee_info = st.session_state.employees[st.session_state.username]
        
        col1, col2, col3 = st.columns(3)
        with col1:
            st.metric(label="Your Role", value=employee_info["role"].upper())
        with col2:
            st.metric(label="Assigned Projects", value=len(employee_info["projects"]))
        with col3:
            st.metric(label="Status", value="🟢 Active")
        
        st.divider()
        
        st.subheader("📁 Your Projects")
        if employee_info["projects"]:
            for proj in employee_info["projects"]:
                with st.expander(f"📌 {proj}"):
                    proj_info = st.session_state.projects[proj]
                    st.write(f"**Status:** {proj_info['status'].upper()}")
                    st.write(f"**Team Members:** {len(proj_info['employees'])} employees")
                    st.write(f"**Sous-Chefs:** {len(proj_info['sous_chefs'])}")
        else:
            st.info("ℹ️ You are not assigned to any projects yet")
    
    # EMPLOYEE: My Projects
    elif mode == "📁 My Projects":
        st.markdown('<div class="main-header">📁 My Projects</div>', unsafe_allow_html=True)
        
        employee_info = st.session_state.employees[st.session_state.username]
        
        if employee_info["projects"]:
            for proj in employee_info["projects"]:
                col1, col2 = st.columns([3, 1])
                with col1:
                    st.subheader(f"📌 {proj}")
                    proj_info = st.session_state.projects[proj]
                    st.write(f"**Status:** {proj_info['status']}")
                    
                    col_a, col_b = st.columns(2)
                    with col_a:
                        st.write("**Team Members:**")
                        for emp in proj_info["employees"]:
                            st.write(f"- {st.session_state.employees[emp]['name']}")
                    with col_b:
                        st.write("**Sous-Chefs Leading:**")
                        for sc in proj_info["sous_chefs"]:
                            st.write(f"- {st.session_state.employees[sc]['name']}")
                with col2:
                    st.write("**Actions:**")
                    if st.button("View Details", key=f"details_{proj}", use_container_width=True):
                        st.info(f"Project {proj} selected - Features coming soon!")
        else:
            st.warning("⚠️ You are not assigned to any projects yet. Contact your manager!")
        
        st.divider()
        st.info("💡 As an employee, you can view project details but cannot make assignments. Contact your manager for project changes.")
    
    # EMPLOYEE: Settings
    elif mode == "⚙️ Settings":
        st.markdown('<div class="main-header">⚙️ Employee Settings</div>', unsafe_allow_html=True)
        
        employee_info = st.session_state.employees[st.session_state.username]
        
        st.subheader("👤 Profile Information")
        st.write(f"**Name:** {employee_info['name']}")
        st.write(f"**Username:** {st.session_state.username}")
        st.write(f"**Role:** {employee_info['role'].upper()}")
        st.write(f"**Projects Assigned:** {len(employee_info['projects'])}")
        
        st.divider()
        
        st.subheader("🔧 Preferences")
        st.toggle("Receive project notifications", value=True)
        st.toggle("Receive team updates", value=True)
        
        st.subheader("📧 Contact Manager")
        st.info("For project assignments, role changes, or other requests, please contact your manager.")

