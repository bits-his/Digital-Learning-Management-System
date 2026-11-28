import { Link } from "react-router-dom"

import { Button } from "@/components/ui/button"
import { useAuth } from "@/shared/auth/auth-context"
import {
  getParticipantSubmissions,
  getParticipantPerformance,
} from "@/shared/data/mock-assessment"
import {
  getAllocationsForParticipant,
  getSessionsForParticipant,
} from "@/shared/data/mock-mentorship"
import { participantCourseStatus } from "@/shared/data/mock-learning"
import { JourneyRail } from "@/shared/components/journey-rail"
import { NextMove, SectionLabel } from "@/shared/components/next-move"
import { PageLayout } from "@/shared/components/page-layout"
import {
  HonestProgress,
  StatusLabel,
  WorkList,
  WorkRow,
} from "@/shared/components/work-row"
import { useParticipantAccess } from "@/shared/learning/use-participant-access"

export function ParticipantDashboardPage() {
  const { user } = useAuth()
  const { courses, publishedSlots, cohort, onboarded } = useParticipantAccess()
  const participantId = user?.id ?? "participant-1"
  const submissions = getParticipantSubmissions(participantId)
  const performance = getParticipantPerformance(participantId)
  const nextAssignment =
    submissions.find((item) => item.status === "In progress") ??
    submissions.find((item) => item.status === "Not started")
  const mentor = getAllocationsForParticipant(participantId)[0]
  const nextSession = getSessionsForParticipant(participantId).find(
    (item) => item.status === "Scheduled"
  )
  const courseInProgress =
    courses.find((course) => course.progress > 0 && course.progress < 100) ??
    courses[0]
  const nextSlot = publishedSlots[0]
  const firstName = user?.name.split(" ")[0] ?? "there"

  return (
    <PageLayout variant="bare">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-[0.65rem] font-medium tracking-[0.14em] text-primary uppercase">
            Hello, {firstName}
          </p>
          <h1 className="font-heading text-xl font-semibold tracking-tight md:text-2xl">
            One clear next step
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {cohort
              ? `${cohort.name} · what’s due and how you’re tracking`
              : "What’s due, what’s next, and how you’re tracking"}
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button asChild size="sm" variant="outline">
            <Link to="/participant/performance">Performance</Link>
          </Button>
          <Button asChild size="sm" variant="outline">
            <Link to="/participant/mentorship">Mentorship</Link>
          </Button>
        </div>
      </div>

      <JourneyRail
        steps={[
          {
            id: "learn",
            label: "Learn",
            state: onboarded && courses.length > 0 ? "done" : "current",
          },
          {
            id: "assess",
            label: "Assess",
            state: nextAssignment ? "current" : "done",
          },
          {
            id: "mentor",
            label: "Mentor",
            state: nextSession ? "current" : "upcoming",
          },
          {
            id: "ready",
            label: "Ready",
            state:
              (performance?.overallScore ?? 0) >= 80 ? "done" : "upcoming",
          },
        ]}
      />

      {!onboarded ? (
        <NextMove
          title="Finish onboarding to unlock learning"
          detail="Confirm your account, join your cohort, then open courses and the timetable."
          cta="Continue onboarding"
          to="/participant/onboarding"
          tone="attention"
        />
      ) : nextAssignment ? (
        <NextMove
          title="Finish your open assignment"
          detail="Evidence beats intention. Submit what’s in progress so facilitators can grade you."
          cta="Open assignments"
          to="/participant/assignments"
          tone="attention"
        />
      ) : nextSession ? (
        <NextMove
          title={`Prepare for: ${nextSession.focus}`}
          detail={`${nextSession.date} · ${nextSession.time} with ${nextSession.mentorName}`}
          cta="View mentorship"
          to="/participant/mentorship"
        />
      ) : nextSlot ? (
        <NextMove
          title={`Next session: ${nextSlot.title}`}
          detail={`${nextSlot.day} · ${nextSlot.time} · ${nextSlot.location}`}
          cta="Open timetable"
          to="/participant/timetable"
        />
      ) : (
        <NextMove
          title="Take a quick quiz while you’re warm"
          detail="Short checks lock learning into your performance record."
          cta="Open quizzes"
          to="/participant/quizzes"
        />
      )}

      <div className="grid gap-4 lg:grid-cols-[1.2fr_0.8fr]">
        <div className="space-y-3">
          <div className="flex items-center justify-between gap-3">
            <SectionLabel>Learning in motion</SectionLabel>
            <Button asChild variant="outline" size="sm">
              <Link to="/participant/courses">All courses</Link>
            </Button>
          </div>
          {courses.length === 0 ? (
            <p className="rounded-xl border border-dashed px-4 py-8 text-sm text-muted-foreground">
              No published courses for your cohort yet.
            </p>
          ) : (
            <WorkList>
              {courses.slice(0, 3).map((course) => {
                const status = participantCourseStatus(course.progress)
                return (
                  <WorkRow
                    key={course.id}
                    title={course.title}
                    meta={`${course.progress}% of modules`}
                    status={
                      <StatusLabel
                        tone={status === "Completed" ? "success" : "primary"}
                      >
                        {status}
                      </StatusLabel>
                    }
                  >
                    <HonestProgress
                      label="Module progress"
                      percent={course.progress}
                    />
                  </WorkRow>
                )
              })}
            </WorkList>
          )}
        </div>

        <div className="space-y-4 rounded-xl border border-foreground/10 bg-card/70 p-4">
          <SectionLabel>At a glance</SectionLabel>
          <HonestProgress
            label="Overall performance"
            percent={performance?.overallScore ?? 0}
          />
          <div className="space-y-2 text-sm">
            <p className="text-muted-foreground">
              Mentor:{" "}
              <span className="font-medium text-foreground">
                {mentor?.mentorName ?? "Not allocated yet"}
              </span>
            </p>
            <p className="text-muted-foreground">
              Focus course:{" "}
              <span className="font-medium text-foreground">
                {courseInProgress?.title ?? "None in progress"}
              </span>
            </p>
          </div>
        </div>
      </div>
    </PageLayout>
  )
}
