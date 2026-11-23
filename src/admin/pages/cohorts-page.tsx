import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { adminCohorts } from "@/shared/data/mock-admin"

export function AdminCohortsPage() {
  return (
    <div className="flex flex-col gap-4">
      <div>
        <h1 className="font-heading text-2xl font-semibold">Cohorts</h1>
        <p className="text-sm text-muted-foreground">
          Capacity, facilitators, and cohort progress.
        </p>
      </div>
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {adminCohorts.map((cohort) => (
          <Card key={cohort.name}>
            <CardHeader className="flex-row items-start justify-between gap-3 space-y-0">
              <div>
                <CardTitle className="text-base">{cohort.name}</CardTitle>
                <CardDescription>
                  {cohort.participants} participants · {cohort.facilitators}{" "}
                  facilitators
                </CardDescription>
              </div>
              <Badge variant="secondary">{cohort.status}</Badge>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col gap-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Progress</span>
                  <span className="font-medium">{cohort.progress}%</span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-muted">
                  <div
                    className="h-full rounded-full bg-primary"
                    style={{ width: `${cohort.progress}%` }}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
