import { useMemo, useRef, useState } from "react"
import { Link } from "react-router-dom"
import { toast } from "sonner"
import {
  CheckCircle2Icon,
  MailIcon,
  SearchIcon,
  UserPlusIcon,
  UserRoundIcon,
  UsersIcon,
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
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"
import {
  initials,
  nextEnrolmentAction,
  type EnrolmentCandidate,
} from "@/shared/data/mock-enrolment"
import { useEnrolment } from "@/shared/enrolment/enrolment-context"

type PipelineFilter =
  | "all"
  | "unallocated"
  | "invite"
  | "invited"
  | "activated"
  | "onboarding"

const filterLabels: Record<PipelineFilter, string> = {
  all: "All",
  unallocated: "Needs cohort",
  invite: "Ready to invite",
  invited: "Invited",
  activated: "Activated",
  onboarding: "Onboarding",
}

function matchesFilter(
  candidate: EnrolmentCandidate,
  filter: PipelineFilter
) {
  switch (filter) {
    case "unallocated":
      return !candidate.cohortId
    case "invite":
      return (
        Boolean(candidate.cohortId) &&
        candidate.accountStatus === "Pending activation"
      )
    case "invited":
      return candidate.accountStatus === "Invited"
    case "activated":
      return candidate.accountStatus === "Activated"
    case "onboarding":
      return (
        candidate.accountStatus === "Activated" &&
        candidate.onboarding !== "Complete"
      )
    default:
      return true
  }
}

function statusBadgeVariant(
  status: EnrolmentCandidate["accountStatus"]
): "default" | "secondary" | "outline" {
  if (status === "Activated") return "default"
  if (status === "Invited") return "secondary"
  return "outline"
}

function actionLabel(candidate: EnrolmentCandidate) {
  const action = nextEnrolmentAction(candidate)
  if (action === "allocate") return "Allocate"
  if (action === "invite") return "Invite"
  if (action === "activate") return "Activate"
  if (action === "onboarding") return "Complete onboarding"
  return "View"
}

export function AdminEnrolmentPage() {
  const {
    candidates,
    cohorts,
    allocate,
    invite,
    activate,
    resendInvite,
    markOnboarding,
    unallocate,
    cohortOccupancy,
    stats,
  } = useEnrolment()

  const [query, setQuery] = useState("")
  const [filter, setFilter] = useState<PipelineFilter>("all")
  const [selected, setSelected] = useState<string[]>([])
  const [bulkCohortId, setBulkCohortId] = useState("")
  const [activeId, setActiveId] = useState<string | null>(null)
  const [mobileSelecting, setMobileSelecting] = useState(false)
  const lastClickedIndex = useRef<number | null>(null)
  const longPressTimer = useRef<number | null>(null)

  const activeCohorts = cohorts.filter((cohort) => cohort.status !== "Alumni")
  const active = candidates.find((candidate) => candidate.id === activeId)
  const selectionMode = selected.length > 0 || mobileSelecting

  const filtered = useMemo(() => {
    const needle = query.trim().toLowerCase()
    return candidates.filter((candidate) => {
      if (!matchesFilter(candidate, filter)) return false
      if (!needle) return true
      return [
        candidate.name,
        candidate.business,
        candidate.country,
        candidate.sector,
        candidate.email,
        candidate.applicationId,
      ]
        .join(" ")
        .toLowerCase()
        .includes(needle)
    })
  }, [candidates, filter, query])

  const filterCounts = useMemo(() => {
    const counts = {} as Record<PipelineFilter, number>
    ;(Object.keys(filterLabels) as PipelineFilter[]).forEach((key) => {
      counts[key] =
        key === "all"
          ? candidates.length
          : candidates.filter((candidate) => matchesFilter(candidate, key))
              .length
    })
    return counts
  }, [candidates])

  function clearSelection() {
    setSelected([])
    setMobileSelecting(false)
    setBulkCohortId("")
    lastClickedIndex.current = null
  }

  function toggleSelected(id: string) {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    )
  }

  function selectAtIndex(index: number, options?: { range?: boolean }) {
    const id = filtered[index]?.id
    if (!id) return

    if (options?.range && lastClickedIndex.current !== null) {
      const start = Math.min(lastClickedIndex.current, index)
      const end = Math.max(lastClickedIndex.current, index)
      const rangeIds = filtered.slice(start, end + 1).map((item) => item.id)
      setSelected((prev) => [...new Set([...prev, ...rangeIds])])
      lastClickedIndex.current = index
      return
    }

    toggleSelected(id)
    lastClickedIndex.current = index
  }

  function handleDesktopRowClick(
    index: number,
    event: React.MouseEvent<HTMLTableRowElement>
  ) {
    const target = event.target as HTMLElement
    if (target.closest("button, a, input, label, [data-no-row-select]")) {
      return
    }
    selectAtIndex(index, { range: event.shiftKey })
  }

  function startMobileSelect(id: string, index: number) {
    setMobileSelecting(true)
    setSelected((prev) => (prev.includes(id) ? prev : [...prev, id]))
    lastClickedIndex.current = index
  }

  function handleMobileCardPress(id: string, index: number) {
    if (selectionMode) {
      selectAtIndex(index)
      return
    }
    setActiveId(id)
  }

  function toggleSelectAllVisible() {
    const visibleIds = filtered.map((candidate) => candidate.id)
    const allSelected = visibleIds.every((id) => selected.includes(id))
    if (allSelected) {
      setSelected((prev) => prev.filter((id) => !visibleIds.includes(id)))
      if (selected.length <= visibleIds.length) {
        setMobileSelecting(false)
      }
      return
    }
    setSelected((prev) => [...new Set([...prev, ...visibleIds])])
    setMobileSelecting(true)
  }

  function runAllocate(ids: string[], cohortId: string) {
    if (!cohortId) {
      toast.error("Choose a cohort first")
      return
    }
    const result = allocate(ids, cohortId)
    if (!result.ok) {
      toast.error(result.message)
      return
    }
    toast.success(result.message)
    clearSelection()
  }

  function runInvite(ids: string[]) {
    const eligible = candidates.filter(
      (candidate) =>
        ids.includes(candidate.id) &&
        candidate.cohortId &&
        candidate.accountStatus === "Pending activation"
    )
    if (!eligible.length) {
      toast.error("Allocate a cohort before sending invites")
      return
    }
    invite(eligible.map((candidate) => candidate.id))
    toast.success(
      `Invite sent to ${eligible.length} participant${eligible.length === 1 ? "" : "s"}`
    )
    clearSelection()
  }

  function runActivate(ids: string[]) {
    const eligible = candidates.filter(
      (candidate) =>
        ids.includes(candidate.id) &&
        candidate.cohortId &&
        candidate.accountStatus !== "Activated"
    )
    if (!eligible.length) {
      toast.error("Nothing to activate — allocate and invite first")
      return
    }
    activate(eligible.map((candidate) => candidate.id))
    toast.success(
      `Activated ${eligible.length} account${eligible.length === 1 ? "" : "s"}`
    )
    clearSelection()
  }

  function runPrimary(candidate: EnrolmentCandidate) {
    const action = nextEnrolmentAction(candidate)
    if (action === "allocate" || action === "ready") {
      setActiveId(candidate.id)
      return
    }
    if (action === "invite") {
      runInvite([candidate.id])
      return
    }
    if (action === "activate") {
      runActivate([candidate.id])
      return
    }
    markOnboarding(candidate.id, "Complete")
    toast.success(`${candidate.name} marked as onboarded`)
  }

  const summaryCards = [
    {
      label: "Selected",
      value: stats.selected,
      hint: "Applicants ready to enrol",
      icon: UsersIcon,
      iconBg: "bg-primary text-primary-foreground",
      wash: "bg-primary/8",
    },
    {
      label: "Allocated",
      value: stats.allocated,
      hint: `${stats.awaitingAllocation} waiting for a cohort`,
      icon: UserPlusIcon,
      iconBg: "bg-foreground text-background",
      wash: "bg-foreground/[0.04]",
    },
    {
      label: "Activated",
      value: stats.activated,
      hint: `${stats.awaitingInvite} ready to invite`,
      icon: CheckCircle2Icon,
      iconBg: "bg-primary text-primary-foreground",
      wash: "bg-primary/8",
    },
    {
      label: "Onboarded",
      value: stats.onboarded,
      hint: "Learning access unlocked",
      icon: MailIcon,
      iconBg: "bg-foreground text-background",
      wash: "bg-foreground/[0.04]",
    },
  ]

  const allVisibleSelected =
    filtered.length > 0 &&
    filtered.every((candidate) => selected.includes(candidate.id))

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="font-heading text-2xl font-semibold tracking-tight">
          Enrolment
        </h1>
        <p className="text-sm text-muted-foreground">
          Allocate cohorts and activate participant accounts.
        </p>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {summaryCards.map((stat) => (
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

      <div className="overflow-hidden rounded-2xl border bg-card">
        <div className="flex flex-col gap-3 border-b p-4">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
            <div className="relative w-full max-w-sm">
              <SearchIcon className="pointer-events-none absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search applicants…"
                className="pl-8"
              />
            </div>

            <div className="flex flex-wrap gap-1.5">
              {(Object.keys(filterLabels) as PipelineFilter[]).map((key) => {
                const activeFilter = filter === key
                return (
                  <button
                    key={key}
                    type="button"
                    onClick={() => setFilter(key)}
                    className={`inline-flex h-8 items-center gap-1.5 rounded-full border px-3 text-xs font-medium transition-colors ${
                      activeFilter
                        ? "border-primary bg-primary text-primary-foreground"
                        : "border-border bg-background text-muted-foreground hover:bg-muted hover:text-foreground"
                    }`}
                  >
                    {filterLabels[key]}
                    <span
                      className={`rounded-full px-1.5 py-0.5 text-[10px] ${
                        activeFilter
                          ? "bg-primary-foreground/20 text-primary-foreground"
                          : "bg-muted text-muted-foreground"
                      }`}
                    >
                      {filterCounts[key]}
                    </span>
                  </button>
                )
              })}
            </div>
          </div>
        </div>

        {selectionMode ? (
          <div className="sticky top-14 z-10 flex flex-col gap-3 border-b bg-primary/5 px-4 py-3 backdrop-blur-sm sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={clearSelection}
                className="rounded-full border border-primary/20 bg-background px-3 py-1 text-xs font-medium text-primary hover:bg-primary/10"
              >
                {selected.length} selected · Done
              </button>
              <button
                type="button"
                onClick={toggleSelectAllVisible}
                className="text-xs text-muted-foreground hover:text-foreground"
              >
                {allVisibleSelected ? "Deselect all" : "Select all"}
              </button>
              <p className="hidden text-xs text-muted-foreground lg:block">
                Click a row to toggle · Shift+click for a range
              </p>
            </div>

            <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
              <div className="flex items-center gap-2">
                <select
                  className="h-8 min-w-[180px] rounded-lg border bg-background px-2 text-sm"
                  value={bulkCohortId}
                  onChange={(event) => setBulkCohortId(event.target.value)}
                >
                  <option value="">Choose cohort…</option>
                  {activeCohorts.map((cohort) => {
                    const occupancy = cohortOccupancy(cohort.id)
                    return (
                      <option key={cohort.id} value={cohort.id}>
                        {cohort.name} ({occupancy.enrolled}/{occupancy.capacity})
                      </option>
                    )
                  })}
                </select>
                <Button
                  size="sm"
                  variant="outline"
                  disabled={!selected.length || !bulkCohortId}
                  onClick={() => runAllocate(selected, bulkCohortId)}
                >
                  <UserPlusIcon data-icon="inline-start" />
                  Assign
                </Button>
              </div>
              <div className="hidden h-5 w-px bg-border sm:block" />
              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  disabled={!selected.length}
                  onClick={() => runInvite(selected)}
                >
                  <MailIcon data-icon="inline-start" />
                  Invite
                </Button>
                <Button
                  size="sm"
                  disabled={!selected.length}
                  onClick={() => runActivate(selected)}
                >
                  <CheckCircle2Icon data-icon="inline-start" />
                  Activate
                </Button>
              </div>
            </div>
          </div>
        ) : null}

        {filtered.length === 0 ? (
          <Empty className="border-0 py-14">
            <EmptyHeader>
              <EmptyMedia variant="icon">
                <UserRoundIcon />
              </EmptyMedia>
              <EmptyTitle>No applicants found</EmptyTitle>
              <EmptyDescription>
                Try another filter or clear your search.
              </EmptyDescription>
            </EmptyHeader>
          </Empty>
        ) : (
          <>
            {/* Desktop table */}
            <div className="hidden overflow-x-auto md:block">
              <table className="w-full min-w-[880px] text-left text-sm">
                <thead className="border-b bg-muted/30 text-xs text-muted-foreground">
                  <tr>
                    <th className="w-10 px-4 py-3 font-medium">
                      <input
                        type="checkbox"
                        className="size-4 accent-primary"
                        checked={allVisibleSelected}
                        onChange={toggleSelectAllVisible}
                        aria-label="Select all visible applicants"
                      />
                    </th>
                    <th className="px-3 py-3 font-medium">Applicant</th>
                    <th className="px-3 py-3 font-medium">Business</th>
                    <th className="px-3 py-3 font-medium">Score</th>
                    <th className="px-3 py-3 font-medium">Cohort</th>
                    <th className="px-3 py-3 font-medium">Account</th>
                    <th className="px-3 py-3 font-medium">Onboarding</th>
                    <th className="px-4 py-3 text-right font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((candidate, index) => {
                    const cohort = cohorts.find(
                      (item) => item.id === candidate.cohortId
                    )
                    const isSelected = selected.includes(candidate.id)
                    return (
                      <tr
                        key={candidate.id}
                        onClick={(event) => handleDesktopRowClick(index, event)}
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
                            onChange={() => selectAtIndex(index)}
                            onClick={(event) => event.stopPropagation()}
                            aria-label={`Select ${candidate.name}`}
                          />
                        </td>
                        <td className="px-3 py-3">
                          <div className="flex items-center gap-3">
                            <Avatar size="sm">
                              {candidate.avatar ? (
                                <AvatarImage
                                  src={candidate.avatar}
                                  alt={candidate.name}
                                />
                              ) : null}
                              <AvatarFallback>
                                {initials(candidate.name)}
                              </AvatarFallback>
                            </Avatar>
                            <div className="min-w-0">
                              <p className="truncate font-medium">
                                {candidate.name}
                              </p>
                              <p className="truncate text-xs text-muted-foreground">
                                {candidate.applicationId} · {candidate.country}
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="px-3 py-3">
                          <p className="font-medium">{candidate.business}</p>
                          <p className="text-xs text-muted-foreground">
                            {candidate.sector}
                          </p>
                        </td>
                        <td className="px-3 py-3 font-medium tabular-nums">
                          {candidate.score}
                        </td>
                        <td className="px-3 py-3 text-muted-foreground">
                          {cohort?.name ?? "—"}
                        </td>
                        <td className="px-3 py-3">
                          <Badge
                            variant={statusBadgeVariant(
                              candidate.accountStatus
                            )}
                          >
                            {candidate.accountStatus}
                          </Badge>
                        </td>
                        <td className="px-3 py-3">
                          <Badge variant="outline">{candidate.onboarding}</Badge>
                        </td>
                        <td className="px-4 py-3" data-no-row-select>
                          <div className="flex justify-end gap-2">
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={(event) => {
                                event.stopPropagation()
                                setActiveId(candidate.id)
                              }}
                            >
                              Details
                            </Button>
                            <Button
                              size="sm"
                              onClick={(event) => {
                                event.stopPropagation()
                                runPrimary(candidate)
                              }}
                            >
                              {actionLabel(candidate)}
                            </Button>
                          </div>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>

            {/* Mobile cards */}
            <div className="flex flex-col divide-y md:hidden">
              {!selectionMode ? (
                <p className="bg-muted/20 px-4 py-2 text-xs text-muted-foreground">
                  Tap a card for details · Long-press to multi-select
                </p>
              ) : null}
              {filtered.map((candidate, index) => {
                const cohort = cohorts.find(
                  (item) => item.id === candidate.cohortId
                )
                const isSelected = selected.includes(candidate.id)
                return (
                  <div
                    key={candidate.id}
                    className={`flex flex-col gap-3 p-4 transition-colors ${
                      isSelected ? "bg-primary/5" : ""
                    }`}
                    onClick={() => handleMobileCardPress(candidate.id, index)}
                    onContextMenu={(event) => {
                      event.preventDefault()
                      startMobileSelect(candidate.id, index)
                    }}
                    onTouchStart={() => {
                      longPressTimer.current = window.setTimeout(() => {
                        startMobileSelect(candidate.id, index)
                      }, 450)
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
                          onChange={() => selectAtIndex(index)}
                          onClick={(event) => event.stopPropagation()}
                          aria-label={`Select ${candidate.name}`}
                        />
                      ) : null}
                      <Avatar>
                        {candidate.avatar ? (
                          <AvatarImage
                            src={candidate.avatar}
                            alt={candidate.name}
                          />
                        ) : null}
                        <AvatarFallback>
                          {initials(candidate.name)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="min-w-0 flex-1">
                        <p className="truncate font-medium">{candidate.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {candidate.business}
                        </p>
                        <p className="mt-1 text-xs text-muted-foreground">
                          {candidate.applicationId} · Score {candidate.score} ·{" "}
                          {cohort?.name ?? "No cohort"}
                        </p>
                        <div className="mt-2 flex flex-wrap gap-1.5">
                          <Badge
                            variant={statusBadgeVariant(
                              candidate.accountStatus
                            )}
                          >
                            {candidate.accountStatus}
                          </Badge>
                          <Badge variant="outline">
                            {candidate.onboarding}
                          </Badge>
                        </div>
                      </div>
                    </div>
                    {!selectionMode ? (
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          className="flex-1"
                          onClick={(event) => {
                            event.stopPropagation()
                            setActiveId(candidate.id)
                          }}
                        >
                          Details
                        </Button>
                        <Button
                          size="sm"
                          className="flex-1"
                          onClick={(event) => {
                            event.stopPropagation()
                            runPrimary(candidate)
                          }}
                        >
                          {actionLabel(candidate)}
                        </Button>
                      </div>
                    ) : null}
                  </div>
                )
              })}
            </div>
          </>
        )}
      </div>

      <Sheet
        open={Boolean(active)}
        onOpenChange={(open) => {
          if (!open) setActiveId(null)
        }}
      >
        <SheetContent
          side="right"
          className="w-full sm:max-w-lg"
          showCloseButton
        >
          {active ? (
            <>
              <SheetHeader className="border-b">
                <div className="flex items-center gap-3 pr-8">
                  <Avatar size="lg">
                    {active.avatar ? (
                      <AvatarImage src={active.avatar} alt={active.name} />
                    ) : null}
                    <AvatarFallback>{initials(active.name)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <SheetTitle className="text-lg">{active.name}</SheetTitle>
                    <SheetDescription>
                      {active.business} · {active.applicationId}
                    </SheetDescription>
                  </div>
                </div>
              </SheetHeader>

              <div className="flex flex-1 flex-col gap-5 overflow-y-auto px-4 py-2">
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <p className="text-muted-foreground">Country</p>
                    <p className="font-medium">{active.country}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Sector</p>
                    <p className="font-medium">{active.sector}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Score</p>
                    <p className="font-medium">{active.score}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Account</p>
                    <p className="font-medium">{active.accountStatus}</p>
                  </div>
                  <div className="col-span-2">
                    <p className="text-muted-foreground">Email</p>
                    <p className="font-medium">{active.email}</p>
                  </div>
                  {active.phone ? (
                    <div className="col-span-2">
                      <p className="text-muted-foreground">Phone</p>
                      <p className="font-medium">{active.phone}</p>
                    </div>
                  ) : null}
                  {active.notes ? (
                    <div className="col-span-2 rounded-lg border bg-muted/40 p-3">
                      <p className="text-xs text-muted-foreground">Notes</p>
                      <p className="mt-1 text-sm">{active.notes}</p>
                    </div>
                  ) : null}
                </div>

                <div className="flex flex-col gap-2">
                  <Label htmlFor="detail-cohort">Cohort</Label>
                  <select
                    id="detail-cohort"
                    className="h-9 rounded-lg border bg-background px-3 text-sm"
                    value={active.cohortId ?? ""}
                    onChange={(event) => {
                      const value = event.target.value
                      if (!value) {
                        unallocate([active.id])
                        toast.message("Removed from cohort")
                        return
                      }
                      runAllocate([active.id], value)
                    }}
                  >
                    <option value="">Unallocated</option>
                    {activeCohorts.map((cohort) => {
                      const occupancy = cohortOccupancy(cohort.id)
                      return (
                        <option key={cohort.id} value={cohort.id}>
                          {cohort.name} — {occupancy.enrolled}/
                          {occupancy.capacity} seats
                        </option>
                      )
                    })}
                  </select>
                </div>

                <div className="rounded-xl border p-3">
                  <p className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
                    Progress
                  </p>
                  <ol className="mt-3 space-y-2 text-sm">
                    {[
                      {
                        label: "Allocate cohort",
                        done: Boolean(active.cohortId),
                      },
                      {
                        label: "Send activation invite",
                        done:
                          active.accountStatus === "Invited" ||
                          active.accountStatus === "Activated",
                      },
                      {
                        label: "Activate account",
                        done: active.accountStatus === "Activated",
                      },
                      {
                        label: "Complete onboarding",
                        done: active.onboarding === "Complete",
                      },
                    ].map((step) => (
                      <li
                        key={step.label}
                        className="flex items-center gap-2"
                      >
                        <CheckCircle2Icon
                          className={`size-4 ${
                            step.done
                              ? "text-primary"
                              : "text-muted-foreground/40"
                          }`}
                        />
                        <span
                          className={
                            step.done
                              ? "text-foreground"
                              : "text-muted-foreground"
                          }
                        >
                          {step.label}
                        </span>
                      </li>
                    ))}
                  </ol>
                </div>
              </div>

              <SheetFooter className="border-t">
                {active.accountStatus === "Pending activation" ? (
                  <Button
                    disabled={!active.cohortId}
                    onClick={() => runInvite([active.id])}
                  >
                    Send invite
                  </Button>
                ) : null}
                {active.accountStatus === "Invited" ? (
                  <>
                    <Button
                      variant="outline"
                      onClick={() => {
                        resendInvite(active.id)
                        toast.success(`Invite resent to ${active.email}`)
                      }}
                    >
                      Resend invite
                    </Button>
                    <Button onClick={() => runActivate([active.id])}>
                      Activate account
                    </Button>
                  </>
                ) : null}
                {active.accountStatus === "Activated" &&
                active.onboarding !== "Complete" ? (
                  <Button
                    onClick={() => {
                      markOnboarding(active.id, "Complete")
                      toast.success("Onboarding marked complete")
                    }}
                  >
                    Mark onboarding complete
                  </Button>
                ) : null}
                {active.accountStatus === "Activated" &&
                active.onboarding === "Complete" ? (
                  <Button asChild variant="outline">
                    <Link to="/admin/cohorts">View in cohorts</Link>
                  </Button>
                ) : null}
              </SheetFooter>
            </>
          ) : null}
        </SheetContent>
      </Sheet>
    </div>
  )
}
