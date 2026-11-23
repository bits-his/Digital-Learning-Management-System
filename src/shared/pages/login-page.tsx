import { Navigate } from "react-router-dom"

import { BrandMark } from "@/shared/components/brand-mark"
import { useAuth } from "@/shared/auth/auth-context"
import { LoginForm } from "@/shared/pages/login-form"

export function LoginPage() {
  const { user, isAuthenticated } = useAuth()

  if (isAuthenticated && user) {
    return (
      <Navigate
        to={user.role === "admin" ? "/admin" : "/participant"}
        replace
      />
    )
  }

  return (
    <div className="grid min-h-svh lg:grid-cols-2">
      <div className="flex flex-col gap-4 p-6 md:p-10">
        <div className="flex justify-center gap-2 md:justify-start">
          <BrandMark to="/login" />
        </div>
        <div className="flex flex-1 items-center justify-center">
          <div className="w-full max-w-xs">
            <LoginForm />
          </div>
        </div>
      </div>
      <div className="relative hidden bg-muted lg:block">
        <div className="absolute inset-0 flex flex-col justify-between p-10">
          <div>
            <p className="font-heading text-sm font-medium tracking-wide text-muted-foreground uppercase">
              Digital Learning Platform
            </p>
            <h2 className="mt-4 max-w-md font-heading text-3xl font-semibold tracking-tight text-foreground">
              Enterprise development, investment readiness, and programme
              delivery in one place.
            </h2>
          </div>
          <div className="max-w-sm text-sm leading-relaxed text-muted-foreground">
            <p>
              Manage applications, cohorts, live learning, mentorship, and
              matchmaking for AAIIRI Bootcamp programmes.
            </p>
            <p className="mt-4 text-xs">
              Frontend mock — no backend connected yet.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
