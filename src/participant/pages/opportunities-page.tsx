import * as React from "react"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import { useAuth } from "@/shared/auth/auth-context"
import {
  getEnterpriseByParticipant,
  getMeetingsForEnterprise,
  getMatchesForEnterprise,
  isMatchUnlocked,
  matchOutcomes,
  partnerProfiles,
  type MatchRequest,
} from "@/shared/data/mock-matchmaking"
import { JourneyRail } from "@/shared/components/journey-rail"
import { NextMove, SectionLabel } from "@/shared/components/next-move"
import { PageLayout } from "@/shared/components/page-layout"
import {
  StatusLabel,
  WorkList,
  WorkRow,
} from "@/shared/components/work-row"

export function ParticipantOpportunitiesPage() {
  const { user } = useAuth()
  const enterprise = getEnterpriseByParticipant(user?.id ?? "participant-1")
  const [matches, setMatches] = React.useState<MatchRequest[]>(() =>
    enterprise ? getMatchesForEnterprise(enterprise.id) : []
  )
  const [tab, setTab] = React.useState<
    "partners" | "requests" | "meetings" | "outcomes"
  >("partners")

  const meetings = enterprise
    ? getMeetingsForEnterprise(enterprise.businessName)
    : []
  const outcomes = enterprise
    ? matchOutcomes.filter(
        (item) => item.enterpriseName === enterprise.businessName
      )
    : []
  const eligible = isMatchUnlocked(user?.id ?? "participant-1")
  const recommendedPartners = partnerProfiles.filter(
    (item) => item.status === "Active"
  )

  function requestMatch(partnerId: string) {
    if (!enterprise) return
    if (!eligible) {
      toast.error("Raise readiness to 75+ before requesting intros")
      return
    }
    const partner = partnerProfiles.find((item) => item.id === partnerId)
    if (!partner) return
    if (matches.some((item) => item.partnerId === partnerId)) {
      toast.message("You already have a match record with this partner")
      return
    }

    const next: MatchRequest = {
      id: `match-${Date.now()}`,
      enterpriseId: enterprise.id,
      enterpriseName: enterprise.businessName,
      partnerId: partner.id,
      partnerName: partner.name,
      partnerType: partner.type,
      stage: "Requested",
      fitScore: 70 + Math.floor(Math.random() * 20),
      reason: "Participant-requested introduction based on thesis fit.",
      requestedBy: "participant",
      requestedAt: "Today",
    }
    setMatches((prev) => [next, ...prev])
    setTab("requests")
    toast.success(`Request sent to programme for ${partner.name}`)
  }

  return (
    <PageLayout variant="bare">
      <JourneyRail
        steps={[
          {
            id: "ready",
            label: "Readiness",
            state: eligible ? "done" : "current",
          },
          {
            id: "request",
            label: "Request",
            state: eligible ? "current" : "upcoming",
          },
          { id: "meet", label: "Meet", state: "upcoming" },
          { id: "outcome", label: "Outcome", state: "upcoming" },
        ]}
      />

      {!eligible ? (
        <NextMove
          label="Locked"
          title="Finish readiness before requesting intros"
          detail="Investors and buyers only see businesses the programme can stand behind."
          cta="Improve readiness"
          to="/participant/readiness"
          tone="attention"
        />
      ) : (
        <NextMove
          label="You’re eligible"
          title="Request an introduction that fits your ask"
          detail={
            enterprise
              ? `Your ask: ${enterprise.ask}`
              : "Choose an investor or buyer below."
          }
          cta="Browse partners"
          onClick={() => setTab("partners")}
        />
      )}

      <div className="flex flex-wrap gap-2">
        {(
          [
            ["partners", "Partners"],
            ["requests", `Requests (${matches.length})`],
            ["meetings", `Meetings (${meetings.length})`],
            ["outcomes", `Outcomes (${outcomes.length})`],
          ] as const
        ).map(([key, label]) => (
          <Button
            key={key}
            size="sm"
            variant={tab === key ? "default" : "outline"}
            onClick={() => setTab(key)}
          >
            {label}
          </Button>
        ))}
      </div>

      {tab === "partners" ? (
        <div className="space-y-3">
          <SectionLabel>Recommended investors & buyers</SectionLabel>
          <WorkList>
            {recommendedPartners.map((partner) => (
              <WorkRow
                key={partner.id}
                title={partner.name}
                meta={`${partner.ticketOrVolume} · ${partner.geographies.join(", ")}`}
                status={<StatusLabel tone="primary">{partner.type}</StatusLabel>}
                action={
                  <Button
                    size="sm"
                    disabled={!eligible}
                    onClick={() => requestMatch(partner.id)}
                  >
                    Request intro
                  </Button>
                }
              >
                <p className="text-sm text-muted-foreground">{partner.thesis}</p>
                <p className="text-xs text-muted-foreground">
                  Focus: {partner.focus.join(" · ")}
                </p>
              </WorkRow>
            ))}
          </WorkList>
        </div>
      ) : null}

      {tab === "requests" ? (
        <div className="space-y-3">
          <SectionLabel>Your matchmaking requests</SectionLabel>
          <WorkList>
            {matches.length === 0 ? (
              <WorkRow
                title="No requests yet"
                meta="Browse partners and request an introduction."
              />
            ) : (
              matches.map((match) => (
                <WorkRow
                  key={match.id}
                  title={match.partnerName}
                  meta={`Fit ${match.fitScore} · ${match.reason}`}
                  status={
                    <div className="flex flex-wrap gap-2">
                      <StatusLabel tone="primary">
                        {match.partnerType}
                      </StatusLabel>
                      <StatusLabel tone="attention">{match.stage}</StatusLabel>
                    </div>
                  }
                />
              ))
            )}
          </WorkList>
        </div>
      ) : null}

      {tab === "meetings" ? (
        <div className="space-y-3">
          <SectionLabel>Meeting schedule & records</SectionLabel>
          <WorkList>
            {meetings.length === 0 ? (
              <WorkRow
                title="No meetings scheduled"
                meta="Approved matches get calendar slots from programme staff."
              />
            ) : (
              meetings.map((meeting) => (
                <WorkRow
                  key={meeting.id}
                  title={meeting.partnerName}
                  meta={`${meeting.date} · ${meeting.time} · ${meeting.mode} · ${meeting.agenda}`}
                  status={
                    <StatusLabel
                      tone={
                        meeting.status === "Completed" ? "success" : "attention"
                      }
                    >
                      {meeting.status}
                    </StatusLabel>
                  }
                >
                  {meeting.notes ? (
                    <p className="text-sm text-muted-foreground">
                      {meeting.notes}
                    </p>
                  ) : null}
                </WorkRow>
              ))
            )}
          </WorkList>
        </div>
      ) : null}

      {tab === "outcomes" ? (
        <div className="space-y-3">
          <SectionLabel>Outcomes & follow-ups</SectionLabel>
          <WorkList>
            {outcomes.length === 0 ? (
              <WorkRow
                title="No outcomes logged yet"
                meta="After meetings, programme staff record what happened next."
              />
            ) : (
              outcomes.map((outcome) => (
                <WorkRow
                  key={outcome.id}
                  title={outcome.partnerName}
                  meta={`Updated ${outcome.updatedAt}`}
                  status={
                    <StatusLabel tone="success">{outcome.result}</StatusLabel>
                  }
                >
                  <p className="text-sm text-muted-foreground">
                    {outcome.summary}
                  </p>
                  <p className="text-sm">
                    <span className="text-muted-foreground">Next: </span>
                    {outcome.nextStep}
                  </p>
                </WorkRow>
              ))
            )}
          </WorkList>
        </div>
      ) : null}
    </PageLayout>
  )
}
