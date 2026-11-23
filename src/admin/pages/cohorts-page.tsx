import { useMemo, useRef, useState, type MouseEvent } from "react"
import { toast } from "sonner"
import {
  BookOpenIcon,
  CalendarDaysIcon,
  ClockIcon,
  LayersIcon,
  MapPinIcon,
  PlusIcon,
  SearchIcon,
  Settings2Icon,
  Trash2Icon,
  UserPlusIcon,
  UserRoundIcon,
  UsersIcon,
  VideoIcon,
} from "lucide-react"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Progress } from "@/components/ui/progress"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"
import {
  facilitatorDirectory,
  initials,
  type Cohort,
  type EnrolmentCandidate,
  type Facilitator,
} from "@/shared/data/mock-enrolment"
import { useLearning } from "@/shared/learning/learning-context"
import { useEnrolment } from "@/shared/enrolment/enrolment-context"

const statusTone: Record<
  Cohort["status"],
  "default" | "secondary" | "outline"
> = {
  Active: "default",
  Onboarding: "secondary",
  Planning: "outline",
  Alumni: "outline",
}

const SLOT_TYPES = [
  "Live session",
  "Self-paced",
  "Clinic",
  "Office hours",
] as const

const SLOT_LOCATIONS = [
  "Zoom",
  "Teams",
  "Meet",
  "Learning hub",
  "In person",
] as const

const WEEKDAYS = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
] as const

type SlotType = (typeof SLOT_TYPES)[number]

function formatCohortDate(iso: string) {
  if (!iso.trim()) return "TBC"
  const parsed = new Date(`${iso}T12:00:00`)
  if (Number.isNaN(parsed.getTime())) return iso
  return parsed.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  })
}

function formatTimeRange(start: string, end: string) {
  if (!start.trim() || !end.trim()) return ""
  return `${start} – ${end} WAT`
}

const DAY_ORDER = Object.fromEntries(
  WEEKDAYS.map((day, index) => [day, index])
) as Record<string, number>

function accountBadgeVariant(
  status: EnrolmentCandidate["accountStatus"]
): "default" | "secondary" | "outline" {
  if (status === "Activated") return "default"
  if (status === "Invited") return "secondary"
  return "outline"
}

export function AdminCohortsPage() {
  const {
    candidates,
    cohorts,
    timetable,
    allocate,
    unallocate,
    createCohort,
    updateCohort,
    addFacilitator,
    removeFacilitator,
    publishTimetable,
    addTimetableSlot,
    removeTimetableSlot,
    cohortMembers,
    cohortOccupancy,
  } = useEnrolment()
  const { courses: learningCourses, getCourseById } = useLearning()

  const [selectedId, setSelectedId] = useState(
    () =>
      cohorts.find((cohort) => cohort.status !== "Alumni")?.id ?? cohorts[0]?.id
  )
  const [cohortSearch, setCohortSearch] = useState("")
  const [createOpen, setCreateOpen] = useState(false)
  const [slotOpen, setSlotOpen] = useState(false)
  const [addMembersOpen, setAddMembersOpen] = useState(false)
  const [facilitatorOpen, setFacilitatorOpen] = useState(false)
  const [selectedMembers, setSelectedMembers] = useState<string[]>([])
  const [mobileSelecting, setMobileSelecting] = useState(false)
  const [moveCohortId, setMoveCohortId] = useState("")
  const [addMembersQuery, setAddMembersQuery] = useState("")
  const [addMembersPick, setAddMembersPick] = useState<string[]>([])
  const lastClickedIndex = useRef<number | null>(null)
  const longPressTimer = useRef<number | null>(null)

  const [newCohort, setNewCohort] = useState({
    name: "",
    capacity: "40",
    startDate: "",
    endDate: "",
    description: "",
  })

  const [newSlot, setNewSlot] = useState<{
    title: string
    type: SlotType
    day: (typeof WEEKDAYS)[number]
    startTime: string
    endTime: string
    courseId: string
    lessonId: string
    facilitator: string
    location: (typeof SLOT_LOCATIONS)[number]
  }>({
    title: "",
    type: "Live session",
    day: "Monday",
    startTime: "",
    endTime: "",
    courseId: "",
    lessonId: "",
    facilitator: "",
    location: "Zoom",
  })

  const slotCourse = newSlot.courseId
    ? getCourseById(newSlot.courseId)
    : undefined
  const slotLessons = slotCourse
    ? slotCourse.modules.flatMap((module) => module.lessons)
    : []

  const [facilitatorMode, setFacilitatorMode] = useState<"directory" | "custom">(
    "directory"
  )
  const [directoryPickId, setDirectoryPickId] = useState("")
  const [customFacilitator, setCustomFacilitator] = useState({
    name: "",
    role: "",
  })

  const selected = cohorts.find((cohort) => cohort.id === selectedId) ?? null
  const members = selected ? cohortMembers(selected.id) : []
  const occupancy = selected
    ? cohortOccupancy(selected.id)
    : { enrolled: 0, capacity: 0, remaining: 0 }
  const slots = useMemo(
    () =>
      selected
        ? timetable.filter((slot) => slot.cohortId === selected.id)
        : [],
    [selected, timetable]
  )
  const unallocated = candidates.filter((candidate) => !candidate.cohortId)
  const otherCohorts = cohorts.filter(
    (cohort) => cohort.id !== selectedId && cohort.status !== "Alumni"
  )
  const selectionMode = selectedMembers.length > 0 || mobileSelecting
  const allMembersSelected =
    members.length > 0 &&
    members.every((member) => selectedMembers.includes(member.id))

  const filteredCohorts = useMemo(() => {
    const query = cohortSearch.trim().toLowerCase()
    if (!query) return cohorts
    return cohorts.filter(
      (cohort) =>
        cohort.name.toLowerCase().includes(query) ||
        cohort.status.toLowerCase().includes(query) ||
        cohort.programme.toLowerCase().includes(query)
    )
  }, [cohortSearch, cohorts])

  const addMembersCandidates = useMemo(() => {
    const query = addMembersQuery.trim().toLowerCase()
    let list = unallocated
    if (query) {
      list = list.filter(
        (candidate) =>
          candidate.name.toLowerCase().includes(query) ||
          candidate.business.toLowerCase().includes(query) ||
          candidate.applicationId.toLowerCase().includes(query)
      )
    }
    return list
  }, [addMembersQuery, unallocated])

  const availableDirectoryFacilitators = useMemo(() => {
    if (!selected) return facilitatorDirectory
    const assignedIds = new Set(selected.facilitators.map((f) => f.id))
    return facilitatorDirectory.filter((f) => !assignedIds.has(f.id))
  }, [selected])

  const slotFacilitatorOptions = useMemo(
    () => selected?.facilitators.map((f) => f.name) ?? [],
    [selected]
  )

  const overviewStats = useMemo(() => {
    const active = cohorts.filter((cohort) => cohort.status === "Active").length
    const totalMembers = candidates.filter((candidate) =>
      Boolean(candidate.cohortId)
    ).length
    const openSeats = cohorts
      .filter((cohort) => cohort.status !== "Alumni")
      .reduce((sum, cohort) => sum + cohortOccupancy(cohort.id).remaining, 0)
    const published = cohorts.filter(
      (cohort) => cohort.timetablePublished
    ).length

    return [
      {
        label: "Active cohorts",
        value: active,
        hint: `${cohorts.length} total intakes`,
        icon: LayersIcon,
        iconBg: "bg-primary text-primary-foreground",
        wash: "bg-primary/8",
      },
      {
        label: "Members placed",
        value: totalMembers,
        hint: `${unallocated.length} still unallocated`,
        icon: UsersIcon,
        iconBg: "bg-foreground text-background",
        wash: "bg-foreground/[0.04]",
      },
      {
        label: "Available slots",
        value: openSeats,
        hint: "Free capacity across intakes",
        icon: UserRoundIcon,
        iconBg: "bg-primary text-primary-foreground",
        wash: "bg-primary/8",
      },
      {
        label: "Timetables live",
        value: published,
        hint: "Published to participants",
        icon: CalendarDaysIcon,
        iconBg: "bg-foreground text-background",
        wash: "bg-foreground/[0.04]",
      },
    ]
  }, [candidates, cohortOccupancy, cohorts, unallocated.length])

  function clearMemberSelection() {
    setSelectedMembers([])
    setMobileSelecting(false)
    setMoveCohortId("")
    lastClickedIndex.current = null
  }

  function selectMemberAtIndex(index: number, options?: { range?: boolean }) {
    const id = members[index]?.id
    if (!id) return

    if (options?.range && lastClickedIndex.current !== null) {
      const start = Math.min(lastClickedIndex.current, index)
      const end = Math.max(lastClickedIndex.current, index)
      const rangeIds = members.slice(start, end + 1).map((item) => item.id)
      setSelectedMembers((prev) => [...new Set([...prev, ...rangeIds])])
      lastClickedIndex.current = index
      return
    }

    setSelectedMembers((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    )
    lastClickedIndex.current = index
  }

  function handleMemberRowClick(index: number, event: MouseEvent<HTMLTableRowElement>) {
    const target = event.target as HTMLElement
    if (target.closest("button, a, input, label, [data-no-row-select]")) {
      return
    }
    selectMemberAtIndex(index, { range: event.shiftKey })
  }

  function toggleSelectAllMembers() {
    if (allMembersSelected) {
      clearMemberSelection()
      return
    }
    setSelectedMembers(members.map((member) => member.id))
    setMobileSelecting(true)
  }

  function startMobileSelect(id: string, index: number) {
    setMobileSelecting(true)
    setSelectedMembers((prev) => (prev.includes(id) ? prev : [...prev, id]))
    lastClickedIndex.current = index
  }

  function handleMobileMemberPress(index: number) {
    if (selectionMode) {
      selectMemberAtIndex(index)
    }
  }

  function removeSelectedMembers() {
    if (!selectedMembers.length) return
    unallocate(selectedMembers)
    toast.success(
      `Removed ${selectedMembers.length} member${selectedMembers.length === 1 ? "" : "s"}`
    )
    clearMemberSelection()
  }

  function moveSelectedMembers() {
    if (!moveCohortId || !selectedMembers.length) {
      toast.error("Choose a destination cohort")
      return
    }
    const result = allocate(selectedMembers, moveCohortId)
    if (!result.ok) {
      toast.error(result.message)
      return
    }
    toast.success(result.message)
    clearMemberSelection()
  }

  function switchCohort(id: string) {
    setSelectedId(id)
    clearMemberSelection()
  }

  function resetAddMembersSheet() {
    setAddMembersQuery("")
    setAddMembersPick([])
  }

  function toggleAddMemberPick(id: string) {
    setAddMembersPick((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    )
  }

  function toggleAddMembersSelectAll() {
    if (
      addMembersPick.length > 0 &&
      addMembersCandidates.every((c) => addMembersPick.includes(c.id))
    ) {
      setAddMembersPick([])
      return
    }
    setAddMembersPick(addMembersCandidates.map((c) => c.id))
  }

  function handleBulkAddMembers() {
    if (!selected) return
    if (!addMembersPick.length) {
      toast.error("Select at least one candidate")
      return
    }
    const result = allocate(addMembersPick, selected.id)
    if (!result.ok) {
      toast.error(result.message)
      return
    }
    toast.success(result.message)
    setAddMembersOpen(false)
    resetAddMembersSheet()
  }

  function handleCreateCohort() {
    if (!newCohort.name.trim()) {
      toast.error("Cohort name is required")
      return
    }
    const capacity = Number(newCohort.capacity) || 40
    const created = createCohort({
      name: newCohort.name.trim(),
      capacity,
      startDate: formatCohortDate(newCohort.startDate),
      endDate: formatCohortDate(newCohort.endDate),
      description:
        newCohort.description.trim() ||
        "New Bootcamp cohort ready for participant allocation.",
    })
    setSelectedId(created.id)
    clearMemberSelection()
    setCreateOpen(false)
    setNewCohort({
      name: "",
      capacity: "40",
      startDate: "",
      endDate: "",
      description: "",
    })
    toast.success(`${created.name} created`)
  }

  function resetSlotForm() {
    setNewSlot({
      title: "",
      type: "Live session",
      day: "Monday",
      startTime: "",
      endTime: "",
      courseId: "",
      lessonId: "",
      facilitator: "",
      location: "Zoom",
    })
  }

  function handleAddSlot() {
    if (!selected) return
    const time = formatTimeRange(newSlot.startTime, newSlot.endTime)
    if (!newSlot.title.trim() || !time) {
      toast.error("Title and start/end time are required")
      return
    }
    if (!newSlot.courseId) {
      toast.error("Attach a course to this session")
      return
    }
    addTimetableSlot({
      cohortId: selected.id,
      day: newSlot.day,
      date: "",
      time,
      title: newSlot.title.trim(),
      type: newSlot.type,
      courseId: newSlot.courseId,
      lessonId: newSlot.lessonId || undefined,
      facilitator: newSlot.facilitator.trim() || "Self-directed",
      location: newSlot.location,
    })
    setSlotOpen(false)
    resetSlotForm()
    toast.success("Session added — publish when ready")
  }

  function resetFacilitatorForm() {
    setFacilitatorMode("directory")
    setDirectoryPickId("")
    setCustomFacilitator({ name: "", role: "" })
  }

  function handleAddFacilitator() {
    if (!selected) return

    let facilitator: Facilitator | null = null

    if (facilitatorMode === "directory") {
      facilitator =
        facilitatorDirectory.find((item) => item.id === directoryPickId) ?? null
      if (!facilitator) {
        toast.error("Choose a facilitator from the directory")
        return
      }
    } else {
      if (!customFacilitator.name.trim()) {
        toast.error("Facilitator name is required")
        return
      }
      facilitator = {
        id: `fac-${Date.now()}`,
        name: customFacilitator.name.trim(),
        role: customFacilitator.role.trim() || "Facilitator",
      }
    }

    const result = addFacilitator(selected.id, facilitator)
    if (!result.ok) {
      toast.error(result.message)
      return
    }
    toast.success(result.message)
    setFacilitatorOpen(false)
    resetFacilitatorForm()
  }

  function handleRemoveFacilitator(facilitator: Facilitator) {
    if (!selected) return
    removeFacilitator(selected.id, facilitator.id)
    toast.message(`${facilitator.name} removed`)
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-heading text-2xl font-semibold tracking-tight">
            Cohorts
          </h1>
          <p className="text-sm text-muted-foreground">
            Manage members, facilitators and programme timetables.
          </p>
        </div>
        <Button size="lg" onClick={() => setCreateOpen(true)}>
          <PlusIcon data-icon="inline-start" />
          New cohort
        </Button>
      </div>

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

      <div className="flex flex-col gap-4 lg:flex-row lg:items-start">
        <aside className="flex w-full shrink-0 flex-col overflow-hidden rounded-2xl border bg-card lg:w-72">
          <div className="border-b p-3">
            <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
              Cohorts
            </p>
            <div className="relative mt-2 block">
              <SearchIcon className="pointer-events-none absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                className="pl-8"
                placeholder="Search cohorts…"
                value={cohortSearch}
                onChange={(event) => setCohortSearch(event.target.value)}
                aria-label="Search cohorts"
              />
            </div>
          </div>
          <div
            className="max-h-[min(420px,50vh)] overflow-y-auto"
            role="listbox"
            aria-label="Cohort list"
          >
            {filteredCohorts.length === 0 ? (
              <p className="p-4 text-center text-sm text-muted-foreground">
                No cohorts match your search.
              </p>
            ) : (
              filteredCohorts.map((cohort) => {
                const seat = cohortOccupancy(cohort.id)
                const active = cohort.id === selectedId
                return (
                  <button
                    key={cohort.id}
                    type="button"
                    role="option"
                    aria-selected={active}
                    onClick={() => switchCohort(cohort.id)}
                    className={`flex w-full flex-col gap-1 border-b px-3 py-3 text-left text-sm transition-colors last:border-b-0 ${
                      active
                        ? "border-l-2 border-l-primary bg-primary/5"
                        : "hover:bg-muted/50"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <span className="font-medium leading-snug">{cohort.name}</span>
                      <Badge
                        variant={statusTone[cohort.status]}
                        className="shrink-0 text-[10px]"
                      >
                        {cohort.status}
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {seat.enrolled}/{seat.capacity} seats
                    </p>
                  </button>
                )
              })
            )}
          </div>
          <div className="border-t p-3">
            <Button
              size="lg"
              className="w-full"
              onClick={() => setCreateOpen(true)}
            >
              <PlusIcon data-icon="inline-start" />
              New cohort
            </Button>
          </div>
        </aside>

        {selected ? (
          <div
            className="min-w-0 flex-1 overflow-hidden rounded-2xl border bg-card"
          >
            <div className="flex flex-col gap-3 border-b px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <h2 className="font-heading text-lg font-semibold">
                    {selected.name}
                  </h2>
                  <Badge variant={statusTone[selected.status]}>
                    {selected.status}
                  </Badge>
                </div>
                <p className="mt-1 text-xs text-muted-foreground">
                  {occupancy.enrolled} enrolled · {occupancy.remaining}{" "}
                  available · {selected.progress}% complete
                </p>
              </div>
              <Progress
                className="h-1.5 w-full sm:max-w-[160px]"
                value={
                  occupancy.capacity
                    ? Math.round(
                        (occupancy.enrolled / occupancy.capacity) * 100
                      )
                    : 0
                }
              />
            </div>

            <div className="p-4 pt-3">
              <Tabs
                defaultValue="members"
                onValueChange={() => clearMemberSelection()}
              >
                <TabsList className="h-10 w-fit self-start gap-1 rounded-xl bg-muted p-1">
                  <TabsTrigger
                    value="members"
                    className="h-8 flex-none gap-2 rounded-lg px-3.5"
                  >
                    <UsersIcon className="size-4" />
                    Members
                  </TabsTrigger>
                  <TabsTrigger
                    value="facilitators"
                    className="h-8 flex-none gap-2 rounded-lg px-3.5"
                  >
                    <UserRoundIcon className="size-4" />
                    Facilitators
                  </TabsTrigger>
                  <TabsTrigger
                    value="timetable"
                    className="h-8 flex-none gap-2 rounded-lg px-3.5"
                  >
                    <CalendarDaysIcon className="size-4" />
                    Timetable
                  </TabsTrigger>
                  <TabsTrigger
                    value="settings"
                    className="h-8 flex-none gap-2 rounded-lg px-3.5"
                  >
                    <Settings2Icon className="size-4" />
                    Settings
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="members" className="mt-4">
                  <div className="overflow-hidden rounded-xl border">
                    <div className="flex flex-col gap-3 border-b p-3 sm:flex-row sm:items-center sm:justify-between">
                      <p className="text-sm text-muted-foreground">
                        Participants in this cohort
                      </p>
                      <Button
                        size="lg"
                        disabled={
                          unallocated.length === 0 || occupancy.remaining === 0
                        }
                        onClick={() => {
                          resetAddMembersSheet()
                          setAddMembersOpen(true)
                        }}
                      >
                        <UserPlusIcon data-icon="inline-start" />
                        Add members
                      </Button>
                    </div>

                    {selectionMode ? (
                      <div className="sticky top-14 z-10 flex flex-col gap-3 border-b bg-primary/5 px-3 py-3 backdrop-blur-sm sm:flex-row sm:items-center sm:justify-between">
                        <div className="flex items-center gap-3">
                          <button
                            type="button"
                            onClick={clearMemberSelection}
                            className="rounded-full border border-primary/20 bg-background px-3 py-1 text-xs font-medium text-primary hover:bg-primary/10"
                          >
                            {selectedMembers.length} selected · Done
                          </button>
                          <button
                            type="button"
                            onClick={toggleSelectAllMembers}
                            className="text-xs text-muted-foreground hover:text-foreground"
                          >
                            {allMembersSelected ? "Deselect all" : "Select all"}
                          </button>
                          <p className="hidden text-xs text-muted-foreground lg:block">
                            Click a row to toggle · Shift+click for a range
                          </p>
                        </div>
                        <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
                          <div className="flex items-center gap-2">
                            <select
                              className="h-9 min-w-[160px] rounded-lg border bg-background px-2 text-sm"
                              value={moveCohortId}
                              onChange={(event) =>
                                setMoveCohortId(event.target.value)
                              }
                            >
                              <option value="">Move to…</option>
                              {otherCohorts.map((cohort) => {
                                const seat = cohortOccupancy(cohort.id)
                                return (
                                  <option key={cohort.id} value={cohort.id}>
                                    {cohort.name} ({seat.enrolled}/{seat.capacity}
                                    )
                                  </option>
                                )
                              })}
                            </select>
                            <Button
                              size="lg"
                              disabled={
                                !selectedMembers.length || !moveCohortId
                              }
                              onClick={moveSelectedMembers}
                            >
                              Move
                            </Button>
                          </div>
                          <Button
                            size="lg"
                            variant="secondary"
                            disabled={!selectedMembers.length}
                            onClick={removeSelectedMembers}
                          >
                            <Trash2Icon data-icon="inline-start" />
                            Remove
                          </Button>
                        </div>
                      </div>
                    ) : null}

                    {members.length === 0 ? (
                      <Empty className="border-0 py-12">
                        <EmptyHeader>
                          <EmptyMedia variant="icon">
                            <UsersIcon />
                          </EmptyMedia>
                          <EmptyTitle>No members yet</EmptyTitle>
                          <EmptyDescription>
                            Use Add members to place unallocated applicants, or
                            allocate from Enrolment.
                          </EmptyDescription>
                        </EmptyHeader>
                      </Empty>
                    ) : (
                      <>
                        <div className="hidden overflow-x-auto md:block">
                          <table className="w-full min-w-[760px] text-left text-sm">
                            <thead className="border-b bg-muted/30 text-xs text-muted-foreground">
                              <tr>
                                <th className="w-10 px-4 py-3 font-medium">
                                  <input
                                    type="checkbox"
                                    className="size-4 accent-primary"
                                    checked={allMembersSelected}
                                    onChange={toggleSelectAllMembers}
                                    aria-label="Select all members"
                                  />
                                </th>
                                <th className="px-3 py-3 font-medium">Member</th>
                                <th className="px-3 py-3 font-medium">Business</th>
                                <th className="px-3 py-3 font-medium">Account</th>
                                <th className="px-3 py-3 font-medium">
                                  Onboarding
                                </th>
                                <th className="px-4 py-3 text-right font-medium">
                                  Actions
                                </th>
                              </tr>
                            </thead>
                            <tbody>
                              {members.map((member, index) => {
                                const isSelected = selectedMembers.includes(
                                  member.id
                                )
                                return (
                                  <tr
                                    key={member.id}
                                    onClick={(event) =>
                                      handleMemberRowClick(index, event)
                                    }
                                    className={`cursor-pointer border-b last:border-b-0 transition-colors hover:bg-muted/40 ${
                                      isSelected
                                        ? "bg-primary/5 ring-1 ring-inset ring-primary/15"
                                        : ""
                                    }`}
                                  >
                                    <td className="px-4 py-3">
                                      <input
                                        type="checkbox"
                                        className="size-4 accent-primary"
                                        checked={isSelected}
                                        onChange={() =>
                                          selectMemberAtIndex(index)
                                        }
                                        onClick={(event) =>
                                          event.stopPropagation()
                                        }
                                        aria-label={`Select ${member.name}`}
                                      />
                                    </td>
                                    <td className="px-3 py-3">
                                      <div className="flex items-center gap-3">
                                        <Avatar size="sm">
                                          {member.avatar ? (
                                            <AvatarImage
                                              src={member.avatar}
                                              alt={member.name}
                                            />
                                          ) : null}
                                          <AvatarFallback>
                                            {initials(member.name)}
                                          </AvatarFallback>
                                        </Avatar>
                                        <div>
                                          <p className="font-medium">
                                            {member.name}
                                          </p>
                                          <p className="text-xs text-muted-foreground">
                                            {member.applicationId} ·{" "}
                                            {member.country}
                                          </p>
                                        </div>
                                      </div>
                                    </td>
                                    <td className="px-3 py-3">
                                      <p className="font-medium">
                                        {member.business}
                                      </p>
                                      <p className="text-xs text-muted-foreground">
                                        {member.sector}
                                      </p>
                                    </td>
                                    <td className="px-3 py-3">
                                      <Badge
                                        variant={accountBadgeVariant(
                                          member.accountStatus
                                        )}
                                      >
                                        {member.accountStatus}
                                      </Badge>
                                    </td>
                                    <td className="px-3 py-3">
                                      <Badge variant="outline">
                                        {member.onboarding}
                                      </Badge>
                                    </td>
                                    <td className="px-4 py-3" data-no-row-select>
                                      <div className="flex justify-end">
                                        <Button
                                          size="sm"
                                          variant="outline"
                                          onClick={(event) => {
                                            event.stopPropagation()
                                            unallocate([member.id])
                                            toast.message(
                                              `${member.name} removed`
                                            )
                                          }}
                                        >
                                          Remove
                                        </Button>
                                      </div>
                                    </td>
                                  </tr>
                                )
                              })}
                            </tbody>
                          </table>
                        </div>

                        <div className="flex flex-col divide-y md:hidden">
                          {!selectionMode ? (
                            <p className="bg-muted/20 px-4 py-2 text-xs text-muted-foreground">
                              Long-press a member to multi-select
                            </p>
                          ) : null}
                          {members.map((member, index) => {
                            const isSelected = selectedMembers.includes(
                              member.id
                            )
                            return (
                              <div
                                key={member.id}
                                className={`flex flex-col gap-3 p-4 ${
                                  isSelected ? "bg-primary/5" : ""
                                }`}
                                onClick={() => handleMobileMemberPress(index)}
                                onContextMenu={(event) => {
                                  event.preventDefault()
                                  startMobileSelect(member.id, index)
                                }}
                                onTouchStart={() => {
                                  longPressTimer.current = window.setTimeout(
                                    () => {
                                      startMobileSelect(member.id, index)
                                    },
                                    450
                                  )
                                }}
                                onTouchEnd={() => {
                                  if (longPressTimer.current) {
                                    window.clearTimeout(longPressTimer.current)
                                    longPressTimer.current = null
                                  }
                                }}
                                onTouchMove={() => {
                                  if (longPressTimer.current) {
                                    window.clearTimeout(longPressTimer.current)
                                    longPressTimer.current = null
                                  }
                                }}
                              >
                                <div className="flex items-start gap-3">
                                  {selectionMode ? (
                                    <input
                                      type="checkbox"
                                      className="mt-2 size-4 accent-primary"
                                      checked={isSelected}
                                      onChange={() => selectMemberAtIndex(index)}
                                      onClick={(event) =>
                                        event.stopPropagation()
                                      }
                                    />
                                  ) : null}
                                  <Avatar>
                                    {member.avatar ? (
                                      <AvatarImage
                                        src={member.avatar}
                                        alt={member.name}
                                      />
                                    ) : null}
                                    <AvatarFallback>
                                      {initials(member.name)}
                                    </AvatarFallback>
                                  </Avatar>
                                  <div className="min-w-0 flex-1">
                                    <p className="font-medium">{member.name}</p>
                                    <p className="text-sm text-muted-foreground">
                                      {member.business}
                                    </p>
                                    <div className="mt-2 flex flex-wrap gap-1.5">
                                      <Badge variant="outline">
                                        {member.accountStatus}
                                      </Badge>
                                      <Badge variant="outline">
                                        {member.onboarding}
                                      </Badge>
                                    </div>
                                  </div>
                                </div>
                                {!selectionMode ? (
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={(event) => {
                                      event.stopPropagation()
                                      unallocate([member.id])
                                      toast.message(`${member.name} removed`)
                                    }}
                                  >
                                    Remove
                                  </Button>
                                ) : null}
                              </div>
                            )
                          })}
                        </div>
                      </>
                    )}
                  </div>
                </TabsContent>

                <TabsContent value="facilitators" className="mt-4">
                  <div className="overflow-hidden rounded-xl border">
                    <div className="flex flex-col gap-3 border-b p-3 sm:flex-row sm:items-center sm:justify-between">
                      <p className="text-sm text-muted-foreground">
                        Delivery team for this intake
                      </p>
                      <Button
                        size="lg"
                        onClick={() => {
                          resetFacilitatorForm()
                          setFacilitatorOpen(true)
                        }}
                      >
                        <PlusIcon data-icon="inline-start" />
                        Add facilitator
                      </Button>
                    </div>

                    {selected.facilitators.length === 0 ? (
                      <Empty className="border-0 py-12">
                        <EmptyHeader>
                          <EmptyTitle>No facilitators assigned</EmptyTitle>
                          <EmptyDescription>
                            Add from the directory or enter a custom name and
                            role.
                          </EmptyDescription>
                        </EmptyHeader>
                      </Empty>
                    ) : (
                      <>
                        <div className="hidden md:block">
                          <table className="w-full text-left text-sm">
                            <thead className="border-b bg-muted/30 text-xs text-muted-foreground">
                              <tr>
                                <th className="px-4 py-3 font-medium">
                                  Facilitator
                                </th>
                                <th className="px-4 py-3 font-medium">Role</th>
                                <th className="px-4 py-3 text-right font-medium">
                                  Actions
                                </th>
                              </tr>
                            </thead>
                            <tbody>
                              {selected.facilitators.map((facilitator) => (
                                <tr
                                  key={facilitator.id}
                                  className="border-b last:border-b-0"
                                >
                                  <td className="px-4 py-3">
                                    <div className="flex items-center gap-3">
                                      <Avatar size="sm">
                                        <AvatarFallback>
                                          {initials(facilitator.name)}
                                        </AvatarFallback>
                                      </Avatar>
                                      <span className="font-medium">
                                        {facilitator.name}
                                      </span>
                                    </div>
                                  </td>
                                  <td className="px-4 py-3 text-muted-foreground">
                                    {facilitator.role}
                                  </td>
                                  <td className="px-4 py-3">
                                    <div className="flex justify-end">
                                      <Button
                                        size="sm"
                                        variant="outline"
                                        onClick={() =>
                                          handleRemoveFacilitator(facilitator)
                                        }
                                      >
                                        <Trash2Icon data-icon="inline-start" />
                                        Remove
                                      </Button>
                                    </div>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                        <div className="flex flex-col divide-y md:hidden">
                          {selected.facilitators.map((facilitator) => (
                            <div
                              key={facilitator.id}
                              className="flex items-center justify-between gap-3 p-4"
                            >
                              <div className="flex items-center gap-3">
                                <Avatar>
                                  <AvatarFallback>
                                    {initials(facilitator.name)}
                                  </AvatarFallback>
                                </Avatar>
                                <div>
                                  <p className="font-medium">{facilitator.name}</p>
                                  <p className="text-xs text-muted-foreground">
                                    {facilitator.role}
                                  </p>
                                </div>
                              </div>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() =>
                                  handleRemoveFacilitator(facilitator)
                                }
                              >
                                Remove
                              </Button>
                            </div>
                          ))}
                        </div>
                      </>
                    )}
                  </div>
                </TabsContent>

                <TabsContent value="timetable" className="mt-4">
                  <div className="flex flex-col gap-4">
                    <div className="flex flex-col gap-3 rounded-2xl border bg-gradient-to-br from-primary/5 via-background to-muted/30 p-4 sm:flex-row sm:items-center sm:justify-between">
                      <div>
                        <p className="font-heading text-base font-semibold">
                          Programme schedule
                        </p>
                        <p className="mt-0.5 text-sm text-muted-foreground">
                          {selected.timetablePublished
                            ? "Live for participants in this cohort"
                            : "Draft — add sessions, then publish"}
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          size="lg"
                          variant="secondary"
                          onClick={() => {
                            resetSlotForm()
                            setSlotOpen(true)
                          }}
                        >
                          <PlusIcon data-icon="inline-start" />
                          Add session
                        </Button>
                        <Button
                          size="lg"
                          disabled={
                            slots.length === 0 || selected.timetablePublished
                          }
                          onClick={() => {
                            publishTimetable(selected.id)
                            toast.success(
                              `${selected.name} timetable published`
                            )
                          }}
                        >
                          Publish schedule
                        </Button>
                      </div>
                    </div>

                    {slots.length === 0 ? (
                      <Empty className="rounded-2xl border border-dashed py-14">
                        <EmptyHeader>
                          <EmptyMedia variant="icon">
                            <CalendarDaysIcon />
                          </EmptyMedia>
                          <EmptyTitle>No sessions scheduled</EmptyTitle>
                          <EmptyDescription>
                            Build the cohort calendar with live sessions,
                            clinics and self-paced windows.
                          </EmptyDescription>
                        </EmptyHeader>
                      </Empty>
                    ) : (
                      <div className="flex flex-col gap-6">
                        {Object.entries(
                          slots.reduce<Record<string, typeof slots>>(
                            (groups, slot) => {
                              const key = slot.day || "Monday"
                              if (!groups[key]) groups[key] = []
                              groups[key].push(slot)
                              return groups
                            },
                            {}
                          )
                        )
                          .sort(
                            ([a], [b]) =>
                              (DAY_ORDER[a] ?? 99) - (DAY_ORDER[b] ?? 99)
                          )
                          .map(([dayLabel, daySlots]) => {
                          return (
                            <div key={dayLabel} className="flex flex-col gap-3">
                              <div className="flex items-center gap-3">
                                <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-primary font-heading text-sm font-semibold text-primary-foreground shadow-sm">
                                  {dayLabel.slice(0, 3)}
                                </div>
                                <div>
                                  <p className="font-heading font-semibold">
                                    {dayLabel}
                                  </p>
                                  <p className="text-xs text-muted-foreground">
                                    {daySlots.length} session
                                    {daySlots.length === 1 ? "" : "s"}
                                  </p>
                                </div>
                              </div>

                              <div className="relative ml-6 border-l-2 border-primary/20 pl-6">
                                <div className="flex flex-col gap-3">
                                  {daySlots.map((slot) => {
                                    const TypeIcon =
                                      slot.type === "Self-paced"
                                        ? BookOpenIcon
                                        : slot.type === "Office hours"
                                          ? UserRoundIcon
                                          : VideoIcon
                                    const course = slot.courseId
                                      ? getCourseById(slot.courseId)
                                      : undefined
                                    const lesson = course
                                      ?.modules.flatMap((m) => m.lessons)
                                      .find((l) => l.id === slot.lessonId)
                                    return (
                                      <div
                                        key={slot.id}
                                        className="group relative rounded-2xl border bg-card p-4 shadow-sm transition-shadow hover:shadow-md"
                                      >
                                        <div className="absolute top-1/2 -left-[1.9rem] size-3 -translate-y-1/2 rounded-full border-2 border-primary bg-background" />
                                        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                                          <div className="flex min-w-0 gap-3">
                                            <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                                              <TypeIcon className="size-5" />
                                            </div>
                                            <div className="min-w-0">
                                              <div className="flex flex-wrap items-center gap-2">
                                                <p className="font-heading font-semibold">
                                                  {slot.title}
                                                </p>
                                                <Badge variant="secondary">
                                                  {slot.type}
                                                </Badge>
                                              </div>
                                              {course ? (
                                                <p className="mt-1 text-sm text-foreground/80">
                                                  <span className="text-muted-foreground">
                                                    Course ·{" "}
                                                  </span>
                                                  {course.shortTitle}
                                                  {lesson
                                                    ? ` → ${lesson.title}`
                                                    : ""}
                                                </p>
                                              ) : null}
                                              <div className="mt-2 flex flex-col gap-1.5 text-sm text-muted-foreground sm:flex-row sm:flex-wrap sm:gap-x-4">
                                                <span className="inline-flex items-center gap-1.5">
                                                  <ClockIcon className="size-3.5" />
                                                  {slot.time}
                                                </span>
                                                <span className="inline-flex items-center gap-1.5">
                                                  <UserRoundIcon className="size-3.5" />
                                                  {slot.facilitator}
                                                </span>
                                                <span className="inline-flex items-center gap-1.5">
                                                  <MapPinIcon className="size-3.5" />
                                                  {slot.location}
                                                </span>
                                              </div>
                                            </div>
                                          </div>
                                          <Button
                                            size="sm"
                                            variant="outline"
                                            className="shrink-0"
                                            onClick={() => {
                                              removeTimetableSlot(slot.id)
                                              toast.message("Session removed")
                                            }}
                                          >
                                            <Trash2Icon data-icon="inline-start" />
                                            Remove
                                          </Button>
                                        </div>
                                      </div>
                                    )
                                  })}
                                </div>
                              </div>
                            </div>
                          )
                        })}
                      </div>
                    )}
                  </div>
                </TabsContent>

                <TabsContent value="settings" className="mt-4">
                  <div className="grid max-w-xl gap-4 rounded-xl border p-4">
                    <div className="grid gap-2">
                      <Label htmlFor="cohort-status">Status</Label>
                      <select
                        id="cohort-status"
                        className="h-9 rounded-lg border bg-background px-3 text-sm"
                        value={selected.status}
                        onChange={(event) => {
                          updateCohort(selected.id, {
                            status: event.target.value as Cohort["status"],
                          })
                          toast.success("Cohort status updated")
                        }}
                      >
                        <option value="Planning">Planning</option>
                        <option value="Onboarding">Onboarding</option>
                        <option value="Active">Active</option>
                        <option value="Alumni">Alumni</option>
                      </select>
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="cohort-capacity">Capacity</Label>
                      <Input
                        id="cohort-capacity"
                        type="number"
                        min={members.length}
                        key={`${selected.id}-${selected.capacity}`}
                        defaultValue={selected.capacity}
                        onBlur={(event) => {
                          const capacity = Number(event.target.value)
                          if (!capacity || capacity < members.length) {
                            toast.error(
                              `Capacity cannot be below current members (${members.length})`
                            )
                            event.target.value = String(selected.capacity)
                            return
                          }
                          updateCohort(selected.id, { capacity })
                          toast.success("Capacity updated")
                        }}
                      />
                    </div>
                    <div className="rounded-lg border bg-muted/20 p-3 text-sm text-muted-foreground">
                      Programme: {selected.programme}
                      <br />
                      Dates: {selected.startDate} → {selected.endDate}
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          </div>
        ) : (
          <Empty className="flex-1 rounded-2xl border py-16">
            <EmptyHeader>
              <EmptyTitle>No cohort selected</EmptyTitle>
              <EmptyDescription>
                Create a cohort or pick one from the list.
              </EmptyDescription>
            </EmptyHeader>
          </Empty>
        )}
      </div>

      <Sheet
        open={createOpen}
        onOpenChange={(open) => {
          setCreateOpen(open)
        }}
      >
        <SheetContent side="right" className="w-full sm:max-w-md">
          <SheetHeader className="border-b">
            <SheetTitle>Create cohort</SheetTitle>
            <SheetDescription>
              Set capacity and dates, then add members.
            </SheetDescription>
          </SheetHeader>
          <div className="flex flex-col gap-4 px-4 py-2">
            <div className="grid gap-2">
              <Label htmlFor="new-name">Name</Label>
              <Input
                id="new-name"
                value={newCohort.name}
                onChange={(event) =>
                  setNewCohort((prev) => ({
                    ...prev,
                    name: event.target.value,
                  }))
                }
                placeholder="2027 Cohort 3"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="new-capacity">Capacity</Label>
              <Input
                id="new-capacity"
                type="number"
                value={newCohort.capacity}
                onChange={(event) =>
                  setNewCohort((prev) => ({
                    ...prev,
                    capacity: event.target.value,
                  }))
                }
              />
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="grid gap-2">
                <Label htmlFor="new-start">Start date</Label>
                <Input
                  id="new-start"
                  type="date"
                  value={newCohort.startDate}
                  onChange={(event) =>
                    setNewCohort((prev) => ({
                      ...prev,
                      startDate: event.target.value,
                    }))
                  }
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="new-end">End date</Label>
                <Input
                  id="new-end"
                  type="date"
                  value={newCohort.endDate}
                  onChange={(event) =>
                    setNewCohort((prev) => ({
                      ...prev,
                      endDate: event.target.value,
                    }))
                  }
                />
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="new-desc">Internal note (optional)</Label>
              <Input
                id="new-desc"
                value={newCohort.description}
                onChange={(event) =>
                  setNewCohort((prev) => ({
                    ...prev,
                    description: event.target.value,
                  }))
                }
                placeholder="Not shown in cohort header"
              />
            </div>
          </div>
          <SheetFooter className="border-t">
            <Button variant="outline" onClick={() => setCreateOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleCreateCohort}>Create cohort</Button>
          </SheetFooter>
        </SheetContent>
      </Sheet>

      <Sheet
        open={addMembersOpen}
        onOpenChange={(open) => {
          setAddMembersOpen(open)
          if (!open) resetAddMembersSheet()
        }}
      >
        <SheetContent side="right" className="flex w-full flex-col sm:max-w-md">
          <SheetHeader className="border-b">
            <SheetTitle>Add members</SheetTitle>
            <SheetDescription>
              {selected
                ? `Allocate unplaced applicants to ${selected.name} (${occupancy.remaining} seats open).`
                : "Select a cohort first."}
            </SheetDescription>
          </SheetHeader>
          <div className="flex flex-col gap-3 px-4 py-2">
            <div className="relative">
              <SearchIcon className="pointer-events-none absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                className="pl-8"
                placeholder="Search unallocated…"
                value={addMembersQuery}
                onChange={(event) => setAddMembersQuery(event.target.value)}
              />
            </div>
            {addMembersCandidates.length > 0 ? (
              <button
                type="button"
                onClick={toggleAddMembersSelectAll}
                className="text-left text-xs text-muted-foreground hover:text-foreground"
              >
                {addMembersPick.length > 0 &&
                addMembersCandidates.every((c) =>
                  addMembersPick.includes(c.id)
                )
                  ? "Deselect all"
                  : "Select all shown"}
              </button>
            ) : null}
            <div className="max-h-[min(52vh,420px)] overflow-y-auto rounded-xl border">
              {addMembersCandidates.length === 0 ? (
                <p className="p-4 text-center text-sm text-muted-foreground">
                  No unallocated candidates match.
                </p>
              ) : (
                addMembersCandidates.map((candidate) => {
                  const checked = addMembersPick.includes(candidate.id)
                  return (
                    <label
                      key={candidate.id}
                      className={`flex cursor-pointer items-start gap-3 border-b p-3 last:border-b-0 ${
                        checked ? "bg-primary/5" : "hover:bg-muted/40"
                      }`}
                    >
                      <input
                        type="checkbox"
                        className="mt-1 size-4 accent-primary"
                        checked={checked}
                        onChange={() => toggleAddMemberPick(candidate.id)}
                      />
                      <div className="min-w-0 flex-1">
                        <p className="font-medium">{candidate.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {candidate.business} · {candidate.applicationId}
                        </p>
                      </div>
                    </label>
                  )
                })
              )}
            </div>
            {addMembersPick.length > 0 ? (
              <p className="text-xs text-muted-foreground">
                {addMembersPick.length} selected
              </p>
            ) : null}
          </div>
          <SheetFooter className="border-t">
            <Button
              variant="outline"
              onClick={() => setAddMembersOpen(false)}
            >
              Cancel
            </Button>
            <Button
              disabled={!addMembersPick.length}
              onClick={handleBulkAddMembers}
            >
              Add to cohort
            </Button>
          </SheetFooter>
        </SheetContent>
      </Sheet>

      <Sheet
        open={facilitatorOpen}
        onOpenChange={(open) => {
          setFacilitatorOpen(open)
          if (!open) resetFacilitatorForm()
        }}
      >
        <SheetContent side="right" className="w-full sm:max-w-md">
          <SheetHeader className="border-b">
            <SheetTitle>Add facilitator</SheetTitle>
            <SheetDescription>
              {selected
                ? `Assign delivery support to ${selected.name}.`
                : "Select a cohort first."}
            </SheetDescription>
          </SheetHeader>
          <div className="flex flex-col gap-4 px-4 py-2">
            <div className="flex gap-2">
              <Button
                type="button"
                size="sm"
                variant={
                  facilitatorMode === "directory" ? "default" : "outline"
                }
                onClick={() => setFacilitatorMode("directory")}
              >
                Directory
              </Button>
              <Button
                type="button"
                size="sm"
                variant={facilitatorMode === "custom" ? "default" : "outline"}
                onClick={() => setFacilitatorMode("custom")}
              >
                Custom
              </Button>
            </div>

            {facilitatorMode === "directory" ? (
              <div className="grid gap-2">
                <Label htmlFor="fac-directory">From directory</Label>
                <select
                  id="fac-directory"
                  className="h-9 rounded-lg border bg-background px-3 text-sm"
                  value={directoryPickId}
                  onChange={(event) => setDirectoryPickId(event.target.value)}
                >
                  <option value="">Choose facilitator…</option>
                  {availableDirectoryFacilitators.map((facilitator) => (
                    <option key={facilitator.id} value={facilitator.id}>
                      {facilitator.name} · {facilitator.role}
                    </option>
                  ))}
                </select>
                {availableDirectoryFacilitators.length === 0 ? (
                  <p className="text-xs text-muted-foreground">
                    Everyone in the directory is already assigned.
                  </p>
                ) : null}
              </div>
            ) : (
              <>
                <div className="grid gap-2">
                  <Label htmlFor="fac-custom-name">Name</Label>
                  <Input
                    id="fac-custom-name"
                    value={customFacilitator.name}
                    onChange={(event) =>
                      setCustomFacilitator((prev) => ({
                        ...prev,
                        name: event.target.value,
                      }))
                    }
                    placeholder="Facilitator name"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="fac-custom-role">Role</Label>
                  <Input
                    id="fac-custom-role"
                    value={customFacilitator.role}
                    onChange={(event) =>
                      setCustomFacilitator((prev) => ({
                        ...prev,
                        role: event.target.value,
                      }))
                    }
                    placeholder="e.g. Trade coach"
                  />
                </div>
              </>
            )}
          </div>
          <SheetFooter className="border-t">
            <Button variant="outline" onClick={() => setFacilitatorOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddFacilitator}>Add facilitator</Button>
          </SheetFooter>
        </SheetContent>
      </Sheet>

      <Sheet open={slotOpen} onOpenChange={setSlotOpen}>
        <SheetContent side="right" className="w-full sm:max-w-md">
          <SheetHeader className="border-b">
            <SheetTitle>Add session</SheetTitle>
            <SheetDescription>
              Attach a course (and optional lesson), then set day and time.
            </SheetDescription>
          </SheetHeader>
          <div className="flex flex-col gap-4 px-4 py-2">
            <div className="grid gap-2">
              <Label htmlFor="slot-course">Course</Label>
              <select
                id="slot-course"
                className="h-9 rounded-lg border bg-background px-3 text-sm"
                value={newSlot.courseId}
                onChange={(event) => {
                  const courseId = event.target.value
                  const course = getCourseById(courseId)
                  setNewSlot((prev) => ({
                    ...prev,
                    courseId,
                    lessonId: "",
                    title:
                      prev.title.trim() ||
                      course?.shortTitle ||
                      prev.title,
                    facilitator:
                      prev.facilitator || course?.facilitator || "",
                  }))
                }}
              >
                <option value="">Select course…</option>
                {learningCourses.map((course) => (
                  <option key={course.id} value={course.id}>
                    {course.title}
                  </option>
                ))}
              </select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="slot-lesson">Lesson (optional)</Label>
              <select
                id="slot-lesson"
                className="h-9 rounded-lg border bg-background px-3 text-sm disabled:opacity-50"
                value={newSlot.lessonId}
                disabled={!newSlot.courseId}
                onChange={(event) => {
                  const lessonId = event.target.value
                  const lesson = slotLessons.find((item) => item.id === lessonId)
                  setNewSlot((prev) => ({
                    ...prev,
                    lessonId,
                    title: lesson?.title || prev.title,
                  }))
                }}
              >
                <option value="">Whole course / live session</option>
                {slotLessons.map((lesson) => (
                  <option key={lesson.id} value={lesson.id}>
                    {lesson.title}
                  </option>
                ))}
              </select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="slot-title">Session title</Label>
              <Input
                id="slot-title"
                value={newSlot.title}
                onChange={(event) =>
                  setNewSlot((prev) => ({ ...prev, title: event.target.value }))
                }
                placeholder="Export readiness workshop"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="slot-type">Type</Label>
              <select
                id="slot-type"
                className="h-9 rounded-lg border bg-background px-3 text-sm"
                value={newSlot.type}
                onChange={(event) =>
                  setNewSlot((prev) => ({
                    ...prev,
                    type: event.target.value as SlotType,
                  }))
                }
              >
                {SLOT_TYPES.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="slot-day">Day</Label>
              <select
                id="slot-day"
                className="h-9 rounded-lg border bg-background px-3 text-sm"
                value={newSlot.day}
                onChange={(event) =>
                  setNewSlot((prev) => ({
                    ...prev,
                    day: event.target.value as (typeof WEEKDAYS)[number],
                  }))
                }
              >
                {WEEKDAYS.map((day) => (
                  <option key={day} value={day}>
                    {day}
                  </option>
                ))}
              </select>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="grid gap-2">
                <Label htmlFor="slot-start">Start time</Label>
                <Input
                  id="slot-start"
                  type="time"
                  value={newSlot.startTime}
                  onChange={(event) =>
                    setNewSlot((prev) => ({
                      ...prev,
                      startTime: event.target.value,
                    }))
                  }
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="slot-end">End time</Label>
                <Input
                  id="slot-end"
                  type="time"
                  value={newSlot.endTime}
                  onChange={(event) =>
                    setNewSlot((prev) => ({
                      ...prev,
                      endTime: event.target.value,
                    }))
                  }
                />
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="slot-facilitator">Facilitator</Label>
              <select
                id="slot-facilitator"
                className="h-9 rounded-lg border bg-background px-3 text-sm"
                value={newSlot.facilitator}
                onChange={(event) =>
                  setNewSlot((prev) => ({
                    ...prev,
                    facilitator: event.target.value,
                  }))
                }
              >
                <option value="">Self-directed</option>
                {slotFacilitatorOptions.map((name) => (
                  <option key={name} value={name}>
                    {name}
                  </option>
                ))}
              </select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="slot-location">Location</Label>
              <select
                id="slot-location"
                className="h-9 rounded-lg border bg-background px-3 text-sm"
                value={newSlot.location}
                onChange={(event) =>
                  setNewSlot((prev) => ({
                    ...prev,
                    location: event.target.value as (typeof SLOT_LOCATIONS)[number],
                  }))
                }
              >
                {SLOT_LOCATIONS.map((location) => (
                  <option key={location} value={location}>
                    {location}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <SheetFooter className="border-t">
            <Button variant="outline" onClick={() => setSlotOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddSlot}>Add slot</Button>
          </SheetFooter>
        </SheetContent>
      </Sheet>
    </div>
  )
}