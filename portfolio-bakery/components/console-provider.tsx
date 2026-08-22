'use client'

import { createContext, useContext, useState, type ReactNode } from 'react'

// Hardcoded credentials for testing
const MANAGER_CREDS = { username: 'manager', password: 'manager123' }
const SARAH_CREDS = {
  username: 'sarah',
  password: 'sarah123',
  employeeId: 'sarah',
  displayName: 'Sarah Patel',
}

export type UserRole = 'manager' | 'employee' | null

export type Employee = {
  id: string
  name: string
  role: 'owner' | 'sous_chef' | 'team_member'
  projects: string[] // Project IDs assigned to this employee
}

export type Project = {
  id: string
  name: string
  owner: string
  sous_chef: string | null
  teamMembers: string[] // Employee IDs assigned to this project
}

export type HandoverItem = {
  id: string
  fromEmployeeId: string
  toEmployeeId: string
  projectId: string
  status: 'pending' | 'accepted' | 'completed'
  createdAt: Date
}

export type ConsoleContextType = {
  // Auth
  isLoggedIn: boolean
  userRole: UserRole
  username: string | null
  displayName: string | null
  employeeId: string | null
  login: (username: string, password: string) => boolean
  logout: () => void

  // Data
  projects: Project[]
  employees: Employee[]
  handoverQueue: HandoverItem[]

  // Manager actions - Projects
  createProject: (name: string, ownerId: string) => void
  deleteProject: (projectId: string) => void
  updateSousChef: (projectId: string, sousChefId: string | null) => void
  canBeSousChef: (personName: string, projectId: string) => boolean

  // Manager actions - Team
  addTeamMember: (name: string) => void
  removeTeamMember: (employeeId: string) => void
  assignToProject: (employeeId: string, projectId: string) => void
  removeFromProject: (employeeId: string, projectId: string) => void

  // Manager actions - Handover
  createHandover: (fromEmployeeId: string, toEmployeeId: string, projectId: string) => void
  completeHandover: (handoverId: string) => void
  transferProjectOwnership: (projectId: string, newOwnerName: string) => void
  logCompletedHandover: (fromEmployeeId: string, toEmployeeId: string, projectId: string) => void
}

const ConsoleContext = createContext<ConsoleContextType | undefined>(undefined)

export function ConsoleProvider({ children }: { children: ReactNode }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [userRole, setUserRole] = useState<UserRole>(null)
  const [username, setUsername] = useState<string | null>(null)
  const [displayName, setDisplayName] = useState<string | null>(null)
  const [employeeId, setEmployeeId] = useState<string | null>(null)

  // Real data from portfolio-bakery
  const [employees, setEmployees] = useState<Employee[]>([
    { id: 'alex', name: 'Alex Chen', role: 'owner', projects: ['momentum-alpha', 'mean-reversion', 'overnight-gap'] },
    { id: 'sarah', name: 'Sarah Patel', role: 'owner', projects: ['volatility-filter'] },
    { id: 'daniel', name: 'Daniel Kim', role: 'owner', projects: [] },
  ])

  const [projects, setProjects] = useState<Project[]>([
    {
      id: 'momentum-alpha',
      name: 'Momentum Alpha',
      owner: 'Alex Chen',
      sous_chef: 'Sarah Patel',
      teamMembers: ['daniel'],
    },
    {
      id: 'mean-reversion',
      name: 'Mean Reversion Strategy',
      owner: 'Alex Chen',
      sous_chef: 'Daniel Kim',
      teamMembers: ['sarah'],
    },
    {
      id: 'overnight-gap',
      name: 'Overnight Gap Reversal',
      owner: 'Alex Chen',
      sous_chef: null,
      teamMembers: [],
    },
    {
      id: 'volatility-filter',
      name: 'Volatility Filter',
      owner: 'Sarah Patel',
      sous_chef: 'Daniel Kim',
      teamMembers: ['alex'],
    },
  ])

  const [handoverQueue, setHandoverQueue] = useState<HandoverItem[]>([])

  const login = (inputUsername: string, password: string): boolean => {
    if (
      inputUsername === MANAGER_CREDS.username &&
      password === MANAGER_CREDS.password
    ) {
      setIsLoggedIn(true)
      setUserRole('manager')
      setUsername(inputUsername)
      setDisplayName('Manager')
      setEmployeeId(null)
      return true
    } else if (
      inputUsername === SARAH_CREDS.username &&
      password === SARAH_CREDS.password
    ) {
      setIsLoggedIn(true)
      setUserRole('employee')
      setUsername(inputUsername)
      setDisplayName(SARAH_CREDS.displayName)
      setEmployeeId(SARAH_CREDS.employeeId)
      return true
    }
    return false
  }

  const logout = () => {
    setIsLoggedIn(false)
    setUserRole(null)
    setUsername(null)
    setDisplayName(null)
    setEmployeeId(null)
  }

  const updateSousChef = (projectId: string, sousChefId: string | null) => {
    setProjects((prev) =>
      prev.map((p) =>
        p.id === projectId
          ? {
            ...p,
            sous_chef: sousChefId
              ? employees.find((e) => e.id === sousChefId)?.name || null
              : null,
          }
          : p
      )
    )
  }

  const createProject = (name: string, ownerId: string) => {
    const owner = employees.find((e) => e.id === ownerId)
    if (!owner) return

    const newProjectId = name.toLowerCase().replace(/\s+/g, '-')
    const newProject: Project = {
      id: newProjectId,
      name,
      owner: owner.name,
      sous_chef: null,
      teamMembers: [],
    }

    setProjects((prev) => [...prev, newProject])

    // Add project to owner's projects list
    setEmployees((prev) =>
      prev.map((e) =>
        e.id === ownerId
          ? { ...e, projects: [...e.projects, newProjectId] }
          : e
      )
    )
  }

  const deleteProject = (projectId: string) => {
    setProjects((prev) => prev.filter((p) => p.id !== projectId))

    // Remove project from all employees
    setEmployees((prev) =>
      prev.map((e) => ({
        ...e,
        projects: e.projects.filter((p) => p !== projectId),
      }))
    )
  }

  const addTeamMember = (name: string) => {
    const id = name.toLowerCase().replace(/\s+/g, '-')

    // Check if already exists
    if (employees.find((e) => e.id === id)) return

    const newMember: Employee = {
      id,
      name,
      role: 'team_member',
      projects: [],
    }

    setEmployees((prev) => [...prev, newMember])
  }

  const removeTeamMember = (employeeId: string) => {
    // Remove from all projects
    setProjects((prev) =>
      prev.map((p) => ({
        ...p,
        teamMembers: p.teamMembers.filter((id) => id !== employeeId),
        sous_chef: p.sous_chef === employees.find((e) => e.id === employeeId)?.name ? null : p.sous_chef,
      }))
    )

    // Remove from employees list
    setEmployees((prev) => prev.filter((e) => e.id !== employeeId))
  }

  const assignToProject = (employeeId: string, projectId: string) => {
    const employee = employees.find((e) => e.id === employeeId)
    if (!employee) return

    setProjects((prev) =>
      prev.map((p) =>
        p.id === projectId
          ? {
            ...p,
            teamMembers: p.teamMembers.includes(employeeId)
              ? p.teamMembers
              : [...p.teamMembers, employeeId],
          }
          : p
      )
    )

    setEmployees((prev) =>
      prev.map((e) =>
        e.id === employeeId
          ? {
            ...e,
            projects: e.projects.includes(projectId)
              ? e.projects
              : [...e.projects, projectId],
          }
          : e
      )
    )
  }

  const removeFromProject = (employeeId: string, projectId: string) => {
    setProjects((prev) =>
      prev.map((p) =>
        p.id === projectId
          ? {
            ...p,
            teamMembers: p.teamMembers.filter((id) => id !== employeeId),
          }
          : p
      )
    )

    setEmployees((prev) =>
      prev.map((e) =>
        e.id === employeeId
          ? {
            ...e,
            projects: e.projects.filter((p) => p !== projectId),
          }
          : e
      )
    )
  }

  const createHandover = (fromEmployeeId: string, toEmployeeId: string, projectId: string) => {
    const newHandover: HandoverItem = {
      id: Date.now().toString(),
      fromEmployeeId,
      toEmployeeId,
      projectId,
      status: 'pending',
      createdAt: new Date(),
    }

    setHandoverQueue((prev) => [...prev, newHandover])
  }

  const completeHandover = (handoverId: string) => {
    const handover = handoverQueue.find((h) => h.id === handoverId)
    if (!handover) return

    const toEmployee = employees.find((e) => e.id === handover.toEmployeeId)
    if (toEmployee) {
      transferProjectOwnership(handover.projectId, toEmployee.name)
    }

    setHandoverQueue((prev) =>
      prev.map((h) =>
        h.id === handoverId
          ? { ...h, status: 'completed' }
          : h
      )
    )
  }

  const transferProjectOwnership = (projectId: string, newOwnerName: string) => {
    const newOwner = employees.find((e) => e.name === newOwnerName)
    const previousOwnerName = projects.find((p) => p.id === projectId)?.owner
    const previousOwner = employees.find((e) => e.name === previousOwnerName)

    setProjects((prev) =>
      prev.map((p) =>
        p.id === projectId
          ? {
              ...p,
              owner: newOwnerName,
              sous_chef: p.sous_chef === newOwnerName ? null : p.sous_chef,
              teamMembers: newOwner
                ? p.teamMembers.filter((id) => id !== newOwner.id)
                : p.teamMembers,
            }
          : p,
      ),
    )

    setEmployees((prev) =>
      prev.map((e) => {
        if (previousOwner && e.id === previousOwner.id) {
          return { ...e, projects: e.projects.filter((id) => id !== projectId) }
        }
        if (newOwner && e.id === newOwner.id) {
          return {
            ...e,
            projects: e.projects.includes(projectId)
              ? e.projects
              : [...e.projects, projectId],
          }
        }
        return e
      }),
    )
  }

  const logCompletedHandover = (
    fromEmployeeId: string,
    toEmployeeId: string,
    projectId: string,
  ) => {
    setHandoverQueue((prev) => [
      ...prev,
      {
        id: Date.now().toString(),
        fromEmployeeId,
        toEmployeeId,
        projectId,
        status: 'completed',
        createdAt: new Date(),
      },
    ])
  }

  const canBeSousChef = (personName: string, projectId: string): boolean => {
    const project = projects.find((p) => p.id === projectId)
    if (!project) return false
    // Cannot be sous-chef if already the owner of this project
    return project.owner !== personName
  }

  return (
    <ConsoleContext.Provider
      value={{
        isLoggedIn,
        userRole,
        username,
        displayName,
        employeeId,
        login,
        logout,
        projects,
        employees,
        handoverQueue,
        updateSousChef,
        canBeSousChef,
        createProject,
        deleteProject,
        addTeamMember,
        removeTeamMember,
        assignToProject,
        removeFromProject,
        createHandover,
        completeHandover,
        transferProjectOwnership,
        logCompletedHandover,
      }}
    >
      {children}
    </ConsoleContext.Provider>
  )
}

export const useConsole = () => {
  const context = useContext(ConsoleContext)
  if (!context) {
    throw new Error('useConsole must be used within ConsoleProvider')
  }
  return context
}
