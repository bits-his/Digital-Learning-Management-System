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
import { participantCourses } from "@/shared/data/mock-participant"
import { JourneyRail } from "@/shared/components/journey-rail"
import { NextMove, SectionLabel } from "@/shared/components/next-move"
import { PageIntro } from "@/shared/components/page-intro"
import {
  HonestProgress,
  StatusLabel,
  WorkList,
  WorkRow,
} from "@/shared/components/work-row"

export function ParticipantDashboardPage() {
  const { user } = useAuth()
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
  const courseInProgress = participantCourses.find(
    (course) => course.status === "In progress"
  )

  return (
    <div className="flex flex-col gap-8">
      <PageIntro
        eyebrow={`Hello, ${user?.name.split(" ")[0]}`}
        title="Today is about one clear next step"
        description="Ignore the noise. This hub answers: what should I do now, what’s due, and how am I tracking?"
      />

      <JourneyRail
        steps={[
          { id: "learn", label: "Learn", state: "done" },
          {
            id: "assess",
            label: "Assess",
            state: nextAssignment ? "current" : "done",
          },
          {
            id: "mentor",
            label: "Mentor",
            state: nextSession ? "current" : mentor ? "upcoming" : "upcoming",
          },
          {
            id: "ready",
            label: "Ready",
            state:
              (performance?.overallScore ?? 0) >= 80 ? "done" : "upcoming",
          },
        ]}
      />

      {nextAssignment ? (
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
          <SectionLabel>Learning in motion</SectionLabel>
          <WorkList>
            {participantCourses.slice(0, 3).map((course) => (
              <WorkRow
                key={course.title}
                title={course.title}
                meta={`${course.progress}% of modules`}
                status={
                  <StatusLabel
                    tone={
                      course.status === "Completed" ? "success" : "primary"
                    }
                  >
                    {course.status}
                  </StatusLabel>
                }
              >
                <HonestProgress label="Module progress" percent={course.progress} />
              </WorkRow>
            ))}
          </WorkList>
          <Button asChild variant="outline" size="sm" className="w-fit">
            <Link to="/participant/courses">All courses</Link>
          </Button>
        </div>

        <div className="space-y-4 rounded-xl border border-foreground/10 bg-card/70 p-5 backdrop-blur-sm">
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
          <div className="flex flex-wrap gap-2">
            <Button asChild size="sm">
              <Link to="/participant/performance">Performance</Link>
            </Button>
            <Button asChild size="sm" variant="outline">
              <Link to="/participant/mentorship">Mentorship</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
