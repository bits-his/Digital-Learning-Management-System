import * as React from "react"
import { Link, Navigate, useNavigate } from "react-router-dom"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { useAuth } from "@/shared/auth/auth-context"
import { useApplications } from "@/shared/data/applications/applications-context"
import { emptyPersonal } from "@/shared/data/applications/types"

export function ApplicantRegisterPage() {
  const { registerApplicant, user, isAuthenticated } = useAuth()
  const { ensureDraftForApplicant, findByEmailOrId, isApplicationsOpen } =
    useApplications()
  const navigate = useNavigate()
  const [name, setName] = React.useState("")
  const [email, setEmail] = React.useState("")
  const [password, setPassword] = React.useState("")
  const [error, setError] = React.useState<string | null>(null)

  if (!isApplicationsOpen) {
    return <Navigate to="/apply" replace />
  }

  if (isAuthenticated && user?.role === "applicant") {
    return <Navigate to="/apply/form" replace />
  }

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault()

    const existingApp = findByEmailOrId(email)
    if (existingApp) {
      setError(
        "An application already exists for this email. Sign in or check status."
      )
      toast.error("One application per email for this intake.")
      return
    }

    const result = registerApplicant({ name, email, password })
    if (!result.ok) {
      setError(result.message)
      toast.error(result.message)
      return
    }
    ensureDraftForApplicant({
      userId: result.user.id,
      personal: {
        ...emptyPersonal(),
        fullName: result.user.name,
        email: result.user.email,
      },
    })
    toast.success("Account created")
    navigate("/apply/form")
  }

  return (
    <div className="mx-auto flex w-full max-w-md flex-col gap-8 py-8">
      <div className="flex flex-col gap-2 text-center">
        <h1 className="font-heading text-3xl font-semibold tracking-tight">
          Create applicant account
        </h1>
        <p className="text-muted-foreground">
          One account and one application per person for this intake.
        </p>
      </div>
      <form onSubmit={handleSubmit} className="flex flex-col gap-6">
        <FieldGroup className="gap-5">
          <Field data-invalid={error ? true : undefined}>
            <FieldLabel htmlFor="name">Full name</FieldLabel>
            <Input
              id="name"
              className="h-11 px-3 text-base md:text-base"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </Field>
          <Field>
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
          Create account
        </Button>
        <p className="text-center text-sm text-muted-foreground">
          Already registered?{" "}
          <Link
            to="/apply/login"
            className="font-medium text-foreground underline underline-offset-4"
          >
            Sign in
          </Link>
          {" · "}
          <Link
            to="/apply"
            className="font-medium text-foreground underline underline-offset-4"
          >
            Check status
          </Link>
        </p>
      </form>
    </div>
  )
}
