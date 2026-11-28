import * as React from "react"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import {
  matchRequests as seedMatches,
  type MatchRequest,
  type MatchStage,
} from "@/shared/data/mock-matchmaking"
import { JourneyRail } from "@/shared/components/journey-rail"
import { NextMove, SectionLabel } from "@/shared/components/next-move"
import { PageLayout } from "@/shared/components/page-layout"
import {
  StatusLabel,
  WorkList,
  WorkRow,
} from "@/shared/components/work-row"

function stageTone(
  stage: MatchStage
): "neutral" | "attention" | "success" | "primary" {
  if (stage === "Approved" || stage === "Meeting scheduled" || stage === "Completed")
    return "success"
  if (stage === "Declined") return "neutral"
  if (stage === "Under review" || stage === "Requested") return "attention"
  return "primary"
}

export function AdminMatchmakingPage() {
  const [matches, setMatches] = React.useState<MatchRequest[]>(seedMatches)
  const [filter, setFilter] = React.useState<"action" | "all">("action")

  const actionable = matches.filter((item) =>
    ["Recommended", "Requested", "Under review"].includes(item.stage)
  )
  const visible = filter === "action" ? actionable : matches
  const next = actionable.sort((a, b) => b.fitScore - a.fitScore)[0]

  function setStage(id: string, stage: MatchStage, message: string) {
    setMatches((prev) =>
      prev.map((item) => (item.id === id ? { ...item, stage } : item))
    )
    toast.success(message)
  }

  return (
    <PageLayout variant="bare">
      

      <JourneyRail
        steps={[
          { id: "recommend", label: "Recommend", state: "done" },
          {
            id: "review",
            label: "Review",
            state: actionable.length ? "current" : "done",
          },
          { id: "approve", label: "Approve", state: "upcoming" },
          { id: "meet", label: "Meet", state: "upcoming" },
        ]}
      />

      {next ? (
        <NextMove
          label="Highest-fit waiting"
          title={`${next.enterpriseName} → ${next.partnerName}`}
          detail={`Fit ${next.fitScore}. ${next.reason}`}
          cta={
            next.stage === "Recommended" ? "Promote to review" : "Approve intro"
          }
          tone="attention"
          onClick={() =>
            setStage(
              next.id,
              next.stage === "Recommended" ? "Under review" : "Approved",
              next.stage === "Recommended"
                ? "Moved to under review"
                : "Introduction approved"
            )
          }
        />
      ) : (
        <NextMove
          label="Pipeline clear"
          title="No matches waiting on admin"
          detail="Schedule meetings for approved intros or log outcomes."
          cta="Open meetings"
          to="/admin/match-meetings"
        />
      )}

      <div className="flex flex-wrap gap-2">
        <Button
          size="sm"
          variant={filter === "action" ? "default" : "outline"}
          onClick={() => setFilter("action")}
        >
          Needs action ({actionable.length})
        </Button>
        <Button
          size="sm"
          variant={filter === "all" ? "default" : "outline"}
          onClick={() => setFilter("all")}
        >
          All matches
        </Button>
      </div>

      <div className="space-y-3">
        <SectionLabel>Match pipeline</SectionLabel>
        <WorkList>
          {visible.map((match) => (
            <WorkRow
              key={match.id}
              title={`${match.enterpriseName} → ${match.partnerName}`}
              meta={`Fit ${match.fitScore} · Requested ${match.requestedAt} by ${match.requestedBy} · ${match.reason}`}
              status={
                <div className="flex flex-wrap gap-2">
                  <StatusLabel tone="primary">{match.partnerType}</StatusLabel>
                  <StatusLabel tone={stageTone(match.stage)}>
                    {match.stage}
                  </StatusLabel>
                </div>
              }
              action={
                <div className="flex flex-wrap gap-2">
                  {match.stage === "Recommended" ||
                  match.stage === "Requested" ? (
                    <Button
                      size="sm"
                      onClick={() =>
                        setStage(match.id, "Under review", "Now under review")
                      }
                    >
                      Review
                    </Button>
                  ) : null}
                  {match.stage === "Under review" ? (
                    <>
                      <Button
                        size="sm"
                        onClick={() =>
                          setStage(match.id, "Approved", "Introduction approved")
                        }
                      >
                        Approve
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() =>
                          setStage(match.id, "Declined", "Match declined")
                        }
                      >
                        Decline
                      </Button>
                    </>
                  ) : null}
                  {match.stage === "Approved" ? (
                    <Button
                      size="sm"
                      onClick={() =>
                        setStage(
                          match.id,
                          "Meeting scheduled",
                          "Ready for meeting scheduling"
                        )
                      }
                    >
                      Mark for meeting
                    </Button>
                  ) : null}
                </div>
              }
            >
              {match.notes ? (
                <p className="text-sm text-muted-foreground">{match.notes}</p>
              ) : null}
            </WorkRow>
          ))}
        </WorkList>
      </div>
    </PageLayout>
  )
}
