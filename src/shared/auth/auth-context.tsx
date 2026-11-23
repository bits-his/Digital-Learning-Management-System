import * as React from "react"

import {
  findMockUser,
  MOCK_PASSWORD,
  mockUsers,
} from "@/shared/data/mock-users"
import type { AuthUser, UserRole } from "@/shared/auth/types"

const STORAGE_KEY = "aaiiri-auth-user"
const APPLICANTS_KEY = "aaiiri-registered-applicants"

type AuthContextValue = {
  user: AuthUser | null
  isAuthenticated: boolean
  login: (input: {
    email: string
    password: string
    role: UserRole
  }) => { ok: true } | { ok: false; message: string }
  registerApplicant: (input: {
    name: string
    email: string
    password: string
  }) => { ok: true; user: AuthUser } | { ok: false; message: string }
  logout: () => void
}

const AuthContext = React.createContext<AuthContextValue | null>(null)

function readStoredUser(): AuthUser | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return null
    const stored = JSON.parse(raw) as AuthUser
    const fresh = mockUsers.find((user) => user.id === stored.id)
    return fresh ?? stored
  } catch {
    return null
  }
}

function readRegisteredApplicants(): AuthUser[] {
  try {
    const raw = localStorage.getItem(APPLICANTS_KEY)
    if (!raw) return []
    return JSON.parse(raw) as AuthUser[]
  } catch {
    return []
  }
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = React.useState<AuthUser | null>(() => readStoredUser())

  const persistUser = React.useCallback((next: AuthUser) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
    setUser(next)
  }, [])

  const registerApplicant = React.useCallback(
    ({
      name,
      email,
      password,
    }: {
      name: string
      email: string
      password: string
    }) => {
      if (!name.trim() || !email.trim() || !password.trim()) {
        return { ok: false as const, message: "All fields are required." }
      }
      if (password.length < 6) {
        return {
          ok: false as const,
          message: "Password must be at least 6 characters.",
        }
      }

      const applicants = readRegisteredApplicants()
      const exists = applicants.some(
        (item) => item.email.toLowerCase() === email.trim().toLowerCase()
      )
      if (exists) {
        return {
          ok: false as const,
          message: "An applicant account already exists for this email.",
        }
      }

      const created: AuthUser = {
        id: `applicant-${crypto.randomUUID().slice(0, 8)}`,
        name: name.trim(),
        email: email.trim().toLowerCase(),
        role: "applicant",
        title: "Applicant",
        avatar:
          "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=160&h=160&fit=crop&crop=face",
      }

      localStorage.setItem(
        APPLICANTS_KEY,
        JSON.stringify([...applicants, created])
      )
      localStorage.setItem(
        `aaiiri-applicant-pass:${created.email}`,
        password
      )
      persistUser(created)
      return { ok: true as const, user: created }
    },
    [persistUser]
  )

  const login = React.useCallback(
    ({
      email,
      password,
      role,
    }: {
      email: string
      password: string
      role: UserRole
    }) => {
      if (role === "applicant") {
        const applicants = readRegisteredApplicants()
        const match = applicants.find(
          (item) => item.email.toLowerCase() === email.trim().toLowerCase()
        )
        const storedPass = localStorage.getItem(
          `aaiiri-applicant-pass:${email.trim().toLowerCase()}`
        )
        if (!match || storedPass !== password) {
          return {
            ok: false as const,
            message: "Invalid applicant email or password.",
          }
        }
        persistUser(match)
        return { ok: true as const }
      }

      if (password !== MOCK_PASSWORD) {
        return {
          ok: false as const,
          message: "Invalid email or password.",
        }
      }

      const match = findMockUser(email, role)
      if (!match) {
        return {
          ok: false as const,
          message: `No ${role} account found for that email. Try the demo credentials.`,
        }
      }

      persistUser(match)
      return { ok: true as const }
    },
    [persistUser]
  )

  const logout = React.useCallback(() => {
    localStorage.removeItem(STORAGE_KEY)
    setUser(null)
  }, [])

  const value = React.useMemo(
    () => ({
      user,
      isAuthenticated: Boolean(user),
      login,
      registerApplicant,
      logout,
    }),
    [user, login, registerApplicant, logout]
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = React.useContext(AuthContext)
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider")
  }
  return context
}
