import { Navigate, Outlet, useLocation } from "react-router-dom"

import { useAuth } from "@/shared/auth/auth-context"
import type { UserRole } from "@/shared/auth/types"

function homeForRole(role: UserRole) {
  if (role === "admin") return "/admin"
  if (role === "participant") return "/participant"
  return "/apply/status"
}

export function RequireAuth({ role }: { role: UserRole }) {
  const { user, isAuthenticated } = useAuth()
  const location = useLocation()

  if (!isAuthenticated || !user) {
    return (
      <Navigate
        to={role === "applicant" ? "/apply/login" : "/login"}
        replace
        state={{ from: location }}
      />
    )
  }

  if (user.role !== role) {
    return <Navigate to={homeForRole(user.role)} replace />
  }

  return <Outlet />
}
