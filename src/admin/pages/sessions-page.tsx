import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { PageLayout } from "@/shared/components/page-layout"
import { adminSessions } from "@/shared/data/mock-admin"

export function AdminSessionsPage() {
  return (
    <PageLayout
      variant="standard"
      title="Live sessions"
      description="Calendar, attendance, and join links."
    >
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
    </PageLayout>
  )
}
