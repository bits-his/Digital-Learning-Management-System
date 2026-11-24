import { Link } from "react-router-dom"
import * as React from "react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { useAuth } from "@/shared/auth/auth-context"
import { PageLayout } from "@/shared/components/page-layout"
import {
  STATUS_LOOKUP_KEY,
  useApplications,
} from "@/shared/data/applications/applications-context"

const timelineOrder = [
  "draft",
  "submitted",
  "under_review",
  "shortlisted",
  "approved",
] as const

export function ApplicantStatusPage() {
  const { user, isAuthenticated } = useAuth()
  const { getByApplicant, getApplication, markNotificationRead, isApplicationsOpen } =
    useApplications()

  const [lookupId] = React.useState(() =>
    sessionStorage.getItem(STATUS_LOOKUP_KEY)
  )

  const application = React.useMemo(() => {
    if (isAuthenticated && user?.role === "applicant") {
      return getByApplicant(user.id)
    }
    if (lookupId) return getApplication(lookupId)
    return undefined
  }, [
    getApplication,
    getByApplicant,
    isAuthenticated,
    lookupId,
    user?.id,
    user?.role,
  ])

  const canEdit =
    isAuthenticated &&
    user?.role === "applicant" &&
    application?.applicantUserId === user.id &&
    application.status === "draft" &&
    isApplicationsOpen

  if (!application) {
    return (
      <div className="mx-auto flex max-w-lg flex-col gap-4 py-10 text-center">
        <h1 className="font-heading text-2xl font-semibold">
          Check your status
        </h1>
        <p className="text-muted-foreground">
          Enter your email or application ID on the application gate.
        </p>
        <Button className="mx-auto h-11 w-fit px-6" asChild>
          <Link to="/apply">Back to gate</Link>
        </Button>
      </div>
    )
  }

  const statusIndex = timelineOrder.indexOf(
    application.status as (typeof timelineOrder)[number]
  )

  return (
    <PageLayout
      variant="form"
      eyebrow="Application status"
      title={application.business.businessName || "Your application"}
      description={`${application.id} · ${application.personal.fullName}`}
      actions={
        <Badge className="capitalize">
          {application.status.replaceAll("_", " ")}
        </Badge>
      }
    >
      <section className="flex flex-col gap-4 rounded-xl border p-5">
        <h2 className="font-heading text-lg font-semibold">Progress</h2>
        <div className="flex flex-col gap-3">
          {timelineOrder.map((status, index) => {
            const reached =
              statusIndex >= 0
                ? index <= statusIndex
                : ["waitlisted", "rejected"].includes(application.status)
                  ? index <= 2
                  : false
            return (
              <div
                key={status}
                className="flex items-center justify-between gap-3 border-b pb-3 last:border-0 last:pb-0"
              >
                <span className="text-sm capitalize">
                  {status.replaceAll("_", " ")}
                </span>
                <Badge variant={reached ? "default" : "outline"}>
                  {reached ? "Reached" : "Pending"}
                </Badge>
              </div>
            )
          })}
        </div>
        {application.status === "waitlisted" ||
        application.status === "rejected" ? (
          <>
            <Separator />
            <p className="text-sm text-muted-foreground">
              Decision: {application.status}
              {application.reviewerNote
                ? ` — ${application.reviewerNote}`
                : ""}
            </p>
          </>
        ) : null}
      </section>

      {isAuthenticated && application.applicantUserId === user?.id ? (
        <section className="flex flex-col gap-4 rounded-xl border p-5">
          <h2 className="font-heading text-lg font-semibold">Notifications</h2>
          {application.notifications.length === 0 ? (
            <p className="text-sm text-muted-foreground">No messages yet.</p>
          ) : (
            <div className="flex flex-col gap-3">
              {application.notifications.map((note) => (
                <button
                  key={note.id}
                  type="button"
                  className="rounded-lg border bg-muted/30 p-4 text-left transition-colors hover:bg-muted/50"
                  onClick={() =>
                    markNotificationRead(application.id, note.id)
                  }
                >
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-sm font-medium">{note.title}</p>
                    {!note.read ? <Badge>New</Badge> : null}
                  </div>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {note.body}
                  </p>
                </button>
              ))}
            </div>
          )}
        </section>
      ) : null}

      <div className="flex flex-wrap gap-3">
        <Button variant="outline" className="h-11" asChild>
          <Link to="/apply">Back to gate</Link>
        </Button>
        {canEdit ? (
          <Button className="h-11" asChild>
            <Link to="/apply/form">Continue application</Link>
          </Button>
        ) : null}
      </div>
    </PageLayout>
  )
}
