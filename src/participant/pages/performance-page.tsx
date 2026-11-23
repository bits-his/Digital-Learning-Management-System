import { Link } from "react-router-dom"

import { Button } from "@/components/ui/button"
import { useAuth } from "@/shared/auth/auth-context"
import {
  getAssignmentById,
  getParticipantPerformance,
  getParticipantQuizAttempts,
  getParticipantSubmissions,
  getQuizById,
} from "@/shared/data/mock-assessment"
import { JourneyRail } from "@/shared/components/journey-rail"
import { NextMove, SectionLabel } from "@/shared/components/next-move"
import { PageIntro } from "@/shared/components/page-intro"
import {
  ChartPanel,
  CompetencyBarChart,
  CompetencyRadarChart,
  CompletionStackedChart,
} from "@/shared/components/performance-charts"
import {
  StatusLabel,
  WorkList,
  WorkRow,
} from "@/shared/components/work-row"

export function ParticipantPerformancePage() {
  const { user } = useAuth()
  const participantId = user?.id ?? "participant-1"
  const performance = getParticipantPerformance(participantId)
  const submissions = getParticipantSubmissions(participantId)
  const attempts = getParticipantQuizAttempts(participantId)

  if (!performance) {
    return (
      <div className="flex flex-col gap-4">
        <PageIntro
          title="Performance not ready yet"
          description="Once you submit assessments, this page becomes your evidence board."
        />
        <NextMove
          title="Start with an assignment"
          detail="Submit your first piece of work to unlock scored feedback here."
          cta="Go to assignments"
          to="/participant/assignments"
        />
      </div>
    )
  }

  const weak = performance.competencies
    .filter((item) => item.score < item.target)
    .sort((a, b) => a.score - b.score)[0]

  return (
    <div className="flex flex-col gap-8">
      <PageIntro
        eyebrow="Your evidence board"
        title={`Overall ${performance.overallScore} — with a clear denominator`}
        description={`${performance.organization} · ${performance.cohort}. Scores only mean something when you can see what’s behind them.`}
      />

      <JourneyRail
        steps={[
          { id: "submit", label: "Submit work", state: "done" },
          { id: "grade", label: "Get graded", state: "current" },
          {
            id: "competency",
            label: "Build competency",
            state: weak ? "current" : "done",
          },
          {
            id: "ready",
            label: "Readiness proof",
            state: performance.overallScore >= 80 ? "done" : "upcoming",
          },
        ]}
      />

      {weak ? (
        <NextMove
          label="Focus area"
          title={`Lift “${weak.area}” from ${weak.score} toward ${weak.target}`}
          detail="Your lowest competency vs target. Mentorship sessions and the next assignment should push this number."
          cta="Talk it through with mentor"
          to="/participant/mentorship"
          tone="attention"
        />
      ) : (
        <NextMove
          label="On track"
          title="Every competency meets its target"
          detail="Keep submitting on time so this record stays investor-ready."
          cta="Continue assignments"
          to="/participant/assignments"
        />
      )}

      <div className="grid gap-4 xl:grid-cols-2">
        <ChartPanel
          title="Competency radar"
          description="Your score (filled) against programme targets (dashed)."
        >
          <CompetencyRadarChart competencies={performance.competencies} />
        </ChartPanel>
        <ChartPanel
          title="Score vs target"
          description="Side-by-side bars make gaps obvious at a glance."
        >
          <CompetencyBarChart competencies={performance.competencies} />
        </ChartPanel>
      </div>

      <ChartPanel
        title="Assessment completion"
        description={`${performance.assignmentsCompleted} of ${performance.assignmentsTotal} assignments · ${performance.quizzesCompleted} of ${performance.quizzesTotal} quizzes`}
      >
        <CompletionStackedChart
          assignmentsCompleted={performance.assignmentsCompleted}
          assignmentsTotal={performance.assignmentsTotal}
          quizzesCompleted={performance.quizzesCompleted}
          quizzesTotal={performance.quizzesTotal}
        />
      </ChartPanel>

      <div className="space-y-3">
        <div className="flex items-center justify-between gap-3">
          <SectionLabel>Recent grades & feedback</SectionLabel>
          <Button asChild variant="outline" size="sm">
            <Link to="/participant/assignments">Open assignments</Link>
          </Button>
        </div>
        <WorkList>
          {submissions
            .filter((item) => item.status === "Graded")
            .map((item) => (
              <WorkRow
                key={item.id}
                title={
                  getAssignmentById(item.assignmentId)?.title ?? "Assignment"
                }
                meta={item.feedback}
                status={
                  <StatusLabel tone="success">{item.score}/100</StatusLabel>
                }
              />
            ))}
          {attempts
            .filter((item) => item.status === "Graded")
            .map((item) => (
              <WorkRow
                key={item.id}
                title={getQuizById(item.quizId)?.title ?? "Quiz"}
                meta={`Completed ${item.answeredAt}`}
                status={
                  <StatusLabel tone="primary">{item.score}%</StatusLabel>
                }
              />
            ))}
        </WorkList>
      </div>
    </div>
  )
}
