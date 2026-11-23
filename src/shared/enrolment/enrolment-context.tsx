import * as React from "react"

import {
  initialCandidates,
  initialCohorts,
  initialTimetable,
  type Cohort,
  type EnrolmentCandidate,
  type Facilitator,
  type TimetableSlot,
} from "@/shared/data/mock-enrolment"

type EnrolmentContextValue = {
  candidates: EnrolmentCandidate[]
  cohorts: Cohort[]
  timetable: TimetableSlot[]
  allocate: (candidateIds: string[], cohortId: string) => {
    ok: boolean
    message: string
  }
  unallocate: (candidateIds: string[]) => void
  invite: (candidateIds: string[]) => void
  activate: (candidateIds: string[]) => void
  resendInvite: (candidateId: string) => void
  markOnboarding: (
    candidateId: string,
    status: EnrolmentCandidate["onboarding"]
  ) => void
  createCohort: (input: {
    name: string
    capacity: number
    startDate: string
    endDate: string
    description: string
  }) => Cohort
  updateCohort: (cohortId: string, patch: Partial<Cohort>) => void
  addFacilitator: (
    cohortId: string,
    facilitator: Facilitator
  ) => { ok: boolean; message: string }
  removeFacilitator: (cohortId: string, facilitatorId: string) => void
  publishTimetable: (cohortId: string) => void
  addTimetableSlot: (
    slot: Omit<TimetableSlot, "id">
  ) => TimetableSlot
  removeTimetableSlot: (slotId: string) => void
  cohortMembers: (cohortId: string) => EnrolmentCandidate[]
  cohortOccupancy: (cohortId: string) => {
    enrolled: number
    capacity: number
    remaining: number
  }
  stats: {
    selected: number
    activated: number
    allocated: number
    onboarded: number
    awaitingAllocation: number
    awaitingInvite: number
  }
}

const EnrolmentContext = React.createContext<EnrolmentContextValue | null>(null)

export function EnrolmentProvider({ children }: { children: React.ReactNode }) {
  const [candidates, setCandidates] =
    React.useState<EnrolmentCandidate[]>(initialCandidates)
  const [cohorts, setCohorts] = React.useState<Cohort[]>(initialCohorts)
  const [timetable, setTimetable] =
    React.useState<TimetableSlot[]>(initialTimetable)

  const cohortMembers = React.useCallback(
    (cohortId: string) =>
      candidates.filter((candidate) => candidate.cohortId === cohortId),
    [candidates]
  )

  const cohortOccupancy = React.useCallback(
    (cohortId: string) => {
      const cohort = cohorts.find((item) => item.id === cohortId)
      const enrolled = candidates.filter(
        (candidate) => candidate.cohortId === cohortId
      ).length
      const capacity = cohort?.capacity ?? 0
      return {
        enrolled,
        capacity,
        remaining: Math.max(capacity - enrolled, 0),
      }
    },
    [candidates, cohorts]
  )

  const allocate = React.useCallback(
    (candidateIds: string[], cohortId: string) => {
      const cohort = cohorts.find((item) => item.id === cohortId)
      if (!cohort) {
        return { ok: false, message: "Cohort not found." }
      }

      const { remaining } = cohortOccupancy(cohortId)
      const currentlyInOther = candidates.filter(
        (candidate) =>
          candidateIds.includes(candidate.id) &&
          candidate.cohortId !== cohortId
      ).length

      if (currentlyInOther > remaining) {
        return {
          ok: false,
          message: `${cohort.name} only has ${remaining} seat${remaining === 1 ? "" : "s"} remaining.`,
        }
      }

      setCandidates((prev) =>
        prev.map((candidate) =>
          candidateIds.includes(candidate.id)
            ? { ...candidate, cohortId }
            : candidate
        )
      )

      return {
        ok: true,
        message: `Allocated ${candidateIds.length} participant${candidateIds.length === 1 ? "" : "s"} to ${cohort.name}.`,
      }
    },
    [candidates, cohortOccupancy, cohorts]
  )

  const unallocate = React.useCallback((candidateIds: string[]) => {
    setCandidates((prev) =>
      prev.map((candidate) =>
        candidateIds.includes(candidate.id)
          ? {
              ...candidate,
              cohortId: null,
              accountStatus:
                candidate.accountStatus === "Activated"
                  ? candidate.accountStatus
                  : "Pending activation",
              onboarding:
                candidate.accountStatus === "Activated"
                  ? candidate.onboarding
                  : "Not started",
            }
          : candidate
      )
    )
  }, [])

  const invite = React.useCallback((candidateIds: string[]) => {
    setCandidates((prev) =>
      prev.map((candidate) => {
        if (!candidateIds.includes(candidate.id)) return candidate
        if (!candidate.cohortId) return candidate
        if (candidate.accountStatus === "Activated") return candidate
        return { ...candidate, accountStatus: "Invited" }
      })
    )
  }, [])

  const activate = React.useCallback((candidateIds: string[]) => {
    setCandidates((prev) =>
      prev.map((candidate) => {
        if (!candidateIds.includes(candidate.id)) return candidate
        if (!candidate.cohortId) return candidate
        return {
          ...candidate,
          accountStatus: "Activated",
          onboarding:
            candidate.onboarding === "Complete"
              ? "Complete"
              : "In progress",
        }
      })
    )
  }, [])

  const resendInvite = React.useCallback((candidateId: string) => {
    setCandidates((prev) =>
      prev.map((candidate) =>
        candidate.id === candidateId && candidate.accountStatus === "Invited"
          ? { ...candidate }
          : candidate
      )
    )
  }, [])

  const markOnboarding = React.useCallback(
    (candidateId: string, status: EnrolmentCandidate["onboarding"]) => {
      setCandidates((prev) =>
        prev.map((candidate) =>
          candidate.id === candidateId
            ? { ...candidate, onboarding: status }
            : candidate
        )
      )
    },
    []
  )

  const createCohort = React.useCallback(
    (input: {
      name: string
      capacity: number
      startDate: string
      endDate: string
      description: string
    }) => {
      const cohort: Cohort = {
        id: `cohort-${Date.now()}`,
        name: input.name,
        capacity: input.capacity,
        startDate: input.startDate,
        endDate: input.endDate,
        description: input.description,
        status: "Planning",
        programme: "2027 Bootcamp",
        progress: 0,
        timetablePublished: false,
        facilitators: [],
      }
      setCohorts((prev) => [cohort, ...prev])
      return cohort
    },
    []
  )

  const updateCohort = React.useCallback(
    (cohortId: string, patch: Partial<Cohort>) => {
      setCohorts((prev) =>
        prev.map((cohort) =>
          cohort.id === cohortId ? { ...cohort, ...patch } : cohort
        )
      )
    },
    []
  )

  const addFacilitator = React.useCallback(
    (cohortId: string, facilitator: Facilitator) => {
      const cohort = cohorts.find((item) => item.id === cohortId)
      if (!cohort) {
        return { ok: false, message: "Cohort not found." }
      }
      if (cohort.facilitators.some((item) => item.id === facilitator.id)) {
        return {
          ok: false,
          message: `${facilitator.name} is already on this cohort.`,
        }
      }
      setCohorts((prev) =>
        prev.map((item) =>
          item.id === cohortId
            ? {
                ...item,
                facilitators: [...item.facilitators, facilitator],
              }
            : item
        )
      )
      return {
        ok: true,
        message: `${facilitator.name} added to ${cohort.name}.`,
      }
    },
    [cohorts]
  )

  const removeFacilitator = React.useCallback(
    (cohortId: string, facilitatorId: string) => {
      setCohorts((prev) =>
        prev.map((cohort) =>
          cohort.id === cohortId
            ? {
                ...cohort,
                facilitators: cohort.facilitators.filter(
                  (item) => item.id !== facilitatorId
                ),
              }
            : cohort
        )
      )
    },
    []
  )

  const publishTimetable = React.useCallback((cohortId: string) => {
    setCohorts((prev) =>
      prev.map((cohort) =>
        cohort.id === cohortId
          ? { ...cohort, timetablePublished: true }
          : cohort
      )
    )
  }, [])

  const addTimetableSlot = React.useCallback(
    (slot: Omit<TimetableSlot, "id">) => {
      const created: TimetableSlot = {
        ...slot,
        id: `tt-${Date.now()}`,
      }
      setTimetable((prev) => [...prev, created])
      setCohorts((prev) =>
        prev.map((cohort) =>
          cohort.id === slot.cohortId
            ? { ...cohort, timetablePublished: false }
            : cohort
        )
      )
      return created
    },
    []
  )

  const removeTimetableSlot = React.useCallback((slotId: string) => {
    setTimetable((prev) => {
      const target = prev.find((slot) => slot.id === slotId)
      if (target) {
        setCohorts((cohortsPrev) =>
          cohortsPrev.map((cohort) =>
            cohort.id === target.cohortId
              ? { ...cohort, timetablePublished: false }
              : cohort
          )
        )
      }
      return prev.filter((slot) => slot.id !== slotId)
    })
  }, [])

  const stats = React.useMemo(() => {
    const selected = candidates.length
    const activated = candidates.filter(
      (candidate) => candidate.accountStatus === "Activated"
    ).length
    const allocated = candidates.filter(
      (candidate) => candidate.cohortId
    ).length
    const onboarded = candidates.filter(
      (candidate) => candidate.onboarding === "Complete"
    ).length
    const awaitingAllocation = candidates.filter(
      (candidate) => !candidate.cohortId
    ).length
    const awaitingInvite = candidates.filter(
      (candidate) =>
        candidate.cohortId && candidate.accountStatus === "Pending activation"
    ).length

    return {
      selected,
      activated,
      allocated,
      onboarded,
      awaitingAllocation,
      awaitingInvite,
    }
  }, [candidates])

  const value = React.useMemo(
    () => ({
      candidates,
      cohorts,
      timetable,
      allocate,
      unallocate,
      invite,
      activate,
      resendInvite,
      markOnboarding,
      createCohort,
      updateCohort,
      addFacilitator,
      removeFacilitator,
      publishTimetable,
      addTimetableSlot,
      removeTimetableSlot,
      cohortMembers,
      cohortOccupancy,
      stats,
    }),
    [
      activate,
      addFacilitator,
      addTimetableSlot,
      allocate,
      candidates,
      cohortMembers,
      cohortOccupancy,
      cohorts,
      createCohort,
      invite,
      markOnboarding,
      publishTimetable,
      removeFacilitator,
      removeTimetableSlot,
      resendInvite,
      stats,
      timetable,
      unallocate,
      updateCohort,
    ]
  )

  return (
    <EnrolmentContext.Provider value={value}>
      {children}
    </EnrolmentContext.Provider>
  )
}

export function useEnrolment() {
  const context = React.useContext(EnrolmentContext)
  if (!context) {
    throw new Error("useEnrolment must be used within EnrolmentProvider")
  }
  return context
}
