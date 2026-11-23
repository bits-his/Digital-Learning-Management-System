import { toast } from "sonner"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { adminApplications } from "@/shared/data/mock-admin"

export function AdminApplicationsPage() {
  return (
    <div className="flex flex-col gap-4">
      <div>
        <h1 className="font-heading text-2xl font-semibold">Applications</h1>
        <p className="text-sm text-muted-foreground">
          Review and shortlist Bootcamp applicants.
        </p>
      </div>
      <div className="flex flex-col gap-3">
        {adminApplications.map((app) => (
          <Card key={app.id}>
            <CardHeader className="flex-row items-start justify-between gap-4 space-y-0">
              <div className="flex flex-col gap-1">
                <CardTitle className="text-base">{app.business}</CardTitle>
                <CardDescription>
                  {app.id} · {app.country} · {app.sector}
                </CardDescription>
              </div>
              <Badge variant="secondary">{app.status}</Badge>
            </CardHeader>
            <CardContent className="flex flex-wrap items-center justify-between gap-3">
              <p className="text-sm text-muted-foreground">Score: {app.score}</p>
              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => toast.message(`Waiting list: ${app.id}`)}
                >
                  Waitlist
                </Button>
                <Button
                  size="sm"
                  onClick={() => toast.success(`Shortlisted ${app.id}`)}
                >
                  Shortlist
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
