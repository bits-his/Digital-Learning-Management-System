import { Link, Navigate } from "react-router-dom"

import { BrandMark } from "@/shared/components/brand-mark"
import { useAuth } from "@/shared/auth/auth-context"
import { hubPathForRole } from "@/shared/auth/types"
import { LoginForm } from "@/shared/pages/login-form"

export function LoginPage() {
  const { user, isAuthenticated } = useAuth()

  if (isAuthenticated && user) {
    return <Navigate to={hubPathForRole(user.role)} replace />
  }

  return (
    <div className="relative min-h-svh overflow-hidden">
      <div className="absolute inset-0 mesh-panel" />
      <div
        aria-hidden
        className="absolute inset-0 opacity-30"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.18'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")",
        }}
      />

      <div className="relative z-10 mx-auto flex min-h-svh max-w-6xl flex-col justify-center gap-10 px-6 py-12 lg:flex-row lg:items-center lg:gap-16 lg:px-10">
        <div className="story-enter flex max-w-xl flex-col gap-8 text-white lg:flex-1">
          <BrandMark to="/login" light />
          <div className="space-y-4">
            <p className="text-xs font-semibold tracking-[0.22em] text-white/70 uppercase">
              Bootcamp programme hub
            </p>
            <h1 className="font-heading text-4xl font-semibold text-balance md:text-5xl">
              Know your next step. Prove your progress. Grow with a mentor.
            </h1>
            <p className="max-w-md text-base leading-relaxed text-white/80">
              AAIIRI turns assessment and mentorship into a clear path —
              submit work, get feedback, meet your mentor, and build investment
              readiness with evidence, not guesswork.
            </p>
          </div>
          <div className="grid gap-3 text-sm text-white/75 sm:grid-cols-3">
            <div className="rounded-lg border border-white/15 bg-white/5 p-3 backdrop-blur-sm">
              <p className="font-heading text-base text-white">Assess</p>
              <p className="mt-1 text-white/65">Quizzes, assignments, grades</p>
            </div>
            <div className="rounded-lg border border-white/15 bg-white/5 p-3 backdrop-blur-sm">
              <p className="font-heading text-base text-white">Mentor</p>
              <p className="mt-1 text-white/65">Sessions, notes, reports</p>
            </div>
            <div className="rounded-lg border border-white/15 bg-white/5 p-3 backdrop-blur-sm">
              <p className="font-heading text-base text-white">Advance</p>
              <p className="mt-1 text-white/65">Competency you can show</p>
            </div>
          </div>
        </div>

        <div className="story-enter-delay w-full max-w-md lg:flex-none">
          <div className="rounded-2xl border border-white/20 bg-background/95 p-6 shadow-none backdrop-blur-md md:p-8">
            <LoginForm />
            <p className="mt-5 text-center text-sm text-muted-foreground">
              Applying to the Bootcamp?{" "}
              <Link
                to="/apply"
                className="font-medium text-foreground underline underline-offset-4"
              >
                Apply to Bootcamp
              </Link>
            </p>
          </div>
          <p className="mt-4 text-center text-xs text-white/60">
            Frontend prototype — demo accounts only, no live backend yet.
          </p>
        </div>
      </div>
    </div>
  )
}
