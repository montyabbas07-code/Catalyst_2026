# 🎯 Catalyst 2026 - Manager & Employee Console Guide

## Overview
The application now features a role-based console system with:
- **Manager Console** - Full team management capabilities
- **Employee Console** - View-only access to project information

---

## 🔐 Login Credentials

### Manager Account
- **Username:** `manager`
- **Password:** `manager123`
- **Privileges:** Full access to all management features

### Employee Account  
- **Username:** `employee`
- **Password:** `employee123`
- **Privileges:** View projects and limited dashboard access

---

## 📊 Manager Console Features

### 1. **Dashboard** 📊 
- Overview of total projects, employees, and active projects
- Summary table showing all projects with team composition
- Real-time metrics on team structure

### 2. **Manage Employees** 👥
- View complete employee directory with roles and assigned projects
- **Assign employees to projects** - Add employees to existing projects
- **Kick employees from projects** - Remove employees from specific projects
- Validation to prevent duplicate assignments or invalid removals

### 3. **Projects** 📁
- View all projects with their team members and sous-chefs
- **Create new projects** - Add new projects to the system
- Expandable project details for quick review
- Active/inactive project status tracking

### 4. **Sous-Chefs Management** 👨‍🍳
- View all sous-chefs (assistant chefs) and their assigned projects
- **Assign sous-chefs to projects** - Designate sous-chefs as project leads
- **Remove sous-chefs from projects** - Unassign sous-chefs as needed
- Dedicated sous-chef team structure management

### 5. **Settings** ⚙️
- Configuration options for email notifications
- Auto-assignment preferences
- System status indicators (API, Database)

---

## 👥 Employee Console Features

### 1. **Dashboard** 📊
- Personal role display and active project count
- View all assigned projects with team composition
- Quick overview of sous-chefs on each project
- Status indicator (always 🟢 Active)

### 2. **My Projects** 📁
- Detailed view of all assigned projects
- Team member listings for each project
- Sous-chefs leading each project
- Read-only access (no assignment capabilities)
- Contact manager link for project changes

### 3. **Settings** ⚙️
- Profile information display (name, username, role, projects)
- Notification preferences
- Direct contact info to reach manager

---

## 📝 Sample Data

The application comes pre-loaded with:

**Projects:**
- Project Alpha (Active)
- Project Beta (Active)
- Project Gamma (Active)

**Employees:**
- `employee` - John Doe (Employee role)
- `sous_chef_user` - Jane Smith (Sous-Chef role)
- `emp2` - Bob Wilson (Employee role)

---

## 🔄 How to Use

### For Manager:
1. Login with `manager` / `manager123`
2. Navigate using the sidebar menu
3. Use Dashboard for quick overview
4. Go to "Manage Employees" to assign/remove staff
5. Use "Sous-Chefs" section to manage assistant leadership
6. Create projects in the "Projects" section

### For Employee:
1. Login with `employee` / `employee123`
2. View your assigned projects on Dashboard
3. Check project details in "My Projects"
4. Update preferences in Settings
5. Cannot make project assignments (manager only)

---

## ✨ Key Features

✅ **Session-based authentication** - Login/logout functionality  
✅ **Role-based access control** - Different views for manager vs employee  
✅ **Project management** - Create, assign, and remove projects  
✅ **Team structure** - Manage employees and sous-chefs  
✅ **Real-time updates** - Changes reflected immediately with `st.rerun()`  
✅ **Data persistence** - Uses Streamlit session state for runtime data  
✅ **Responsive UI** - Emoji-rich interface for better UX  

---

## 🚀 Running the Application

```bash
streamlit run app.py
```

The app will open in your default browser at `http://localhost:8501`

---

## 💾 Data Storage Note

Currently, all data is stored in Streamlit session state (in-memory). 
To make it persistent, integrate a database (SQLite, PostgreSQL, etc.) in future versions.

---

## 📌 Future Enhancements

- Database integration for persistent data
- Email notifications for assignments
- Project status updates and milestones
- Employee performance tracking
- Audit logs for all manager actions
- Advanced filtering and search capabilities
