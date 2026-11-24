import { useMemo, useState } from "react"
import { Link } from "react-router-dom"
import { motion } from "motion/react"
import { toast } from "sonner"
import {
  BookOpenIcon,
  FilePenLineIcon,
  PlusIcon,
  SearchIcon,
  UsersIcon,
  XIcon,
} from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
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
import { Progress } from "@/components/ui/progress"
import { PageLayout } from "@/shared/components/page-layout"
import { useEnrolment } from "@/shared/enrolment/enrolment-context"
import { useLearning } from "@/shared/learning/learning-context"
import { adminCourseStatus } from "@/shared/data/mock-learning"

type StatusFilter = "all" | "Published" | "Draft"

export function AdminCoursesPage() {
  const { cohorts, cohortOccupancy } = useEnrolment()
  const { courses, createCourse, stats } = useLearning()
  const [search, setSearch] = useState("")
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all")
  const [createOpen, setCreateOpen] = useState(false)
  const [title, setTitle] = useState("")
  const [shortTitle, setShortTitle] = useState("")
  const [description, setDescription] = useState("")
  const [facilitator, setFacilitator] = useState("")
  const [facilitatorTitle, setFacilitatorTitle] = useState("")
  const [duration, setDuration] = useState("3 weeks")
  const [cohortIds, setCohortIds] = useState<string[]>([])
  const [cohortToAdd, setCohortToAdd] = useState("")

  const overviewStats = [
    {
      label: "Courses",
      value: stats.total,
      hint: "In the curriculum library",
      wash: "bg-primary/5",
      iconBg: "bg-primary text-primary-foreground",
      icon: BookOpenIcon,
    },
    {
      label: "Published",
      value: stats.published,
      hint: "Visible to assigned cohorts",
      wash: "bg-muted/60",
      iconBg: "bg-foreground text-background",
      icon: UsersIcon,
    },
    {
      label: "Drafts",
      value: stats.drafts,
      hint: "Still being built",
      wash: "bg-primary/5",
      iconBg: "bg-primary text-primary-foreground",
      icon: FilePenLineIcon,
    },
    {
      label: "Assigned",
      value: stats.assigned,
      hint: "Linked to at least one cohort",
      wash: "bg-muted/60",
      iconBg: "bg-foreground text-background",
      icon: UsersIcon,
    },
  ]

  const filtered = useMemo(() => {
    const query = search.trim().toLowerCase()
    return courses.filter((course) => {
      const status = adminCourseStatus(course)
      if (statusFilter !== "all" && status !== statusFilter) return false
      if (!query) return true
      return (
        course.title.toLowerCase().includes(query) ||
        course.shortTitle.toLowerCase().includes(query) ||
        course.facilitator.toLowerCase().includes(query)
      )
    })
  }, [courses, search, statusFilter])

  const workspace = useMemo(() => {
    return courses
      .filter((course) => course.published && course.cohortIds.length > 0)
      .slice(0, 3)
      .map((course) => {
        const primaryCohortId = course.cohortIds[0]
        const cohort = cohorts.find((item) => item.id === primaryCohortId)
        const learners = course.cohortIds.reduce(
          (sum, id) => sum + cohortOccupancy(id).enrolled,
          0
        )
        return {
          id: course.id,
          title: course.title,
          cohort: cohort?.name ?? "Unassigned",
          learners,
          avgProgress: course.progress,
        }
      })
  }, [courses, cohorts, cohortOccupancy])

  function resetCreate() {
    setTitle("")
    setShortTitle("")
    setDescription("")
    setFacilitator("")
    setFacilitatorTitle("")
    setDuration("3 weeks")
    setCohortIds([])
    setCohortToAdd("")
  }

  function addCohortFromSelect() {
    if (!cohortToAdd || cohortIds.includes(cohortToAdd)) return
    setCohortIds((prev) => [...prev, cohortToAdd])
    setCohortToAdd("")
  }

  function handleCreate() {
    if (!title.trim()) {
      toast.error("Add a course title")
      return
    }
    const course = createCourse({
      title,
      shortTitle,
      description,
      facilitator,
      facilitatorTitle,
      duration,
      cohortIds,
    })
    toast.success(`${course.shortTitle} created as draft`)
    setCreateOpen(false)
    resetCreate()
  }

  return (
    <PageLayout
      variant="standard"
      title="Courses"
      description="Build curriculum, publish modules, and assign them to cohorts."
      actions={
        <Button size="lg" onClick={() => setCreateOpen(true)}>
          <PlusIcon data-icon="inline-start" />
          New course
        </Button>
      }
    >
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {overviewStats.map((stat) => (
          <div
            key={stat.label}
            className={`relative overflow-hidden rounded-2xl border ${stat.wash} p-4`}
          >
            <stat.icon className="pointer-events-none absolute -right-1 -bottom-1 size-24 text-foreground/[0.06]" />
            <div className="relative flex items-start justify-between gap-3">
              <div>
                <p className="text-sm text-muted-foreground">{stat.label}</p>
                <p className="mt-1 font-heading text-3xl font-semibold tracking-tight">
                  {stat.value}
                </p>
                <p className="mt-2 text-xs text-muted-foreground">{stat.hint}</p>
              </div>
              <div
                className={`flex size-11 shrink-0 items-center justify-center rounded-2xl shadow-sm ${stat.iconBg}`}
              >
                <stat.icon className="size-5" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {workspace.length > 0 ? (
        <section className="flex flex-col gap-3">
          <div>
            <h2 className="font-heading text-lg font-semibold">
              Active delivery
            </h2>
            <p className="text-sm text-muted-foreground">
              Published courses with learners in assigned cohorts — a quick view
              for facilitators tracking progress.
            </p>
          </div>
          <div className="grid gap-3 md:grid-cols-3">
            {workspace.map((course, index) => (
              <motion.div
                key={course.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.04 * index }}
                className="rounded-2xl border p-4"
              >
                <p className="text-xs text-muted-foreground">{course.cohort}</p>
                <p className="mt-1 font-heading text-base font-semibold leading-snug">
                  {course.title}
                </p>
                <div className="mt-3 flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Avg progress</span>
                  <span className="font-medium">{course.avgProgress}%</span>
                </div>
                <Progress className="mt-2" value={course.avgProgress} />
                <div className="mt-3 flex items-center justify-between text-xs text-muted-foreground">
                  <span className="inline-flex items-center gap-1">
                    <UsersIcon className="size-3.5" />
                    {course.learners} learners
                  </span>
                  <Button asChild variant="ghost" size="sm" className="h-7 px-2">
                    <Link to={`/admin/courses/${course.id}`}>Open</Link>
                  </Button>
                </div>
              </motion.div>
            ))}
          </div>
        </section>
      ) : null}

      <section className="overflow-hidden rounded-2xl border">
        <div className="flex flex-col gap-3 border-b p-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="font-heading text-lg font-semibold">
              Course catalogue
            </h2>
            <p className="text-sm text-muted-foreground">
              {filtered.length} course{filtered.length === 1 ? "" : "s"}
            </p>
          </div>
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
            <div className="relative">
              <SearchIcon className="pointer-events-none absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                className="w-full pl-8 sm:w-56"
                placeholder="Search courses…"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
              />
            </div>
            <div className="flex gap-1">
              {(["all", "Published", "Draft"] as const).map((filter) => (
                <Button
                  key={filter}
                  size="sm"
                  variant={statusFilter === filter ? "default" : "outline"}
                  onClick={() => setStatusFilter(filter)}
                >
                  {filter === "all" ? "All" : filter}
                </Button>
              ))}
            </div>
          </div>
        </div>

        {filtered.length === 0 ? (
          <div className="p-10 text-center text-sm text-muted-foreground">
            No courses match your filters.
          </div>
        ) : (
          <div className="grid gap-4 p-4 md:grid-cols-2 xl:grid-cols-3">
            {filtered.map((course, index) => {
              const status = adminCourseStatus(course)
              const cohortNames = course.cohortIds
                .map((id) => cohorts.find((item) => item.id === id)?.name)
                .filter(Boolean)
              return (
                <motion.div
                  key={course.id}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.03 * index }}
                  className="group overflow-hidden rounded-2xl border"
                >
                  <div className="relative aspect-[16/9] overflow-hidden">
                    <img
                      src={course.coverImage}
                      alt=""
                      className="size-full object-cover transition duration-500 group-hover:scale-[1.03]"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/10 to-transparent" />
                    <Badge className="absolute top-3 left-3" variant="secondary">
                      {status}
                    </Badge>
                    <p className="absolute right-3 bottom-3 left-3 font-heading text-sm font-semibold text-white">
                      {course.shortTitle}
                    </p>
                  </div>
                  <div className="flex flex-col gap-3 p-4">
                    <div>
                      <p className="font-medium leading-snug">{course.title}</p>
                      <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">
                        {course.description}
                      </p>
                    </div>
                    <div className="flex flex-wrap gap-x-3 gap-y-1 text-xs text-muted-foreground">
                      <span>{course.moduleCount} modules</span>
                      <span>{course.lessonCount} lessons</span>
                      <span>{course.duration}</span>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Facilitator · {course.facilitator}
                    </p>
                    {cohortNames.length > 0 ? (
                      <div className="flex flex-wrap gap-1.5">
                        {cohortNames.map((name) => (
                          <Badge key={name} variant="outline">
                            {name}
                          </Badge>
                        ))}
                      </div>
                    ) : (
                      <p className="text-xs text-muted-foreground">
                        No cohorts assigned yet
                      </p>
                    )}
                    <Button asChild size="sm">
                      <Link to={`/admin/courses/${course.id}`}>
                        Manage curriculum
                      </Link>
                    </Button>
                  </div>
                </motion.div>
              )
            })}
          </div>
        )}
      </section>

      <Dialog
        open={createOpen}
        onOpenChange={(open) => {
          setCreateOpen(open)
          if (!open) resetCreate()
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>New course</DialogTitle>
            <DialogDescription>
              Create a draft curriculum shell, then add modules and lessons.
            </DialogDescription>
          </DialogHeader>
          <DialogBody>
            <div className="grid gap-2">
              <Label htmlFor="course-title">Title</Label>
              <Input
                id="course-title"
                value={title}
                onChange={(event) => setTitle(event.target.value)}
                placeholder="Export readiness fundamentals"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="course-short">Short title</Label>
              <Input
                id="course-short"
                value={shortTitle}
                onChange={(event) => setShortTitle(event.target.value)}
                placeholder="Export readiness"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="course-desc">Description</Label>
              <textarea
                id="course-desc"
                className="min-h-24 rounded-lg border bg-background px-3 py-2 text-sm"
                value={description}
                onChange={(event) => setDescription(event.target.value)}
              />
            </div>
            <div className="grid gap-2 sm:grid-cols-2">
              <div className="grid gap-2">
                <Label htmlFor="course-fac">Facilitator</Label>
                <Input
                  id="course-fac"
                  value={facilitator}
                  onChange={(event) => setFacilitator(event.target.value)}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="course-duration">Duration</Label>
                <Input
                  id="course-duration"
                  value={duration}
                  onChange={(event) => setDuration(event.target.value)}
                />
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="course-role">Facilitator title</Label>
              <Input
                id="course-role"
                value={facilitatorTitle}
                onChange={(event) => setFacilitatorTitle(event.target.value)}
                placeholder="Lead Facilitator · Trade"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="create-cohort">Assign cohort</Label>
              <div className="flex gap-2">
                <select
                  id="create-cohort"
                  className="h-9 min-w-0 flex-1 rounded-lg border bg-background px-2 text-sm"
                  value={cohortToAdd}
                  onChange={(event) => setCohortToAdd(event.target.value)}
                >
                  <option value="">Select a cohort…</option>
                  {cohorts
                    .filter((cohort) => !cohortIds.includes(cohort.id))
                    .map((cohort) => (
                      <option key={cohort.id} value={cohort.id}>
                        {cohort.name}
                      </option>
                    ))}
                </select>
                <Button
                  type="button"
                  size="sm"
                  variant="secondary"
                  disabled={!cohortToAdd}
                  onClick={addCohortFromSelect}
                >
                  Add
                </Button>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {cohortIds.map((id) => {
                  const cohort = cohorts.find((item) => item.id === id)
                  if (!cohort) return null
                  return (
                    <Badge key={id} variant="secondary" className="gap-1 pr-1">
                      {cohort.name}
                      <button
                        type="button"
                        className="rounded-full p-0.5 hover:bg-foreground/10"
                        onClick={() =>
                          setCohortIds((prev) =>
                            prev.filter((item) => item !== id)
                          )
                        }
                        aria-label={`Remove ${cohort.name}`}
                      >
                        <XIcon className="size-3" />
                      </button>
                    </Badge>
                  )
                })}
              </div>
            </div>
          </DialogBody>
          <DialogFooter>
            <Button variant="outline" onClick={() => setCreateOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleCreate}>Create draft</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </PageLayout>
  )
}
