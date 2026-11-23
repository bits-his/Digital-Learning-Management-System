import { Link } from "react-router-dom"
import { motion } from "motion/react"
import { ArrowRightIcon } from "lucide-react"

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
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyTitle,
} from "@/components/ui/empty"
import { Progress } from "@/components/ui/progress"
import { participantCourseStatus } from "@/shared/data/mock-learning"
import { useParticipantAccess } from "@/shared/learning/use-participant-access"

export function ParticipantCoursesPage() {
  const { courses, cohort, onboarded, hasCohort } = useParticipantAccess()
  const continueCourse =
    courses.find((course) => course.progress > 0 && course.progress < 100) ??
    courses[0]

  if (!hasCohort) {
    return (
      <Empty className="rounded-2xl border py-16">
        <EmptyHeader>
          <EmptyTitle>No cohort assigned yet</EmptyTitle>
          <EmptyDescription>
            Once programme staff place you in a cohort, your courses will appear
            here.
          </EmptyDescription>
        </EmptyHeader>
      </Empty>
    )
  }

  if (!onboarded) {
    return (
      <Empty className="rounded-2xl border py-16">
        <EmptyHeader>
          <EmptyTitle>Finish onboarding first</EmptyTitle>
          <EmptyDescription>
            Complete onboarding to unlock the courses assigned to{" "}
            {cohort?.name ?? "your cohort"}.
          </EmptyDescription>
        </EmptyHeader>
        <Button asChild className="mt-4">
          <Link to="/participant/onboarding">Continue onboarding</Link>
        </Button>
      </Empty>
    )
  }

  if (courses.length === 0) {
    return (
      <Empty className="rounded-2xl border py-16">
        <EmptyHeader>
          <EmptyTitle>No published courses yet</EmptyTitle>
          <EmptyDescription>
            {cohort?.name} does not have published curriculum assigned. Check
            back after programme staff publish modules.
          </EmptyDescription>
        </EmptyHeader>
        <Button asChild variant="outline" className="mt-4">
          <Link to="/participant/timetable">View timetable</Link>
        </Button>
      </Empty>
    )
  }

  return (
    <div className="flex flex-col gap-6">
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-2xl border"
      >
        <img
          src={continueCourse.coverImage}
          alt=""
          className="absolute inset-0 size-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/55 to-black/25" />
        <div className="relative flex flex-col gap-4 p-6 md:flex-row md:items-end md:justify-between md:p-8">
          <div className="max-w-xl text-white">
            <p className="text-xs font-medium tracking-[0.18em] text-white/70 uppercase">
              Continue learning · {cohort?.name}
            </p>
            <h1 className="mt-2 font-heading text-3xl font-semibold tracking-tight">
              {continueCourse.title}
            </h1>
            <p className="mt-2 text-sm text-white/75">
              {continueCourse.progress}% complete · Facilitator{" "}
              {continueCourse.facilitator}
            </p>
            <div className="mt-4 max-w-sm">
              <Progress value={continueCourse.progress} className="bg-white/20" />
            </div>
          </div>
          <Button asChild size="lg" className="w-fit">
            <Link to={`/participant/courses/${continueCourse.id}`}>
              Resume course
              <ArrowRightIcon data-icon="inline-end" />
            </Link>
          </Button>
        </div>
      </motion.div>

      <div>
        <h2 className="font-heading text-xl font-semibold">My courses</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Published modules assigned to {cohort?.name}.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {courses.map((course, index) => {
          const status = participantCourseStatus(course.progress)
          return (
            <motion.div
              key={course.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.04 * index }}
            >
              <Card className="group h-full overflow-hidden shadow-none transition-shadow hover:shadow-md">
                <div className="relative aspect-[2/1] overflow-hidden">
                  <img
                    src={course.coverImage}
                    alt=""
                    className="size-full object-cover transition duration-500 group-hover:scale-[1.03]"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                  <Badge className="absolute top-3 left-3" variant="secondary">
                    {status}
                  </Badge>
                </div>
                <CardHeader className="pb-2">
                  <CardTitle className="font-heading text-base leading-snug">
                    {course.title}
                  </CardTitle>
                  <CardDescription className="line-clamp-2">
                    {course.description}
                  </CardDescription>
                </CardHeader>
                <CardContent className="flex flex-col gap-3">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Progress</span>
                    <span className="font-medium">{course.progress}%</span>
                  </div>
                  <Progress value={course.progress} />
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span>
                      {course.moduleCount} modules · {course.lessonCount} lessons
                    </span>
                    <span>{course.duration}</span>
                  </div>
                  <Button asChild size="sm" variant="outline">
                    <Link to={`/participant/courses/${course.id}`}>
                      {course.progress === 0 ? "Start course" : "Continue"}
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          )
        })}
      </div>
    </div>
  )
}
