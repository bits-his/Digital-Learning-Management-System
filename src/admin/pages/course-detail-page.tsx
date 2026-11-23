import { useMemo, useRef, useState } from "react"
import { Link, useParams } from "react-router-dom"
import { motion } from "motion/react"
import { toast } from "sonner"
import {
  ArrowLeftIcon,
  CheckCircle2Icon,
  FileTextIcon,
  HelpCircleIcon,
  PackageIcon,
  PlayCircleIcon,
  PlusIcon,
  Trash2Icon,
  UploadIcon,
  XIcon,
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
import {
  Dialog,
  DialogBody,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  adminCourseStatus,
  lessonTypeLabel,
  type LessonMedia,
  type LessonType,
  type QuizQuestion,
} from "@/shared/data/mock-learning"
import { useEnrolment } from "@/shared/enrolment/enrolment-context"
import { useLearning } from "@/shared/learning/learning-context"

const lessonIcon: Record<LessonType, typeof PlayCircleIcon> = {
  video: PlayCircleIcon,
  document: FileTextIcon,
  resource: PackageIcon,
  quiz: HelpCircleIcon,
}

const ACCEPT: Record<Exclude<LessonType, "quiz">, string> = {
  video: "video/mp4,video/webm,video/quicktime",
  document: ".pdf,.doc,.docx,application/pdf",
  resource: ".pdf,.ppt,.pptx,.xls,.xlsx,.zip,image/*",
}

const MAX_BYTES: Record<Exclude<LessonType, "quiz">, number> = {
  video: 200 * 1024 * 1024,
  document: 25 * 1024 * 1024,
  resource: 50 * 1024 * 1024,
}

function formatBytes(size: number) {
  if (size < 1024) return `${size} B`
  if (size < 1024 * 1024) return `${(size / 1024).toFixed(1)} KB`
  return `${(size / (1024 * 1024)).toFixed(1)} MB`
}

function emptyQuestion(): QuizQuestion {
  const a = crypto.randomUUID().slice(0, 6)
  const b = crypto.randomUUID().slice(0, 6)
  return {
    id: `q-${crypto.randomUUID().slice(0, 8)}`,
    prompt: "",
    options: [
      { id: `o-${a}`, label: "" },
      { id: `o-${b}`, label: "" },
    ],
    correctOptionId: `o-${a}`,
  }
}

function validateMediaFile(
  file: File,
  type: Exclude<LessonType, "quiz">
): { ok: true; media: LessonMedia } | { ok: false; message: string } {
  if (file.size <= 0) {
    return { ok: false, message: "File is empty." }
  }
  if (file.size > MAX_BYTES[type]) {
    return {
      ok: false,
      message: `File is too large. Max ${formatBytes(MAX_BYTES[type])} for ${type}.`,
    }
  }
  if (type === "video" && !file.type.startsWith("video/")) {
    return { ok: false, message: "Choose a video file (MP4, WebM, or MOV)." }
  }
  if (
    type === "document" &&
    !(
      file.type === "application/pdf" ||
      file.name.toLowerCase().endsWith(".pdf") ||
      file.name.toLowerCase().endsWith(".doc") ||
      file.name.toLowerCase().endsWith(".docx")
    )
  ) {
    return { ok: false, message: "Choose a PDF or Word document." }
  }

  return {
    ok: true,
    media: {
      fileName: file.name,
      fileSize: file.size,
      mimeType: file.type || "application/octet-stream",
      url: URL.createObjectURL(file),
      validated: true,
      validationMessage: "File looks valid and is ready to attach.",
    },
  }
}

export function AdminCourseDetailPage() {
  const { courseId = "" } = useParams()
  const { cohorts } = useEnrolment()
  const {
    getCourseById,
    setCoursePublished,
    setCourseCohorts,
    addModule,
    addLesson,
  } = useLearning()
  const course = getCourseById(courseId)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [moduleOpen, setModuleOpen] = useState(false)
  const [lessonOpen, setLessonOpen] = useState(false)
  const [moduleTitle, setModuleTitle] = useState("")
  const [moduleSummary, setModuleSummary] = useState("")
  const [lessonModuleId, setLessonModuleId] = useState("")
  const [lessonTitle, setLessonTitle] = useState("")
  const [lessonType, setLessonType] = useState<LessonType>("video")
  const [lessonDuration, setLessonDuration] = useState("15 min")
  const [lessonDescription, setLessonDescription] = useState("")
  const [media, setMedia] = useState<LessonMedia | null>(null)
  const [mediaError, setMediaError] = useState("")
  const [quizPassing, setQuizPassing] = useState(70)
  const [questions, setQuestions] = useState<QuizQuestion[]>([emptyQuestion()])
  const [cohortToAdd, setCohortToAdd] = useState("")

  const assignedCohorts = useMemo(() => {
    if (!course) return []
    return course.cohortIds
      .map((id) => cohorts.find((item) => item.id === id))
      .filter(Boolean)
  }, [course, cohorts])

  const availableCohorts = useMemo(() => {
    if (!course) return cohorts
    return cohorts.filter((item) => !course.cohortIds.includes(item.id))
  }, [course, cohorts])

  if (!course) {
    return (
      <div className="flex flex-col gap-3">
        <h1 className="font-heading text-2xl font-semibold">Course not found</h1>
        <Button asChild variant="outline" size="sm" className="w-fit">
          <Link to="/admin/courses">Back to courses</Link>
        </Button>
      </div>
    )
  }

  const status = adminCourseStatus(course)

  function resetModuleForm() {
    setModuleTitle("")
    setModuleSummary("")
  }

  function resetLessonForm() {
    setLessonTitle("")
    setLessonDescription("")
    setLessonDuration("15 min")
    setLessonType("video")
    setMedia(null)
    setMediaError("")
    setQuizPassing(70)
    setQuestions([emptyQuestion()])
    if (fileInputRef.current) fileInputRef.current.value = ""
  }

  function addAssignedCohort() {
    if (!cohortToAdd) return
    setCourseCohorts(course.id, [...course.cohortIds, cohortToAdd])
    setCohortToAdd("")
    toast.success("Cohort assigned")
  }

  function removeAssignedCohort(id: string) {
    setCourseCohorts(
      course.id,
      course.cohortIds.filter((item) => item !== id)
    )
  }

  function handleAddModule() {
    if (!moduleTitle.trim()) {
      toast.error("Module title is required")
      return
    }
    addModule(course.id, { title: moduleTitle, summary: moduleSummary })
    toast.success("Module added")
    setModuleOpen(false)
    resetModuleForm()
  }

  function handleFileChange(fileList: FileList | null) {
    const file = fileList?.[0]
    if (!file) return
    if (lessonType === "quiz") return
    const result = validateMediaFile(file, lessonType)
    if (!result.ok) {
      setMedia(null)
      setMediaError(result.message)
      return
    }
    setMediaError("")
    setMedia(result.media)
  }

  function handleAddLesson() {
    if (!lessonModuleId) {
      toast.error("Choose a module")
      return
    }
    if (!lessonTitle.trim()) {
      toast.error("Lesson title is required")
      return
    }

    if (lessonType === "quiz") {
      const cleaned = questions
        .map((question) => ({
          ...question,
          prompt: question.prompt.trim(),
          options: question.options
            .map((option) => ({ ...option, label: option.label.trim() }))
            .filter((option) => option.label),
        }))
        .filter((question) => question.prompt && question.options.length >= 2)

      if (cleaned.length === 0) {
        toast.error("Add at least one quiz question with two options")
        return
      }
      for (const question of cleaned) {
        if (!question.options.some((option) => option.id === question.correctOptionId)) {
          toast.error("Each question needs a correct answer selected")
          return
        }
      }

      addLesson(course.id, lessonModuleId, {
        title: lessonTitle,
        type: "quiz",
        duration: lessonDuration,
        description: lessonDescription || "Knowledge check",
        quiz: { passingScore: quizPassing, questions: cleaned },
      })
    } else {
      if (!media?.validated) {
        toast.error("Upload and validate a file for this lesson type")
        return
      }
      addLesson(course.id, lessonModuleId, {
        title: lessonTitle,
        type: lessonType,
        duration: lessonDuration,
        description: lessonDescription,
        media,
      })
    }

    toast.success("Lesson added")
    setLessonOpen(false)
    resetLessonForm()
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <Button asChild variant="ghost" size="sm">
          <Link to="/admin/courses">
            <ArrowLeftIcon data-icon="inline-start" />
            Courses
          </Link>
        </Button>
        <div className="flex flex-wrap gap-2">
          <Button
            variant="secondary"
            size="sm"
            onClick={() => {
              setLessonModuleId(course.modules[0]?.id ?? "")
              setLessonOpen(true)
            }}
            disabled={course.modules.length === 0}
          >
            <PlusIcon data-icon="inline-start" />
            Add lesson
          </Button>
          <Button size="sm" variant="secondary" onClick={() => setModuleOpen(true)}>
            <PlusIcon data-icon="inline-start" />
            Add module
          </Button>
          <Button
            size="sm"
            onClick={() => {
              setCoursePublished(course.id, !course.published)
              toast.success(
                course.published
                  ? "Course moved to draft"
                  : "Course published to assigned cohorts"
              )
            }}
          >
            {course.published ? "Unpublish" : "Publish course"}
          </Button>
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        className="grid gap-4 overflow-hidden rounded-2xl border lg:grid-cols-[1.3fr_1fr]"
      >
        <div className="relative min-h-52">
          <img
            src={course.coverImage}
            alt=""
            className="absolute inset-0 size-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-black/20" />
          <div className="relative flex h-full flex-col justify-end p-6 text-white">
            <Badge variant="secondary" className="mb-3 w-fit">
              {status}
            </Badge>
            <h1 className="font-heading text-2xl font-semibold tracking-tight md:text-3xl">
              {course.title}
            </h1>
            <p className="mt-2 max-w-xl text-sm text-white/80">
              {course.description}
            </p>
          </div>
        </div>
        <div className="flex flex-col justify-center gap-4 bg-muted/30 p-6">
          <div>
            <p className="text-xs tracking-wide text-muted-foreground uppercase">
              Facilitator
            </p>
            <p className="font-medium">{course.facilitator}</p>
            <p className="text-sm text-muted-foreground">
              {course.facilitatorTitle}
            </p>
          </div>
          <div className="grid grid-cols-3 gap-3 text-sm">
            <div>
              <p className="text-muted-foreground">Modules</p>
              <p className="font-heading text-xl font-semibold">
                {course.moduleCount}
              </p>
            </div>
            <div>
              <p className="text-muted-foreground">Lessons</p>
              <p className="font-heading text-xl font-semibold">
                {course.lessonCount}
              </p>
            </div>
            <div>
              <p className="text-muted-foreground">Duration</p>
              <p className="font-heading text-xl font-semibold">
                {course.duration}
              </p>
            </div>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="assign-cohort">Assign cohort</Label>
            <div className="flex gap-2">
              <select
                id="assign-cohort"
                className="h-9 min-w-0 flex-1 rounded-lg border bg-background px-2 text-sm"
                value={cohortToAdd}
                onChange={(event) => setCohortToAdd(event.target.value)}
              >
                <option value="">Select a cohort…</option>
                {availableCohorts.map((cohort) => (
                  <option key={cohort.id} value={cohort.id}>
                    {cohort.name}
                  </option>
                ))}
              </select>
              <Button
                size="sm"
                variant="secondary"
                disabled={!cohortToAdd}
                onClick={addAssignedCohort}
              >
                Add
              </Button>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {assignedCohorts.length === 0 ? (
                <p className="text-xs text-muted-foreground">
                  No cohorts assigned yet.
                </p>
              ) : (
                assignedCohorts.map((cohort) =>
                  cohort ? (
                    <Badge
                      key={cohort.id}
                      variant="secondary"
                      className="gap-1 pr-1"
                    >
                      {cohort.name}
                      <button
                        type="button"
                        className="rounded-full p-0.5 hover:bg-foreground/10"
                        onClick={() => removeAssignedCohort(cohort.id)}
                        aria-label={`Remove ${cohort.name}`}
                      >
                        <XIcon className="size-3" />
                      </button>
                    </Badge>
                  ) : null
                )
              )}
            </div>
          </div>
        </div>
      </motion.div>

      <div className="flex flex-col gap-4">
        {course.modules.length === 0 ? (
          <div className="rounded-2xl border border-dashed p-10 text-center">
            <p className="font-heading text-lg font-semibold">No modules yet</p>
            <p className="mt-1 text-sm text-muted-foreground">
              Add a module, then attach lessons with files or a quiz.
            </p>
            <Button className="mt-4" onClick={() => setModuleOpen(true)}>
              <PlusIcon data-icon="inline-start" />
              Add first module
            </Button>
          </div>
        ) : (
          course.modules.map((module, moduleIndex) => (
            <motion.div
              key={module.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.05 * moduleIndex }}
            >
              <Card className="shadow-none">
                <CardHeader className="flex flex-row items-start justify-between gap-3 space-y-0">
                  <div>
                    <CardDescription>Module {moduleIndex + 1}</CardDescription>
                    <CardTitle className="font-heading text-lg">
                      {module.title}
                    </CardTitle>
                    <CardDescription>{module.summary}</CardDescription>
                  </div>
                  <Button
                    size="sm"
                    variant="secondary"
                    onClick={() => {
                      setLessonModuleId(module.id)
                      setLessonOpen(true)
                    }}
                  >
                    <PlusIcon data-icon="inline-start" />
                    Lesson
                  </Button>
                </CardHeader>
                <CardContent className="flex flex-col gap-2">
                  {module.lessons.length === 0 ? (
                    <p className="rounded-lg border border-dashed px-3 py-4 text-sm text-muted-foreground">
                      No lessons in this module yet.
                    </p>
                  ) : (
                    module.lessons.map((item) => {
                      const Icon = lessonIcon[item.type]
                      return (
                        <div
                          key={item.id}
                          className="flex flex-col gap-2 rounded-lg border border-border/70 px-3 py-3 sm:flex-row sm:items-start sm:justify-between"
                        >
                          <div className="flex gap-3">
                            <div className="mt-0.5 flex size-8 items-center justify-center rounded-md bg-primary/10 text-primary">
                              <Icon className="size-4" />
                            </div>
                            <div className="min-w-0">
                              <p className="text-sm font-medium">{item.title}</p>
                              <p className="text-xs text-muted-foreground">
                                {lessonTypeLabel(item.type)} · {item.duration}
                                {item.media
                                  ? ` · ${item.media.fileName}`
                                  : item.quiz
                                    ? ` · ${item.quiz.questions.length} questions`
                                    : ""}
                              </p>
                              {item.media?.validated ? (
                                <p className="mt-1 inline-flex items-center gap-1 text-xs text-primary">
                                  <CheckCircle2Icon className="size-3.5" />
                                  File validated
                                </p>
                              ) : null}
                            </div>
                          </div>
                          <Badge variant="outline">
                            {lessonTypeLabel(item.type)}
                          </Badge>
                        </div>
                      )
                    })
                  )}
                </CardContent>
              </Card>
            </motion.div>
          ))
        )}
      </div>

      <Dialog
        open={moduleOpen}
        onOpenChange={(open) => {
          setModuleOpen(open)
          if (!open) resetModuleForm()
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add module</DialogTitle>
            <DialogDescription>
              Group related lessons into a curriculum chapter.
            </DialogDescription>
          </DialogHeader>
          <DialogBody>
            <div className="grid gap-2">
              <Label htmlFor="module-title">Title</Label>
              <Input
                id="module-title"
                value={moduleTitle}
                onChange={(event) => setModuleTitle(event.target.value)}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="module-summary">Summary</Label>
              <textarea
                id="module-summary"
                className="min-h-24 rounded-lg border bg-background px-3 py-2 text-sm"
                value={moduleSummary}
                onChange={(event) => setModuleSummary(event.target.value)}
              />
            </div>
          </DialogBody>
          <DialogFooter>
            <Button variant="outline" onClick={() => setModuleOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddModule}>Add module</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog
        open={lessonOpen}
        onOpenChange={(open) => {
          setLessonOpen(open)
          if (!open) resetLessonForm()
        }}
      >
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Add lesson</DialogTitle>
            <DialogDescription>
              Choose a type, then upload content or build a quiz.
            </DialogDescription>
          </DialogHeader>
          <DialogBody>
            <div className="grid gap-2">
              <Label htmlFor="lesson-module">Module</Label>
              <select
                id="lesson-module"
                className="h-9 rounded-lg border bg-background px-2 text-sm"
                value={lessonModuleId}
                onChange={(event) => setLessonModuleId(event.target.value)}
              >
                <option value="">Choose module…</option>
                {course.modules.map((module) => (
                  <option key={module.id} value={module.id}>
                    {module.title}
                  </option>
                ))}
              </select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="lesson-title">Title</Label>
              <Input
                id="lesson-title"
                value={lessonTitle}
                onChange={(event) => setLessonTitle(event.target.value)}
              />
            </div>
            <div className="grid gap-2 sm:grid-cols-2">
              <div className="grid gap-2">
                <Label htmlFor="lesson-type">Type</Label>
                <select
                  id="lesson-type"
                  className="h-9 rounded-lg border bg-background px-2 text-sm"
                  value={lessonType}
                  onChange={(event) => {
                    const next = event.target.value as LessonType
                    setLessonType(next)
                    setMedia(null)
                    setMediaError("")
                    if (fileInputRef.current) fileInputRef.current.value = ""
                  }}
                >
                  <option value="video">Video</option>
                  <option value="document">Document</option>
                  <option value="resource">Resource</option>
                  <option value="quiz">Quiz</option>
                </select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="lesson-duration">Duration</Label>
                <Input
                  id="lesson-duration"
                  value={lessonDuration}
                  onChange={(event) => setLessonDuration(event.target.value)}
                />
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="lesson-desc">Description</Label>
              <textarea
                id="lesson-desc"
                className="min-h-20 rounded-lg border bg-background px-3 py-2 text-sm"
                value={lessonDescription}
                onChange={(event) => setLessonDescription(event.target.value)}
              />
            </div>

            {lessonType === "quiz" ? (
              <div className="grid gap-3 rounded-xl border p-3">
                <div className="flex flex-wrap items-end justify-between gap-3">
                  <div>
                    <p className="text-sm font-medium">Quiz questions</p>
                    <p className="text-xs text-muted-foreground">
                      Mark one correct option per question.
                    </p>
                  </div>
                  <div className="grid gap-1">
                    <Label htmlFor="pass-score" className="text-xs">
                      Passing score %
                    </Label>
                    <Input
                      id="pass-score"
                      type="number"
                      min={1}
                      max={100}
                      className="w-24"
                      value={quizPassing}
                      onChange={(event) =>
                        setQuizPassing(Number(event.target.value) || 70)
                      }
                    />
                  </div>
                </div>

                {questions.map((question, questionIndex) => (
                  <div
                    key={question.id}
                    className="grid gap-2 rounded-lg border bg-muted/20 p-3"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <Label htmlFor={`q-${question.id}`}>
                        Question {questionIndex + 1}
                      </Label>
                      {questions.length > 1 ? (
                        <Button
                          type="button"
                          size="sm"
                          variant="ghost"
                          onClick={() =>
                            setQuestions((prev) =>
                              prev.filter((item) => item.id !== question.id)
                            )
                          }
                        >
                          <Trash2Icon data-icon="inline-start" />
                          Remove
                        </Button>
                      ) : null}
                    </div>
                    <Input
                      id={`q-${question.id}`}
                      placeholder="Ask the learner…"
                      value={question.prompt}
                      onChange={(event) =>
                        setQuestions((prev) =>
                          prev.map((item) =>
                            item.id === question.id
                              ? { ...item, prompt: event.target.value }
                              : item
                          )
                        )
                      }
                    />
                    <div className="grid gap-2">
                      {question.options.map((option, optionIndex) => (
                        <div key={option.id} className="flex items-center gap-2">
                          <input
                            type="radio"
                            name={`correct-${question.id}`}
                            className="size-4 accent-primary"
                            checked={question.correctOptionId === option.id}
                            onChange={() =>
                              setQuestions((prev) =>
                                prev.map((item) =>
                                  item.id === question.id
                                    ? { ...item, correctOptionId: option.id }
                                    : item
                                )
                              )
                            }
                            aria-label={`Mark option ${optionIndex + 1} correct`}
                          />
                          <Input
                            placeholder={`Option ${optionIndex + 1}`}
                            value={option.label}
                            onChange={(event) =>
                              setQuestions((prev) =>
                                prev.map((item) =>
                                  item.id === question.id
                                    ? {
                                        ...item,
                                        options: item.options.map((entry) =>
                                          entry.id === option.id
                                            ? {
                                                ...entry,
                                                label: event.target.value,
                                              }
                                            : entry
                                        ),
                                      }
                                    : item
                                )
                              )
                            }
                          />
                        </div>
                      ))}
                      <Button
                        type="button"
                        size="sm"
                        variant="outline"
                        className="w-fit"
                        onClick={() =>
                          setQuestions((prev) =>
                            prev.map((item) =>
                              item.id === question.id
                                ? {
                                    ...item,
                                    options: [
                                      ...item.options,
                                      {
                                        id: `o-${crypto.randomUUID().slice(0, 6)}`,
                                        label: "",
                                      },
                                    ],
                                  }
                                : item
                            )
                          )
                        }
                      >
                        Add option
                      </Button>
                    </div>
                  </div>
                ))}

                <Button
                  type="button"
                  variant="secondary"
                  size="sm"
                  className="w-fit"
                  onClick={() =>
                    setQuestions((prev) => [...prev, emptyQuestion()])
                  }
                >
                  <PlusIcon data-icon="inline-start" />
                  Add question
                </Button>
              </div>
            ) : (
              <div className="grid gap-3 rounded-xl border p-3">
                <div>
                  <p className="text-sm font-medium">
                    Upload {lessonType} file
                  </p>
                  <p className="text-xs text-muted-foreground">
                    We validate type and size before the lesson can be saved.
                  </p>
                </div>
                <input
                  ref={fileInputRef}
                  type="file"
                  className="hidden"
                  accept={ACCEPT[lessonType]}
                  onChange={(event) => handleFileChange(event.target.files)}
                />
                <Button
                  type="button"
                  variant="outline"
                  className="w-fit"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <UploadIcon data-icon="inline-start" />
                  Choose file
                </Button>
                {mediaError ? (
                  <p className="text-sm text-destructive">{mediaError}</p>
                ) : null}
                {media ? (
                  <div className="rounded-lg border bg-background p-3">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="text-sm font-medium">{media.fileName}</p>
                        <p className="text-xs text-muted-foreground">
                          {formatBytes(media.fileSize)} · {media.mimeType || "file"}
                        </p>
                        <p className="mt-1 inline-flex items-center gap-1 text-xs text-primary">
                          <CheckCircle2Icon className="size-3.5" />
                          {media.validationMessage}
                        </p>
                      </div>
                      <Button
                        type="button"
                        size="sm"
                        variant="ghost"
                        onClick={() => {
                          setMedia(null)
                          if (fileInputRef.current) fileInputRef.current.value = ""
                        }}
                      >
                        Remove
                      </Button>
                    </div>
                    {lessonType === "video" ? (
                      <video
                        src={media.url}
                        controls
                        className="mt-3 max-h-48 w-full rounded-lg bg-black"
                      />
                    ) : media.mimeType.startsWith("image/") ? (
                      <img
                        src={media.url}
                        alt=""
                        className="mt-3 max-h-48 rounded-lg object-contain"
                      />
                    ) : (
                      <iframe
                        title={media.fileName}
                        src={media.url}
                        className="mt-3 h-48 w-full rounded-lg border bg-muted/30"
                      />
                    )}
                  </div>
                ) : null}
              </div>
            )}
          </DialogBody>
          <DialogFooter>
            <Button variant="outline" onClick={() => setLessonOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddLesson}>Add lesson</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
