import { Link } from "react-router-dom"

import { Button } from "@/components/ui/button"
import { enterpriseProfiles } from "@/shared/data/mock-matchmaking"
import { JourneyRail } from "@/shared/components/journey-rail"
import { NextMove, SectionLabel } from "@/shared/components/next-move"
import { PageIntro } from "@/shared/components/page-intro"
import {
  HonestProgress,
  StatusLabel,
  WorkList,
  WorkRow,
} from "@/shared/components/work-row"

export function AdminEnterprisesPage() {
  const eligible = enterpriseProfiles.filter((item) => item.matchEligible)
  const blocked = enterpriseProfiles.filter((item) => !item.matchEligible)

  return (
    <div className="flex flex-col gap-8">
      <PageIntro
        eyebrow="Enterprise / startup profiles"
        title="Businesses ready — or not yet — for commercial intros"
        description="Readiness, traction, and ask. Matchmaking only unlocks when eligibility clears."
      />

      <JourneyRail
        steps={[
          { id: "profile", label: "Profile", state: "done" },
          { id: "ready", label: "Readiness", state: "current" },
          {
            id: "eligible",
            label: "Match eligible",
            state: eligible.length ? "done" : "upcoming",
          },
          { id: "intro", label: "Introduced", state: "upcoming" },
        ]}
      />

      <NextMove
        label="Pipeline"
        title={`${eligible.length} eligible · ${blocked.length} still blocked`}
        detail="Blocked enterprises need readiness work before investor/buyer requests."
        cta="Open matchmaking"
        to="/admin/matchmaking"
      />

      <div className="space-y-3">
        <SectionLabel>Enterprise directory</SectionLabel>
        <WorkList>
          {enterpriseProfiles.map((enterprise) => (
            <WorkRow
              key={enterprise.id}
              title={enterprise.businessName}
              meta={`${enterprise.founderName} · ${enterprise.sector} · ${enterprise.country} · ${enterprise.stage}`}
              status={
                <StatusLabel
                  tone={enterprise.matchEligible ? "success" : "attention"}
                >
                  {enterprise.matchEligible ? "Match eligible" : "Not eligible"}
                </StatusLabel>
              }
              action={
                <Button asChild size="sm" variant="outline">
                  <Link to="/admin/matchmaking">Find matches</Link>
                </Button>
              }
            >
              <p className="text-sm text-muted-foreground">
                {enterprise.offering}
              </p>
              <div className="mt-2 grid gap-3 md:grid-cols-2">
                <HonestProgress
                  label="Business readiness"
                  percent={enterprise.readinessScore}
                />
                <div className="flex flex-wrap gap-2 text-xs">
                  <StatusLabel
                    tone={enterprise.exportReady ? "success" : "neutral"}
                  >
                    Export {enterprise.exportReady ? "ready" : "not ready"}
                  </StatusLabel>
                  <StatusLabel
                    tone={enterprise.investmentReady ? "success" : "neutral"}
                  >
                    Investment{" "}
                    {enterprise.investmentReady ? "ready" : "not ready"}
                  </StatusLabel>
                </div>
              </div>
              <p className="mt-2 text-sm">
                <span className="text-muted-foreground">Traction: </span>
                {enterprise.traction}
              </p>
              <p className="text-sm">
                <span className="text-muted-foreground">Ask: </span>
                {enterprise.ask}
              </p>
            </WorkRow>
          ))}
        </WorkList>
      </div>
    </div>
  )
}
