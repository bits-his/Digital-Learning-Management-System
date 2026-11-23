import * as React from "react"
import { Link, Navigate, useNavigate } from "react-router-dom"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { useAuth } from "@/shared/auth/auth-context"

export function ApplicantLoginPage() {
  const { login, user, isAuthenticated } = useAuth()
  const navigate = useNavigate()
  const [email, setEmail] = React.useState("")
  const [password, setPassword] = React.useState("")
  const [error, setError] = React.useState<string | null>(null)

  if (isAuthenticated && user?.role === "applicant") {
    return <Navigate to="/apply/form" replace />
  }

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault()
    const result = login({ email, password, role: "applicant" })
    if (!result.ok) {
      setError(result.message)
      toast.error(result.message)
      return
    }
    toast.success("Signed in")
    navigate("/apply/form")
  }

  return (
    <div className="mx-auto flex w-full max-w-md flex-col gap-8 py-8">
      <div className="flex flex-col gap-2 text-center">
        <h1 className="font-heading text-3xl font-semibold tracking-tight">
          Applicant sign in
        </h1>
        <p className="text-muted-foreground">
          Continue your application or check status.
        </p>
      </div>
      <form onSubmit={handleSubmit} className="flex flex-col gap-6">
        <FieldGroup className="gap-5">
          <Field data-invalid={error ? true : undefined}>
            <FieldLabel htmlFor="email">Email</FieldLabel>
            <Input
              id="email"
              type="email"
              className="h-11 px-3 text-base md:text-base"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </Field>
          <Field>
            <FieldLabel htmlFor="password">Password</FieldLabel>
            <Input
              id="password"
              type="password"
              className="h-11 px-3 text-base md:text-base"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </Field>
          {error ? <p className="text-sm text-destructive">{error}</p> : null}
        </FieldGroup>
        <Button type="submit" size="lg" className="h-11 w-full text-base">
          Sign in
        </Button>
        <p className="text-center text-sm text-muted-foreground">
          New applicant?{" "}
          <Link
            to="/apply/register"
            className="font-medium text-foreground underline underline-offset-4"
          >
            Create account
          </Link>
        </p>
      </form>
    </div>
  )
}
