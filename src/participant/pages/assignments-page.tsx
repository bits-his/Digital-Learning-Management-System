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
import { participantAssignments } from "@/shared/data/mock-participant"

export function ParticipantAssignmentsPage() {
  return (
    <div className="flex flex-col gap-4">
      <div>
        <h1 className="font-heading text-2xl font-semibold">Assignments</h1>
        <p className="text-sm text-muted-foreground">
          Submissions, deadlines, and feedback.
        </p>
      </div>
      <div className="flex flex-col gap-3">
        {participantAssignments.map((item) => (
          <Card key={item.title}>
            <CardHeader className="flex-row items-start justify-between gap-4 space-y-0">
              <div>
                <CardTitle className="text-base">{item.title}</CardTitle>
                <CardDescription>Due {item.due}</CardDescription>
              </div>
              <Badge variant="outline">{item.status}</Badge>
            </CardHeader>
            <CardContent>
              <Button
                size="sm"
                onClick={() => toast.message(`Upload opened for ${item.title}`)}
              >
                Upload / continue
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
