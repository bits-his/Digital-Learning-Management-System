import * as React from "react"

import {
  findMockUser,
  MOCK_PASSWORD,
  mockUsers,
} from "@/shared/data/mock-users"
import type { AuthUser, UserRole } from "@/shared/auth/types"

const STORAGE_KEY = "aaiiri-auth-user"

type AuthContextValue = {
  user: AuthUser | null
  isAuthenticated: boolean
  login: (input: {
    email: string
    password: string
    role: UserRole
  }) => { ok: true } | { ok: false; message: string }
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

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = React.useState<AuthUser | null>(() => readStoredUser())

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

      localStorage.setItem(STORAGE_KEY, JSON.stringify(match))
      setUser(match)
      return { ok: true as const }
    },
    []
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
      logout,
    }),
    [user, login, logout]
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
