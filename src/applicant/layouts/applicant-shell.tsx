import { Link, Outlet } from "react-router-dom"

import { Button } from "@/components/ui/button"
import { BrandMark } from "@/shared/components/brand-mark"
import { HeaderUser } from "@/shared/components/header-user"
import { ThemeToggle } from "@/shared/components/theme-toggle"
import { useAuth } from "@/shared/auth/auth-context"

export function ApplicantShell() {
  const { isAuthenticated, user } = useAuth()
  const isApplicant = isAuthenticated && user?.role === "applicant"

  return (
    <div className="min-h-svh bg-background">
      <header className="sticky top-0 z-20 flex h-16 items-center justify-between border-b bg-background px-4 md:px-6">
        <BrandMark to="/apply" />
        <div className="flex items-center gap-1">
          {isApplicant ? (
            <>
              <Button variant="ghost" size="sm" asChild>
                <Link to="/apply/status">Status</Link>
              </Button>
              <Button variant="ghost" size="sm" asChild>
                <Link to="/apply/form">Application</Link>
              </Button>
            </>
          ) : null}
          <ThemeToggle />
          {isApplicant ? (
            <HeaderUser />
          ) : (
            <Button size="sm" asChild>
              <Link to="/apply/login">Sign in</Link>
            </Button>
          )}
        </div>
      </header>
      <main className="mx-auto w-full max-w-5xl px-4 py-8 md:px-6">
        <Outlet />
      </main>
    </div>
  )
}
