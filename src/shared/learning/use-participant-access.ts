import * as React from "react"

import { useAuth } from "@/shared/auth/auth-context"
import { useEnrolment } from "@/shared/enrolment/enrolment-context"
import { useLearning } from "@/shared/learning/learning-context"

/** Resolves the logged-in participant against enrolment + course access. */
export function useParticipantAccess() {
  const { user } = useAuth()
  const { candidates, cohorts, timetable } = useEnrolment()
  const { coursesForCohort } = useLearning()

  const candidate = React.useMemo(
    () =>
      candidates.find(
        (item) =>
          item.email.toLowerCase() === (user?.email ?? "").toLowerCase()
      ) ?? null,
    [candidates, user?.email]
  )

  const cohort = React.useMemo(
    () =>
      cohorts.find((item) => item.id === candidate?.cohortId) ?? null,
    [cohorts, candidate?.cohortId]
  )

  const courses = React.useMemo(
    () => coursesForCohort(candidate?.cohortId),
    [coursesForCohort, candidate?.cohortId]
  )

  const publishedSlots = React.useMemo(() => {
    if (!candidate?.cohortId || !cohort?.timetablePublished) return []
    return timetable
      .filter((slot) => slot.cohortId === candidate.cohortId)
      .sort((a, b) => a.day.localeCompare(b.day) || a.time.localeCompare(b.time))
  }, [candidate?.cohortId, cohort?.timetablePublished, timetable])

  const onboarded = candidate?.onboarding === "Complete"
  const activated = candidate?.accountStatus === "Activated"

  return {
    user,
    candidate,
    cohort,
    courses,
    publishedSlots,
    onboarded,
    activated,
    hasCohort: Boolean(candidate?.cohortId),
  }
}
