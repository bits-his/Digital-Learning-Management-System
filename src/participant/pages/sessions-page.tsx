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
import { participantSessions } from "@/shared/data/mock-participant"

export function ParticipantSessionsPage() {
  return (
    <div className="flex flex-col gap-4">
      <div>
        <h1 className="font-heading text-2xl font-semibold">Live sessions</h1>
        <p className="text-sm text-muted-foreground">
          Workshops, mentor hours, and networking events.
        </p>
      </div>
      <div className="flex flex-col gap-3">
        {participantSessions.map((session) => (
          <Card key={session.title}>
            <CardHeader className="flex-row items-start justify-between gap-4 space-y-0">
              <div>
                <CardTitle className="text-base">{session.title}</CardTitle>
                <CardDescription>
                  {session.date} · {session.time}
                </CardDescription>
              </div>
              <Badge variant="secondary">{session.status}</Badge>
            </CardHeader>
            <CardContent className="flex gap-2">
              <Button
                size="sm"
                variant="outline"
                onClick={() => toast.message("Added to calendar (mock)")}
              >
                Add to calendar
              </Button>
              <Button
                size="sm"
                onClick={() => toast.success(`Joining ${session.title}`)}
              >
                Join
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
