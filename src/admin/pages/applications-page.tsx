import { Link } from "react-router-dom"
import * as React from "react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { PageLayout } from "@/shared/components/page-layout"
import { useApplications } from "@/shared/data/applications/applications-context"
import type { ApplicationStatus } from "@/shared/data/applications/types"

export function AdminApplicationsPage() {
  const { state, weightedScore } = useApplications()
  const [status, setStatus] = React.useState<string>("all")

  const filtered = state.applications.filter((app) =>
    status === "all" ? true : app.status === status
  )

  return (
    <PageLayout
      variant="standard"
      title="Applications"
      description="Screen, score, and progress applicants through selection."
      actions={
        <Select value={status} onValueChange={setStatus}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Filter status" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectItem value="all">All statuses</SelectItem>
              {(
                [
                  "draft",
                  "submitted",
                  "under_review",
                  "shortlisted",
                  "waitlisted",
                  "approved",
                  "rejected",
                ] as ApplicationStatus[]
              ).map((value) => (
                <SelectItem key={value} value={value}>
                  {value.replaceAll("_", " ")}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
      }
    >
      <div className="flex flex-col gap-3">
        {filtered.map((app) => {
          const score = weightedScore(app)
          return (
            <Card key={app.id}>
              <CardHeader className="flex-row items-start justify-between gap-4">
                <div>
                  <CardTitle className="text-base">
                    {app.business.businessName || app.personal.fullName}
                  </CardTitle>
                  <CardDescription>
                    {app.id} · {app.business.country || "—"} ·{" "}
                    {app.business.sector || "—"}
                  </CardDescription>
                </div>
                <Badge className="capitalize" variant="secondary">
                  {app.status.replaceAll("_", " ")}
                </Badge>
              </CardHeader>
              <CardContent className="flex flex-wrap items-center justify-between gap-3">
                <p className="text-sm text-muted-foreground">
                  Applicant: {app.personal.fullName}
                  {score !== null ? ` · Score ${score}/100` : " · Not scored"}
                </p>
                <Button size="sm" asChild>
                  <Link to={`/admin/applications/${app.id}`}>Open review</Link>
                </Button>
              </CardContent>
            </Card>
          )
        })}
      </div>
    </PageLayout>
  )
}
