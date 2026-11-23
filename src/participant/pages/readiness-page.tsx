import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { readinessChecklist } from "@/shared/data/mock-participant"

export function ParticipantReadinessPage() {
  return (
    <div className="flex flex-col gap-4">
      <div>
        <h1 className="font-heading text-2xl font-semibold">
          Investment readiness
        </h1>
        <p className="text-sm text-muted-foreground">
          Checklist toward deal-room readiness.
        </p>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Readiness score: 71</CardTitle>
          <CardDescription>
            Complete pending items to unlock investor introductions.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-3">
          {readinessChecklist.map((item) => (
            <div
              key={item.area}
              className="flex items-center justify-between gap-4 border-b pb-3 last:border-b-0 last:pb-0"
            >
              <span className="text-sm">{item.area}</span>
              <Badge
                variant={
                  item.status === "Completed" ? "default" : "secondary"
                }
              >
                {item.status}
              </Badge>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  )
}
