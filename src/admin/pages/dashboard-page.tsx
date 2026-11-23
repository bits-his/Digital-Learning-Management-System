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
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"
import {
  adminApplications,
  adminSessions,
  adminStats,
} from "@/shared/data/mock-admin"
import { useAuth } from "@/shared/auth/auth-context"

export function AdminDashboardPage() {
  const { user } = useAuth()

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-1">
        <h1 className="font-heading text-2xl font-semibold tracking-tight">
          Welcome, {user?.name.split(" ")[0]}
        </h1>
        <p className="text-sm text-muted-foreground">
          Programme overview for the 2027 Bootcamp — mock data for frontend
          review.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {adminStats.map((stat) => (
          <Card key={stat.label}>
            <CardHeader className="pb-2">
              <CardDescription>{stat.label}</CardDescription>
              <CardTitle className="font-heading text-3xl">
                {stat.value}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-xs text-muted-foreground">{stat.hint}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Tabs defaultValue="applications">
        <TabsList>
          <TabsTrigger value="applications">Applications</TabsTrigger>
          <TabsTrigger value="sessions">Upcoming sessions</TabsTrigger>
        </TabsList>
        <TabsContent value="applications" className="flex flex-col gap-3">
          {adminApplications.slice(0, 3).map((app) => (
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
              <CardContent className="flex items-center justify-between gap-4">
                <p className="text-sm text-muted-foreground">
                  Reviewer score: {app.score}
                </p>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => toast.message(`Opened ${app.id} (mock)`)}
                >
                  Review
                </Button>
              </CardContent>
            </Card>
          ))}
        </TabsContent>
        <TabsContent value="sessions" className="flex flex-col gap-3">
          {adminSessions.map((session) => (
            <Card key={session.title}>
              <CardHeader>
                <CardTitle className="text-base">{session.title}</CardTitle>
                <CardDescription>
                  {session.date} · {session.time} · {session.platform}
                </CardDescription>
              </CardHeader>
              <CardContent className="flex items-center justify-between gap-4">
                <p className="text-sm text-muted-foreground">
                  {session.attendees} registered
                </p>
                <Button
                  size="sm"
                  onClick={() =>
                    toast.success(`Join link copied for ${session.title}`)
                  }
                >
                  Copy join link
                </Button>
              </CardContent>
            </Card>
          ))}
        </TabsContent>
      </Tabs>
    </div>
  )
}
