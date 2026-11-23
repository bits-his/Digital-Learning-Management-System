import { Link, useParams } from "react-router-dom"
import { motion } from "motion/react"
import {
  ArrowLeftIcon,
  CheckCircle2Icon,
  CircleIcon,
  FileTextIcon,
  HelpCircleIcon,
  PackageIcon,
  PlayCircleIcon,
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
  lessonTypeLabel,
  participantCourseStatus,
  type LessonType,
} from "@/shared/data/mock-learning"
import { useLearning } from "@/shared/learning/learning-context"
import { useParticipantAccess } from "@/shared/learning/use-participant-access"

const lessonIcon: Record<LessonType, typeof PlayCircleIcon> = {
  video: PlayCircleIcon,
  document: FileTextIcon,
  resource: PackageIcon,
  quiz: HelpCircleIcon,
}

export function ParticipantCourseDetailPage() {
  const { courseId = "" } = useParams()
  const { getCourseById } = useLearning()
  const { courses, onboarded } = useParticipantAccess()
  const course = getCourseById(courseId)
  const hasAccess = courses.some((item) => item.id === courseId)

  if (!course || !hasAccess || !onboarded) {
    return (
      <div className="flex flex-col gap-3">
        <h1 className="font-heading text-2xl font-semibold">
          {!course
            ? "Course not found"
            : !onboarded
              ? "Finish onboarding to open this course"
              : "This course is not assigned to your cohort"}
        </h1>
        <Button asChild variant="outline" size="sm" className="w-fit">
          <Link to="/participant/courses">Back to courses</Link>
        </Button>
      </div>
    )
  }

  const nextLesson = course.modules
    .flatMap((module) => module.lessons)
    .find((lesson) => !lesson.completed)
  const status = participantCourseStatus(course.progress)

  return (
    <div className="flex flex-col gap-6">
      <Button asChild variant="ghost" size="sm" className="w-fit">
        <Link to="/participant/courses">
          <ArrowLeftIcon data-icon="inline-start" />
          My courses
        </Link>
      </Button>

      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        className="overflow-hidden rounded-2xl border"
      >
        <div className="relative min-h-56 md:min-h-64">
          <img
            src={course.coverImage}
            alt=""
            className="absolute inset-0 size-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/45 to-black/20" />
          <div className="relative flex h-full flex-col justify-end gap-4 p-6 text-white md:p-8">
            <Badge variant="secondary" className="w-fit">
              {status}
            </Badge>
            <div>
              <h1 className="font-heading text-3xl font-semibold tracking-tight">
                {course.title}
              </h1>
              <p className="mt-2 max-w-2xl text-sm text-white/75">
                {course.description}
              </p>
            </div>
            <div className="max-w-md">
              <div className="mb-2 flex justify-between text-xs text-white/70">
                <span>Your progress</span>
                <span>{course.progress}%</span>
              </div>
              <Progress value={course.progress} className="bg-white/20" />
            </div>
            {nextLesson ? (
              <Button asChild className="w-fit">
                <Link
                  to={`/participant/courses/${course.id}/lessons/${nextLesson.id}`}
                >
                  Continue: {nextLesson.title}
                </Link>
              </Button>
            ) : (
              <Button asChild className="w-fit" variant="secondary">
                <Link
                  to={`/participant/courses/${course.id}/lessons/${course.modules[0].lessons[0].id}`}
                >
                  Review course
                </Link>
              </Button>
            )}
          </div>
        </div>
      </motion.div>

      <div className="grid gap-4 lg:grid-cols-[1fr_280px]">
        <div className="flex flex-col gap-4">
          {course.modules.map((module, moduleIndex) => (
            <motion.div
              key={module.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.05 * moduleIndex }}
            >
              <Card className="shadow-none">
                <CardHeader>
                  <CardDescription>Module {moduleIndex + 1}</CardDescription>
                  <CardTitle className="font-heading text-lg">
                    {module.title}
                  </CardTitle>
                  <CardDescription>{module.summary}</CardDescription>
                </CardHeader>
                <CardContent className="flex flex-col gap-2">
                  {module.lessons.map((lesson) => {
                    const Icon = lessonIcon[lesson.type]
                    return (
                      <Link
                        key={lesson.id}
                        to={`/participant/courses/${course.id}/lessons/${lesson.id}`}
                        className="flex items-center justify-between gap-3 rounded-lg border border-border/70 px-3 py-3 transition-colors hover:bg-muted/50"
                      >
                        <div className="flex items-start gap-3">
                          <div className="mt-0.5 flex size-8 items-center justify-center rounded-md bg-primary/10 text-primary">
                            <Icon className="size-4" />
                          </div>
                          <div>
                            <p className="text-sm font-medium">{lesson.title}</p>
                            <p className="text-xs text-muted-foreground">
                              {lessonTypeLabel(lesson.type)} · {lesson.duration}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className="hidden sm:inline-flex">
                            {lessonTypeLabel(lesson.type)}
                          </Badge>
                          {lesson.completed ? (
                            <CheckCircle2Icon className="size-4 text-primary" />
                          ) : (
                            <CircleIcon className="size-4 text-muted-foreground" />
                          )}
                        </div>
                      </Link>
                    )
                  })}
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        <Card className="h-fit shadow-none">
          <CardHeader>
            <CardTitle className="font-heading text-base">Facilitator</CardTitle>
            <CardDescription>{course.facilitatorTitle}</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-3 text-sm">
            <p className="font-medium">{course.facilitator}</p>
            <p className="text-muted-foreground">
              Available for office hours on Fridays. Use live sessions for
              questions on this module.
            </p>
            <Button asChild variant="outline" size="sm">
              <Link to="/participant/timetable">View timetable</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
