import { JourneyRail } from "@/shared/components/journey-rail"
import { NextMove, SectionLabel } from "@/shared/components/next-move"
import { PageLayout } from "@/shared/components/page-layout"
import {
  ChartPanel,
  CohortOverallBarChart,
  CompetencyBarChart,
} from "@/shared/components/performance-charts"
import {
  StatusLabel,
  WorkList,
  WorkRow,
} from "@/shared/components/work-row"
import { participantPerformance } from "@/shared/data/mock-assessment"

export function AdminPerformancePage() {
  const atRisk = [...participantPerformance]
    .map((row) => ({
      row,
      gap: row.competencies.filter((c) => c.score < c.target).length,
    }))
    .sort((a, b) => b.gap - a.gap || a.row.overallScore - b.row.overallScore)[0]

  return (
    <PageLayout variant="bare">
      

      <JourneyRail
        steps={[
          { id: "collect", label: "Collect scores", state: "done" },
          { id: "spot", label: "Spot gaps", state: "current" },
          { id: "mentor", label: "Brief mentors", state: "upcoming" },
          { id: "lift", label: "Lift outcomes", state: "upcoming" },
        ]}
      />

      {atRisk ? (
        <NextMove
          label="Needs attention"
          title={`${atRisk.row.participantName} · overall ${atRisk.row.overallScore}`}
          detail={`${atRisk.gap} competencies below target at ${atRisk.row.organization}. Worth a mentor nudge.`}
          cta="Open allocations"
          to="/admin/allocations"
          tone="attention"
        />
      ) : null}

      <div className="grid gap-4 xl:grid-cols-2">
        <ChartPanel
          title="Cohort comparison"
          description="Overall score vs assignment and quiz completion rates."
        >
          <CohortOverallBarChart rows={participantPerformance} />
        </ChartPanel>
        {atRisk ? (
          <ChartPanel
            title={`${atRisk.row.participantName.split(" ")[0]}’s competencies`}
            description="Score against target for the participant needing most attention."
          >
            <CompetencyBarChart competencies={atRisk.row.competencies} />
          </ChartPanel>
        ) : null}
      </div>

      <div className="space-y-3">
        <SectionLabel>Participant performance detail</SectionLabel>
        <WorkList>
          {participantPerformance.map((row) => (
            <WorkRow
              key={row.participantId}
              title={row.participantName}
              meta={`${row.organization} · ${row.cohort}`}
              status={
                <StatusLabel
                  tone={row.overallScore >= 75 ? "success" : "attention"}
                >
                  Overall {row.overallScore}
                </StatusLabel>
              }
            >
              <div className="h-56">
                <CompetencyBarChart competencies={row.competencies} />
              </div>
            </WorkRow>
          ))}
        </WorkList>
      </div>
    </PageLayout>
  )
}
