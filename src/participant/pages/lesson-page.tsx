import { useEffect, useMemo, useState } from "react"
import { Link, useNavigate, useParams } from "react-router-dom"
import { motion } from "motion/react"
import { toast } from "sonner"
import {
  ArrowLeftIcon,
  CheckCircle2Icon,
  ChevronLeftIcon,
  ChevronRightIcon,
  CircleIcon,
  DownloadIcon,
  FileTextIcon,
  HelpCircleIcon,
  PackageIcon,
  PlayCircleIcon,
  PlayIcon,
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
  type LessonType,
} from "@/shared/data/mock-learning"
import { useLearning } from "@/shared/learning/learning-context"
import { useParticipantAccess } from "@/shared/learning/use-participant-access"

const outlineIcon: Record<LessonType, typeof PlayCircleIcon> = {
  video: PlayCircleIcon,
  document: FileTextIcon,
  resource: PackageIcon,
  quiz: HelpCircleIcon,
}

export function ParticipantLessonPage() {
  const navigate = useNavigate()
  const { courseId = "", lessonId = "" } = useParams()
  const { getLessonContext, markLessonComplete } = useLearning()
  const { courses, onboarded } = useParticipantAccess()
  const context = useMemo(
    () => getLessonContext(courseId, lessonId),
    [courseId, lessonId, getLessonContext]
  )
  const hasAccess = courses.some((item) => item.id === courseId)
  const [completed, setCompleted] = useState(
    () => context?.lesson.completed ?? false
  )
  const [answers, setAnswers] = useState<Record<string, string>>({})
  const [quizSubmitted, setQuizSubmitted] = useState(false)
  const [quizScore, setQuizScore] = useState<number | null>(null)

  useEffect(() => {
    setCompleted(context?.lesson.completed ?? false)
    setAnswers({})
    setQuizSubmitted(false)
    setQuizScore(null)
  }, [context?.lesson.completed, lessonId])

  if (!context || !hasAccess || !onboarded) {
    return (
      <div className="flex flex-col gap-3">
        <h1 className="font-heading text-2xl font-semibold">
          {!context
            ? "Lesson not found"
            : !onboarded
              ? "Finish onboarding to open lessons"
              : "This lesson is not available for your cohort"}
        </h1>
        <Button asChild variant="outline" size="sm" className="w-fit">
          <Link to="/participant/courses">Back to courses</Link>
        </Button>
      </div>
    )
  }

  const { course, module, lesson, previous, next, position, total } = context
  const progressPct = Math.round((position / total) * 100)
  const quiz = lesson.quiz
  const media = lesson.media

  function markComplete() {
    markLessonComplete(course.id, lesson.id, true)
    setCompleted(true)
    toast.success("Lesson marked complete")
  }

  function go(targetId: string | undefined) {
    if (!targetId) return
    navigate(`/participant/courses/${course.id}/lessons/${targetId}`)
  }

  function submitQuiz() {
    if (!quiz) return
    const unanswered = quiz.questions.some(
      (question) => !answers[question.id]
    )
    if (unanswered) {
      toast.error("Answer every question before submitting")
      return
    }
    const correct = quiz.questions.filter(
      (question) => answers[question.id] === question.correctOptionId
    ).length
    const score = Math.round((correct / quiz.questions.length) * 100)
    setQuizScore(score)
    setQuizSubmitted(true)
    if (score >= quiz.passingScore) {
      markLessonComplete(course.id, lesson.id, true)
      setCompleted(true)
      toast.success(`Passed with ${score}%`)
    } else {
      toast.message(`Scored ${score}% — need ${quiz.passingScore}% to pass`)
    }
  }

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <Button asChild variant="ghost" size="sm">
          <Link to={`/participant/courses/${course.id}`}>
            <ArrowLeftIcon data-icon="inline-start" />
            {course.shortTitle}
          </Link>
        </Button>
        <div className="flex items-center gap-3 text-sm text-muted-foreground">
          <span>
            Lesson {position} of {total}
          </span>
          <div className="w-28">
            <Progress value={progressPct} />
          </div>
        </div>
      </div>

      <div className="grid gap-5 xl:grid-cols-[1fr_320px]">
        <motion.div
          key={lesson.id}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col gap-4"
        >
          <div className="overflow-hidden rounded-2xl border bg-zinc-950 text-white">
            {lesson.type === "video" ? (
              media?.url ? (
                <video
                  src={media.url}
                  controls
                  className="aspect-video w-full bg-black"
                />
              ) : (
                <div className="relative aspect-video bg-[radial-gradient(circle_at_30%_20%,oklch(0.35_0.06_150),transparent_45%),linear-gradient(160deg,#0b1220,#111827)]">
                  <img
                    src={course.coverImage}
                    alt=""
                    className="absolute inset-0 size-full object-cover opacity-35"
                  />
                  <div className="absolute inset-0 flex flex-col items-center justify-center gap-3">
                    <button
                      type="button"
                      className="flex size-16 items-center justify-center rounded-full bg-white/95 text-zinc-900 shadow-lg transition hover:scale-105"
                      onClick={() =>
                        toast.message("No uploaded video yet for this lesson")
                      }
                    >
                      <PlayIcon className="size-6 fill-current" />
                    </button>
                    <p className="text-sm text-white/80">
                      {lesson.duration} video
                    </p>
                  </div>
                </div>
              )
            ) : lesson.type === "quiz" ? (
              <div className="flex aspect-[16/9] flex-col items-center justify-center gap-3 bg-[linear-gradient(160deg,oklch(0.25_0.03_150),oklch(0.18_0.02_160))] p-8 text-center">
                <p className="font-heading text-lg font-semibold">
                  Knowledge check
                </p>
                <p className="max-w-md text-sm text-white/70">
                  {quiz
                    ? `${quiz.questions.length} questions · pass at ${quiz.passingScore}%`
                    : lesson.description}
                </p>
              </div>
            ) : (
              <div className="flex aspect-[16/9] flex-col items-center justify-center gap-3 bg-[linear-gradient(160deg,oklch(0.25_0.03_150),oklch(0.18_0.02_160))] p-8 text-center">
                {media?.mimeType.startsWith("image/") ? (
                  <img
                    src={media.url}
                    alt=""
                    className="max-h-48 rounded-lg object-contain"
                  />
                ) : (
                  <FileTextIcon className="size-10 text-primary" />
                )}
                <p className="font-heading text-lg font-semibold">
                  {lesson.type === "resource"
                    ? "Learning resource"
                    : "Reading pack"}
                </p>
                <p className="max-w-md text-sm text-white/70">
                  {media?.fileName ?? lesson.description}
                </p>
                {media?.url ? (
                  <Button asChild variant="secondary" size="sm">
                    <a href={media.url} download={media.fileName}>
                      <DownloadIcon data-icon="inline-start" />
                      Download file
                    </a>
                  </Button>
                ) : (
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => toast.message("No file attached yet")}
                  >
                    <DownloadIcon data-icon="inline-start" />
                    Open resource
                  </Button>
                )}
              </div>
            )}
          </div>

          <Card className="shadow-none">
            <CardHeader>
              <div className="flex flex-wrap items-center gap-2">
                <Badge variant="outline">{lessonTypeLabel(lesson.type)}</Badge>
                <Badge variant={completed ? "default" : "secondary"}>
                  {completed ? "Completed" : "In progress"}
                </Badge>
              </div>
              <CardTitle className="font-heading text-2xl">
                {lesson.title}
              </CardTitle>
              <CardDescription>
                {module.title} · {lesson.duration}
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
              <p className="text-sm leading-relaxed text-muted-foreground">
                {lesson.content}
              </p>

              {lesson.type === "quiz" && quiz ? (
                <div className="flex flex-col gap-4">
                  {quiz.questions.map((question, index) => (
                    <div
                      key={question.id}
                      className="rounded-xl border p-3"
                    >
                      <p className="text-sm font-medium">
                        {index + 1}. {question.prompt}
                      </p>
                      <div className="mt-3 flex flex-col gap-2">
                        {question.options.map((option) => {
                          const selected = answers[question.id] === option.id
                          const showResult = quizSubmitted
                          const isCorrect =
                            option.id === question.correctOptionId
                          return (
                            <label
                              key={option.id}
                              className={`flex cursor-pointer items-center gap-2 rounded-lg border px-3 py-2 text-sm ${
                                selected ? "border-primary bg-primary/5" : ""
                              } ${
                                showResult && isCorrect
                                  ? "border-primary"
                                  : showResult && selected && !isCorrect
                                    ? "border-destructive"
                                    : ""
                              }`}
                            >
                              <input
                                type="radio"
                                className="size-4 accent-primary"
                                name={question.id}
                                checked={selected}
                                disabled={quizSubmitted && completed}
                                onChange={() =>
                                  setAnswers((prev) => ({
                                    ...prev,
                                    [question.id]: option.id,
                                  }))
                                }
                              />
                              {option.label}
                            </label>
                          )
                        })}
                      </div>
                    </div>
                  ))}
                  {quizScore !== null ? (
                    <p className="text-sm text-muted-foreground">
                      Score: {quizScore}% · Pass mark {quiz.passingScore}%
                    </p>
                  ) : null}
                  {!completed ? (
                    <Button onClick={submitQuiz} className="w-fit">
                      Submit quiz
                    </Button>
                  ) : null}
                </div>
              ) : null}

              {lesson.type !== "quiz" || completed ? (
                <div className="flex flex-wrap gap-2">
                  {lesson.type !== "quiz" ? (
                    !completed ? (
                      <Button onClick={markComplete}>
                        <CheckCircle2Icon data-icon="inline-start" />
                        Mark complete
                      </Button>
                    ) : (
                      <Button variant="outline" disabled>
                        <CheckCircle2Icon data-icon="inline-start" />
                        Completed
                      </Button>
                    )
                  ) : null}
                  <Button
                    variant="outline"
                    disabled={!previous}
                    onClick={() => go(previous?.id)}
                  >
                    <ChevronLeftIcon data-icon="inline-start" />
                    Previous
                  </Button>
                  <Button disabled={!next} onClick={() => go(next?.id)}>
                    Next lesson
                    <ChevronRightIcon data-icon="inline-end" />
                  </Button>
                </div>
              ) : (
                <div className="flex flex-wrap gap-2">
                  <Button
                    variant="outline"
                    disabled={!previous}
                    onClick={() => go(previous?.id)}
                  >
                    <ChevronLeftIcon data-icon="inline-start" />
                    Previous
                  </Button>
                  <Button disabled={!next} onClick={() => go(next?.id)}>
                    Next lesson
                    <ChevronRightIcon data-icon="inline-end" />
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>

        <Card className="h-fit shadow-none">
          <CardHeader>
            <CardTitle className="font-heading text-base">
              Course outline
            </CardTitle>
            <CardDescription>{course.title}</CardDescription>
          </CardHeader>
          <CardContent className="flex max-h-[70vh] flex-col gap-4 overflow-auto">
            {course.modules.map((item, moduleIndex) => (
              <div key={item.id} className="flex flex-col gap-1.5">
                <p className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
                  Module {moduleIndex + 1} · {item.title}
                </p>
                {item.lessons.length === 0 ? (
                  <p className="px-2 py-1.5 text-xs text-muted-foreground">
                    No lessons yet
                  </p>
                ) : (
                  item.lessons.map((entry) => {
                    const active = entry.id === lesson.id
                    const Icon = outlineIcon[entry.type]
                    return (
                      <Link
                        key={entry.id}
                        to={`/participant/courses/${course.id}/lessons/${entry.id}`}
                        className={`flex items-start gap-2 rounded-md px-2 py-1.5 text-sm transition-colors ${
                          active
                            ? "bg-primary/10 font-medium text-primary"
                            : "text-muted-foreground hover:bg-muted hover:text-foreground"
                        }`}
                      >
                        <Icon className="mt-0.5 size-3.5 shrink-0" />
                        <span className="min-w-0 flex-1">
                          <span className="block truncate">{entry.title}</span>
                          <span className="block text-[11px] font-normal opacity-80">
                            {lessonTypeLabel(entry.type)} · {entry.duration}
                          </span>
                        </span>
                        {entry.completed ? (
                          <CheckCircle2Icon className="mt-0.5 size-3.5 shrink-0 text-primary" />
                        ) : (
                          <CircleIcon className="mt-0.5 size-3.5 shrink-0 opacity-40" />
                        )}
                      </Link>
                    )
                  })
                )}
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
