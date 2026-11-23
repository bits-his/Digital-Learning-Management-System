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
import { useAuth } from "@/shared/auth/auth-context"
import {
  participantAssignments,
  participantCourses,
  participantSessions,
  participantStats,
} from "@/shared/data/mock-participant"

export function ParticipantDashboardPage() {
  const { user } = useAuth()

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-1">
        <h1 className="font-heading text-2xl font-semibold tracking-tight">
          Welcome, {user?.name.split(" ")[0]}
        </h1>
        <p className="text-sm text-muted-foreground">
          Your Bootcamp learning progress and upcoming commitments.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {participantStats.map((stat) => (
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

      <Tabs defaultValue="courses">
        <TabsList>
          <TabsTrigger value="courses">Courses</TabsTrigger>
          <TabsTrigger value="assignments">Assignments</TabsTrigger>
          <TabsTrigger value="sessions">Sessions</TabsTrigger>
        </TabsList>
        <TabsContent value="courses" className="flex flex-col gap-3">
          {participantCourses.map((course) => (
            <Card key={course.title}>
              <CardHeader className="flex-row items-start justify-between gap-4 space-y-0">
                <div>
                  <CardTitle className="text-base">{course.title}</CardTitle>
                  <CardDescription>{course.progress}% complete</CardDescription>
                </div>
                <Badge variant="secondary">{course.status}</Badge>
              </CardHeader>
              <CardContent>
                <div className="h-2 overflow-hidden rounded-full bg-muted">
                  <div
                    className="h-full rounded-full bg-primary"
                    style={{ width: `${course.progress}%` }}
                  />
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>
        <TabsContent value="assignments" className="flex flex-col gap-3">
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
                  variant="outline"
                  onClick={() => toast.message(`Opened ${item.title} (mock)`)}
                >
                  Open assignment
                </Button>
              </CardContent>
            </Card>
          ))}
        </TabsContent>
        <TabsContent value="sessions" className="flex flex-col gap-3">
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
              <CardContent>
                <Button
                  size="sm"
                  onClick={() => toast.success(`Joining ${session.title}`)}
                >
                  Join session
                </Button>
              </CardContent>
            </Card>
          ))}
        </TabsContent>
      </Tabs>
    </div>
  )
}
