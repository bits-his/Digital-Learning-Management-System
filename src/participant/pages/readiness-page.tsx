import * as React from "react"
import { Link } from "react-router-dom"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import { useAuth } from "@/shared/auth/auth-context"
import {
  computeReadinessScore,
  getEnterpriseByParticipant,
  loadReadinessItems,
  saveReadinessItems,
  type ReadinessItem,
} from "@/shared/data/mock-matchmaking"
import { JourneyRail } from "@/shared/components/journey-rail"
import { NextMove, SectionLabel } from "@/shared/components/next-move"
import { PageLayout } from "@/shared/components/page-layout"
import {
  HonestProgress,
  StatusLabel,
  WorkList,
  WorkRow,
} from "@/shared/components/work-row"

export function ParticipantReadinessPage() {
  const { user } = useAuth()
  const participantId = user?.id ?? "participant-1"
  const enterprise = getEnterpriseByParticipant(participantId)
  const [items, setItems] = React.useState<ReadinessItem[]>(() =>
    loadReadinessItems(participantId)
  )
  const score = computeReadinessScore(items)
  const pending = items.filter((item) => item.status !== "Completed")
  const matchReady = score >= 75

  function advance(id: string) {
    setItems((prev) => {
      const next = prev.map((item) => {
        if (item.id !== id) return item
        if (item.status === "Pending")
          return { ...item, status: "In progress" as const }
        if (item.status === "In progress")
          return { ...item, status: "Completed" as const }
        return item
      })
      saveReadinessItems(participantId, next)
      const nextScore = computeReadinessScore(next)
      if (nextScore >= 75) {
        toast.success("Readiness unlocked matchmaking (75+)")
      } else {
        toast.success("Readiness item updated")
      }
      return next
    })
  }

  return (
    <PageLayout variant="bare">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-muted-foreground">
          {enterprise
            ? `${enterprise.businessName} · score ${score}/100`
            : `Score ${score}/100 — unlock matchmaking at 75.`}
        </p>
        <Button asChild variant="outline" size="sm">
          <Link to="/participant/profile">Edit profile</Link>
        </Button>
      </div>

      <JourneyRail
        steps={[
          { id: "basics", label: "Basics", state: "done" },
          {
            id: "evidence",
            label: "Evidence",
            state: pending.length ? "current" : "done",
          },
          {
            id: "threshold",
            label: "Hit 75+",
            state: matchReady ? "done" : "current",
          },
          {
            id: "match",
            label: "Match eligible",
            state: matchReady ? "current" : "upcoming",
          },
        ]}
      />

      {matchReady ? (
        <NextMove
          label="Unlocked"
          title="You’re ready to request commercial introductions"
          detail="Browse recommended investors and buyers, then request a match."
          cta="Open opportunities"
          to="/participant/opportunities"
        />
      ) : (
        <NextMove
          label="Still locked"
          title={`Need ${75 - score} more points before matchmaking unlocks`}
          detail={
            pending[0]
              ? `Next: ${pending[0].area}. ${pending[0].detail}`
              : "Complete remaining checklist items."
          }
          cta={pending[0] ? "Mark progress on next item" : "Review checklist"}
          tone="attention"
          onClick={() => pending[0] && advance(pending[0].id)}
        />
      )}

      {enterprise ? (
        <div className="grid gap-4 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="rounded-xl border border-foreground/10 bg-card/70 p-5">
            <SectionLabel>Enterprise profile shared with partners</SectionLabel>
            <dl className="mt-4 space-y-3 text-sm">
              <div>
                <dt className="text-muted-foreground">Offering</dt>
                <dd className="font-medium">{enterprise.offering}</dd>
              </div>
              <div>
                <dt className="text-muted-foreground">Traction</dt>
                <dd className="font-medium">{enterprise.traction}</dd>
              </div>
              <div>
                <dt className="text-muted-foreground">Ask</dt>
                <dd className="font-medium">{enterprise.ask}</dd>
              </div>
              <div className="flex flex-wrap gap-2 pt-1">
                <StatusLabel
                  tone={enterprise.exportReady ? "success" : "neutral"}
                >
                  Export {enterprise.exportReady ? "ready" : "building"}
                </StatusLabel>
                <StatusLabel
                  tone={enterprise.investmentReady ? "success" : "neutral"}
                >
                  Investment{" "}
                  {enterprise.investmentReady ? "ready" : "building"}
                </StatusLabel>
              </div>
            </dl>
          </div>
          <div className="rounded-xl border border-foreground/10 bg-card/70 p-5">
            <HonestProgress label="Toward match unlock (75)" percent={score} />
            <p className="mt-3 text-sm text-muted-foreground">
              Weighted checklist — completed items count fully, in-progress
              count half.
            </p>
          </div>
        </div>
      ) : null}

      <div className="space-y-3">
        <SectionLabel>Readiness checklist</SectionLabel>
        <WorkList>
          {items.map((item) => (
            <WorkRow
              key={item.id}
              title={item.area}
              meta={`${item.detail} · Weight ${item.weight}`}
              status={
                <StatusLabel
                  tone={
                    item.status === "Completed"
                      ? "success"
                      : item.status === "In progress"
                        ? "attention"
                        : "neutral"
                  }
                >
                  {item.status}
                </StatusLabel>
              }
              action={
                item.status !== "Completed" ? (
                  <Button size="sm" onClick={() => advance(item.id)}>
                    {item.status === "Pending" ? "Start" : "Mark complete"}
                  </Button>
                ) : undefined
              }
            />
          ))}
        </WorkList>
      </div>
    </PageLayout>
  )
}
