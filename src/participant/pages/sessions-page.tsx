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
import { PageLayout } from "@/shared/components/page-layout"
import { participantSessions } from "@/shared/data/mock-participant"

export function ParticipantSessionsPage() {
  return (
    <PageLayout
      variant="standard"
      title="Live sessions"
      description="Workshops, mentor hours, and networking events."
    >
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
    </PageLayout>
  )
}
