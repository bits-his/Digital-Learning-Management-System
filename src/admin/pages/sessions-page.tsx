import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { adminSessions } from "@/shared/data/mock-admin"

export function AdminSessionsPage() {
  return (
    <div className="flex flex-col gap-4">
      <div>
        <h1 className="font-heading text-2xl font-semibold">Live sessions</h1>
        <p className="text-sm text-muted-foreground">
          Calendar, attendance, and join links.
        </p>
      </div>
      <div className="flex flex-col gap-3">
        {adminSessions.map((session) => (
          <Card key={session.title}>
            <CardHeader>
              <CardTitle className="text-base">{session.title}</CardTitle>
              <CardDescription>
                {session.date} · {session.time} · {session.platform}
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-wrap items-center justify-between gap-3">
              <p className="text-sm text-muted-foreground">
                {session.attendees} attendees tracked
              </p>
              <Button
                size="sm"
                variant="outline"
                onClick={() => toast.success("Attendance export ready (mock)")}
              >
                Export attendance
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
