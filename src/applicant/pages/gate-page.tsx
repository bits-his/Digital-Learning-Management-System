import * as React from "react"
import { Link, useNavigate } from "react-router-dom"
import { toast } from "sonner"

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { Field, FieldDescription, FieldGroup, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import { useAuth } from "@/shared/auth/auth-context"
import {
  STATUS_LOOKUP_KEY,
  useApplications,
} from "@/shared/data/applications/applications-context"

export function ApplicantGatePage() {
  const navigate = useNavigate()
  const { user, isAuthenticated } = useAuth()
  const {
    state,
    isApplicationsOpen,
    getByApplicant,
    findByEmailOrId,
  } = useApplications()
  const [query, setQuery] = React.useState("")
  const [lookupError, setLookupError] = React.useState<string | null>(null)

  const myApp =
    isAuthenticated && user?.role === "applicant"
      ? getByApplicant(user.id)
      : undefined

  const closeDate = new Date(state.deadline.closeAt).toLocaleDateString(
    undefined,
    { day: "numeric", month: "long", year: "numeric" }
  )

  function handleStart() {
    if (!isApplicationsOpen) {
      toast.error("Applications are closed for this intake.")
      return
    }
    if (isAuthenticated && user?.role === "applicant") {
      navigate("/apply/form")
      return
    }
    navigate("/apply/register")
  }

  function handleCheckStatus(event: React.FormEvent) {
    event.preventDefault()
    const match = findByEmailOrId(query)
    if (!match) {
      setLookupError(
        "No application found. Use your email or application ID (e.g. APP-2041)."
      )
      return
    }
    setLookupError(null)
    sessionStorage.setItem(STATUS_LOOKUP_KEY, match.id)
    navigate("/apply/status")
  }

  return (
    <div className="mx-auto flex w-full max-w-lg flex-col gap-8 py-6">
      <div className="flex flex-col gap-2">
        <p className="text-sm font-medium tracking-wide text-muted-foreground uppercase">
          {state.deadline.label}
        </p>
        <h1 className="font-heading text-3xl font-semibold tracking-tight">
          Bootcamp application
        </h1>
        <p className="text-muted-foreground">
          One application per person for this intake. Start or continue below, or
          check status with your email or application ID.
        </p>
      </div>

      <Alert variant={isApplicationsOpen ? "default" : "destructive"}>
        <AlertTitle>
          {isApplicationsOpen ? "Applications are open" : "Applications are closed"}
        </AlertTitle>
        <AlertDescription>
          {isApplicationsOpen
            ? `Submit before ${closeDate}.`
            : `The window closed on ${closeDate}. You can still check your status.`}
        </AlertDescription>
      </Alert>

      <div className="flex flex-col gap-3">
        {myApp ? (
          <>
            <Button size="lg" className="h-11 w-full text-base" asChild>
              <Link
                to={
                  myApp.status === "draft" ? "/apply/form" : "/apply/status"
                }
              >
                {myApp.status === "draft"
                  ? "Continue application"
                  : "View my status"}
              </Link>
            </Button>
          </>
        ) : (
          <Button
            size="lg"
            className="h-11 w-full text-base"
            disabled={!isApplicationsOpen}
            onClick={handleStart}
          >
            Start application
          </Button>
        )}
        {!isAuthenticated ? (
          <Button
            size="lg"
            variant="outline"
            className="h-11 w-full text-base"
            asChild
          >
            <Link to="/apply/login">Sign in to continue</Link>
          </Button>
        ) : null}
      </div>

      <div className="flex items-center gap-3">
        <Separator className="flex-1" />
        <span className="text-xs tracking-wide text-muted-foreground uppercase">
          Or check status
        </span>
        <Separator className="flex-1" />
      </div>

      <form onSubmit={handleCheckStatus} className="flex flex-col gap-4">
        <FieldGroup>
          <Field data-invalid={lookupError ? true : undefined}>
            <FieldLabel htmlFor="statusQuery">Email or application ID</FieldLabel>
            <Input
              id="statusQuery"
              className="h-11 px-3 text-base md:text-base"
              placeholder="you@email.com or APP-2041"
              value={query}
              onChange={(event) => {
                setQuery(event.target.value)
                setLookupError(null)
              }}
              required
            />
            <FieldDescription>
              Demo IDs: APP-2041, APP-2038 — or any seeded applicant email.
            </FieldDescription>
            {lookupError ? (
              <FieldDescription className="text-destructive">
                {lookupError}
              </FieldDescription>
            ) : null}
          </Field>
        </FieldGroup>
        <Button
          type="submit"
          size="lg"
          variant="secondary"
          className="h-11 w-full text-base"
        >
          Check status
        </Button>
      </form>
    </div>
  )
}
