import { Link } from "react-router-dom"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { useAuth } from "@/shared/auth/auth-context"
import { PageLayout } from "@/shared/components/page-layout"
import { useApplications } from "@/shared/data/applications/applications-context"

export function AdminSelectionDecisionsPage() {
  const { user } = useAuth()
  const { state, setStatus, weightedScore } = useApplications()

  const actionable = state.applications.filter((app) =>
    ["submitted", "under_review", "shortlisted", "waitlisted"].includes(
      app.status
    )
  )

  return (
    <PageLayout variant="bare">
      <div className="flex flex-col gap-3">
        {actionable.map((app) => (
          <Card key={app.id}>
            <CardHeader className="flex-row items-start justify-between gap-4">
              <div>
                <CardTitle className="text-base">
                  {app.business.businessName}
                </CardTitle>
                <CardDescription>
                  {app.id} · Score {weightedScore(app) ?? "—"}/100
                </CardDescription>
              </div>
              <Badge className="capitalize" variant="secondary">
                {app.status.replaceAll("_", " ")}
              </Badge>
            </CardHeader>
            <CardContent className="flex flex-wrap gap-2">
              <Button size="sm" variant="outline" asChild>
                <Link to={`/admin/applications/${app.id}`}>Review</Link>
              </Button>
              <Button
                size="sm"
                onClick={() =>
                  setStatus(
                    app.id,
                    "shortlisted",
                    user?.name ?? "Admin",
                    "Shortlisted from decisions board"
                  )
                }
              >
                Shortlist
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() =>
                  setStatus(
                    app.id,
                    "approved",
                    user?.name ?? "Admin",
                    "Approved from decisions board"
                  )
                }
              >
                Approve
              </Button>
              <Button
                size="sm"
                variant="destructive"
                onClick={() =>
                  setStatus(
                    app.id,
                    "rejected",
                    user?.name ?? "Admin",
                    "Rejected from decisions board"
                  )
                }
              >
                Reject
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </PageLayout>
  )
}
