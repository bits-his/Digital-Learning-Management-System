import { Navigate, Outlet, useLocation } from "react-router-dom"

import { useAuth } from "@/shared/auth/auth-context"
import { hubPathForRole, type UserRole } from "@/shared/auth/types"

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
    return <Navigate to={hubPathForRole(user.role)} replace />
  }

  return <Outlet />
}
