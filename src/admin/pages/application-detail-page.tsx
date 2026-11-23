import * as React from "react"
import { Link, useParams } from "react-router-dom"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { useAuth } from "@/shared/auth/auth-context"
import { useApplications } from "@/shared/data/applications/applications-context"
import { DOCUMENT_LABELS } from "@/shared/data/applications/gamification"
import type { CriterionScore } from "@/shared/data/applications/types"

export function AdminApplicationDetailPage() {
  const { id = "" } = useParams()
  const { user } = useAuth()
  const { getApplication, state, setScores, setStatus, weightedScore } =
    useApplications()
  const app = getApplication(id)

  const [scores, setLocalScores] = React.useState<CriterionScore[]>([])
  const [note, setNote] = React.useState("")

  React.useEffect(() => {
    if (!app) return
    setLocalScores(
      state.criteria.map((criterion) => ({
        criterionId: criterion.id,
        score:
          app.scores.find((item) => item.criterionId === criterion.id)?.score ??
          0,
      }))
    )
    setNote(app.reviewerNote ?? "")
  }, [app?.id, state.criteria])

  if (!app) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Application not found</CardTitle>
          <CardDescription>
            <Button variant="outline" asChild>
              <Link to="/admin/applications">Back to queue</Link>
            </Button>
          </CardDescription>
        </CardHeader>
      </Card>
    )
  }

  const total = weightedScore({ ...app, scores })

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <Button variant="ghost" size="sm" className="mb-2 -ml-2" asChild>
            <Link to="/admin/applications">← Queue</Link>
          </Button>
          <h1 className="font-heading text-2xl font-semibold">
            {app.business.businessName}
          </h1>
          <p className="text-sm text-muted-foreground">
            {app.id} · {app.personal.fullName}
          </p>
        </div>
        <Badge className="capitalize">{app.status.replaceAll("_", " ")}</Badge>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Profile</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-2 text-sm">
            <p>
              <span className="text-muted-foreground">Applicant:</span>{" "}
              {app.personal.fullName} · {app.personal.roleTitle}
            </p>
            <p>
              <span className="text-muted-foreground">Contact:</span>{" "}
              {app.personal.email} · {app.personal.phone}
            </p>
            <p>
              <span className="text-muted-foreground">Residence:</span>{" "}
              {app.personal.city}, {app.personal.country}
            </p>
            <p>
              <span className="text-muted-foreground">Registration:</span>{" "}
              {app.business.registrationStatus}
            </p>
            <p>
              <span className="text-muted-foreground">Sector:</span>{" "}
              {app.business.sector}
            </p>
            <p>
              <span className="text-muted-foreground">Country of operation:</span>{" "}
              {app.business.country}
            </p>
            <p>
              <span className="text-muted-foreground">Founded:</span>{" "}
              {app.business.yearFounded}
            </p>
            <p>
              <span className="text-muted-foreground">Stage:</span>{" "}
              {app.business.stage}
            </p>
            <p>
              <span className="text-muted-foreground">Team size:</span>{" "}
              {app.business.employees}
            </p>
            <p>
              <span className="text-muted-foreground">Export experience:</span>{" "}
              {app.business.exportExperience}
            </p>
            <p>
              <span className="text-muted-foreground">Primary need:</span>{" "}
              {app.business.primaryNeed}
            </p>
            <p>
              <span className="text-muted-foreground">Funding:</span>{" "}
              {app.business.fundingNeed}
            </p>
            <p>
              <span className="text-muted-foreground">Markets:</span>{" "}
              {app.business.targetMarkets}
            </p>
            <p className="pt-2 text-muted-foreground">{app.business.description}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Documents</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-2">
            {app.documents.map((doc) => (
              <div
                key={doc.id}
                className="flex items-center justify-between gap-2 border-b pb-2 text-sm last:border-0"
              >
                <span>{DOCUMENT_LABELS[doc.type]}</span>
                <span className="text-xs text-muted-foreground">
                  {doc.name}
                </span>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Scoring rubric</CardTitle>
          <CardDescription>
            Weighted total: {total !== null ? `${total}/100` : "—"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <FieldGroup>
            {state.criteria.map((criterion) => {
              const value =
                scores.find((item) => item.criterionId === criterion.id)
                  ?.score ?? 0
              return (
                <Field key={criterion.id} orientation="horizontal">
                  <div className="flex-1">
                    <FieldLabel>
                      {criterion.label} ({criterion.weight}%)
                    </FieldLabel>
                    <p className="text-xs text-muted-foreground">
                      {criterion.description}
                    </p>
                  </div>
                  <Input
                    type="number"
                    min={0}
                    max={10}
                    className="w-20"
                    value={value}
                    onChange={(e) => {
                      const score = Number(e.target.value)
                      setLocalScores((prev) =>
                        prev.map((item) =>
                          item.criterionId === criterion.id
                            ? { ...item, score }
                            : item
                        )
                      )
                    }}
                  />
                </Field>
              )
            })}
            <Field>
              <FieldLabel htmlFor="note">Reviewer notes</FieldLabel>
              <Textarea
                id="note"
                value={note}
                onChange={(e) => setNote(e.target.value)}
              />
            </Field>
          </FieldGroup>
        </CardContent>
        <CardFooter className="flex flex-wrap gap-2">
          <Button onClick={() => setScores(app.id, scores, note)}>
            Save scores
          </Button>
          <Button
            variant="outline"
            onClick={() =>
              setStatus(
                app.id,
                "shortlisted",
                user?.name ?? "Admin",
                note || "Shortlisted after review"
              )
            }
          >
            Shortlist
          </Button>
          <Button
            variant="outline"
            onClick={() =>
              setStatus(
                app.id,
                "waitlisted",
                user?.name ?? "Admin",
                note || "Moved to waitlist"
              )
            }
          >
            Waitlist
          </Button>
          <Button
            variant="outline"
            onClick={() =>
              setStatus(
                app.id,
                "approved",
                user?.name ?? "Admin",
                note || "Approved for Bootcamp"
              )
            }
          >
            Approve
          </Button>
          <Button
            variant="destructive"
            onClick={() =>
              setStatus(
                app.id,
                "rejected",
                user?.name ?? "Admin",
                note || "Not selected this cycle"
              )
            }
          >
            Reject
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}
