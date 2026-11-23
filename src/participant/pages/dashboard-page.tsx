import { Link } from "react-router-dom"
import { motion } from "motion/react"
import { toast } from "sonner"
import {
  ArrowRightIcon,
  BookOpenIcon,
  CalendarDaysIcon,
  ClipboardCheckIcon,
} from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"
import { useAuth } from "@/shared/auth/auth-context"
import {
  participantAssignments,
  participantSessions,
} from "@/shared/data/mock-participant"
import { participantCourseStatus } from "@/shared/data/mock-learning"
import { useParticipantAccess } from "@/shared/learning/use-participant-access"

export function ParticipantDashboardPage() {
  const { user } = useAuth()
  const { courses, publishedSlots, cohort, onboarded } = useParticipantAccess()
  const continueCourse =
    courses.find((course) => course.progress > 0 && course.progress < 100) ??
    courses[0]
  const nextSlot = publishedSlots[0]

  const completedLessons = courses.reduce(
    (sum, course) =>
      sum +
      course.modules.flatMap((module) => module.lessons).filter((l) => l.completed)
        .length,
    0
  )
  const totalLessons = courses.reduce(
    (sum, course) =>
      sum + course.modules.flatMap((module) => module.lessons).length,
    0
  )
  const overallProgress =
    totalLessons === 0
      ? 0
      : Math.round((completedLessons / totalLessons) * 100)

  const hubStats = [
    {
      label: "Overall progress",
      value: `${overallProgress}%`,
      hint: `${courses.length} assigned course${courses.length === 1 ? "" : "s"}`,
    },
    {
      label: "Lessons completed",
      value: String(completedLessons),
      hint: `Of ${totalLessons} assigned`,
    },
    {
      label: "Published sessions",
      value: String(publishedSlots.length),
      hint: cohort?.name ?? "No cohort yet",
    },
    {
      label: "Onboarding",
      value: onboarded ? "Done" : "Open",
      hint: onboarded ? "Learning unlocked" : "Finish to unlock courses",
    },
  ]

  return (
    <div className="flex flex-col gap-6">
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col gap-1"
      >
        <p className="text-xs font-medium tracking-[0.18em] text-primary uppercase">
          Learning dashboard
        </p>
        <h1 className="font-heading text-3xl font-semibold tracking-tight">
          Welcome back, {user?.name.split(" ")[0]}
        </h1>
        <p className="text-sm text-muted-foreground">
          {cohort
            ? `${cohort.name} · your Bootcamp progress, timetable, and activities.`
            : "Your Bootcamp progress, upcoming timetable, and learning activities."}
        </p>
      </motion.div>

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {hubStats.map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.04 * index }}
          >
            <Card className="shadow-none">
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
          </motion.div>
        ))}
      </div>

      <div className="grid gap-4 lg:grid-cols-[1.4fr_1fr]">
        {continueCourse ? (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="relative overflow-hidden rounded-2xl border"
          >
            <img
              src={continueCourse.coverImage}
              alt=""
              className="absolute inset-0 size-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/55 to-black/20" />
            <div className="relative flex h-full min-h-56 flex-col justify-end gap-3 p-6 text-white">
              <Badge variant="secondary" className="w-fit">
                Continue learning
              </Badge>
              <h2 className="font-heading text-2xl font-semibold">
                {continueCourse.title}
              </h2>
              <p className="text-sm text-white/75">
                {continueCourse.progress}% complete ·{" "}
                {continueCourse.facilitator}
              </p>
              <div className="max-w-xs">
                <Progress
                  value={continueCourse.progress}
                  className="bg-white/20"
                />
              </div>
              <Button asChild className="mt-1 w-fit">
                <Link to={`/participant/courses/${continueCourse.id}`}>
                  Resume course
                  <ArrowRightIcon data-icon="inline-end" />
                </Link>
              </Button>
            </div>
          </motion.div>
        ) : (
          <Card className="flex min-h-56 flex-col justify-center shadow-none">
            <CardHeader>
              <CardTitle className="font-heading text-xl">
                {onboarded ? "No courses assigned yet" : "Finish onboarding"}
              </CardTitle>
              <CardDescription>
                {onboarded
                  ? "Published curriculum for your cohort will appear here."
                  : "Complete onboarding to unlock your assigned learning path."}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button asChild>
                <Link
                  to={
                    onboarded
                      ? "/participant/courses"
                      : "/participant/onboarding"
                  }
                >
                  {onboarded ? "Browse courses" : "Continue onboarding"}
                </Link>
              </Button>
            </CardContent>
          </Card>
        )}

        <Card className="shadow-none">
          <CardHeader>
            <CardTitle className="inline-flex items-center gap-2 font-heading text-base">
              <CalendarDaysIcon className="size-4 text-primary" />
              Next on your timetable
            </CardTitle>
            <CardDescription>
              {nextSlot
                ? `${nextSlot.day} · ${nextSlot.time}`
                : "No published sessions yet"}
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-3">
            {nextSlot ? (
              <>
                <div>
                  <p className="font-medium">{nextSlot.title}</p>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {nextSlot.facilitator} · {nextSlot.location}
                  </p>
                </div>
                <Badge variant="outline" className="w-fit">
                  {nextSlot.type}
                </Badge>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    onClick={() => toast.success(`Joining ${nextSlot.title}`)}
                  >
                    Join
                  </Button>
                  <Button asChild size="sm" variant="outline">
                    <Link to="/participant/timetable">Full timetable</Link>
                  </Button>
                </div>
              </>
            ) : (
              <Button asChild size="sm" variant="outline" className="w-fit">
                <Link to="/participant/timetable">Check timetable</Link>
              </Button>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="flex flex-wrap gap-2">
        <Button asChild variant="outline" size="sm">
          <Link to="/participant/courses">
            <BookOpenIcon data-icon="inline-start" />
            My courses
          </Link>
        </Button>
        <Button asChild variant="outline" size="sm">
          <Link to="/participant/onboarding">Onboarding</Link>
        </Button>
        <Button asChild variant="outline" size="sm">
          <Link to="/participant/assignments">
            <ClipboardCheckIcon data-icon="inline-start" />
            Assignments
          </Link>
        </Button>
      </div>

      <Tabs defaultValue="courses">
        <TabsList className="w-fit self-start">
          <TabsTrigger value="courses" className="flex-none">
            Courses
          </TabsTrigger>
          <TabsTrigger value="assignments" className="flex-none">
            Assignments
          </TabsTrigger>
          <TabsTrigger value="sessions" className="flex-none">
            Sessions
          </TabsTrigger>
        </TabsList>
        <TabsContent value="courses" className="flex flex-col gap-3">
          {courses.length === 0 ? (
            <p className="rounded-xl border border-dashed px-4 py-8 text-center text-sm text-muted-foreground">
              No published courses for your cohort yet.
            </p>
          ) : (
            courses.slice(0, 4).map((course) => (
              <Card key={course.id} className="shadow-none">
                <CardHeader className="flex-row items-start justify-between gap-4 space-y-0">
                  <div>
                    <CardTitle className="text-base">{course.title}</CardTitle>
                    <CardDescription>
                      {course.progress}% complete
                    </CardDescription>
                  </div>
                  <Badge variant="secondary">
                    {participantCourseStatus(course.progress)}
                  </Badge>
                </CardHeader>
                <CardContent className="flex flex-col gap-3">
                  <Progress value={course.progress} />
                  <Button asChild size="sm" variant="outline" className="w-fit">
                    <Link to={`/participant/courses/${course.id}`}>Open</Link>
                  </Button>
                </CardContent>
              </Card>
            ))
          )}
        </TabsContent>
        <TabsContent value="assignments" className="flex flex-col gap-3">
          {participantAssignments.map((item) => (
            <Card key={item.title} className="shadow-none">
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
            <Card key={session.title} className="shadow-none">
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
