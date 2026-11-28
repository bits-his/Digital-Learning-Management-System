import { Link } from "react-router-dom"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import { useAuth } from "@/shared/auth/auth-context"
import {
  getCertificatesForParticipant,
  getParticipantEligibility,
} from "@/shared/data/mock-certification"
import { JourneyRail } from "@/shared/components/journey-rail"
import { NextMove, SectionLabel } from "@/shared/components/next-move"
import { PageLayout } from "@/shared/components/page-layout"
import {
  StatusLabel,
  WorkList,
  WorkRow,
} from "@/shared/components/work-row"

export function ParticipantCertificatesPage() {
  const { user } = useAuth()
  const participantId = user?.id ?? "participant-1"
  const eligibility = getParticipantEligibility(participantId)
  const certificates = getCertificatesForParticipant(participantId)
  const cert = certificates[0]

  return (
    <PageLayout variant="bare">
      <JourneyRail
        steps={[
          { id: "rules", label: "Know rules", state: "done" },
          {
            id: "earn",
            label: "Meet criteria",
            state: eligibility.eligible ? "done" : "current",
          },
          {
            id: "issue",
            label: "Issued",
            state: cert ? "done" : "upcoming",
          },
          {
            id: "verify",
            label: "Shareable verify",
            state: cert ? "current" : "upcoming",
          },
        ]}
      />

      {cert ? (
        <NextMove
          label="Shareable proof"
          title={cert.code}
          detail={`Verification code ${cert.verificationCode}. Anyone can confirm this without logging in.`}
          cta="Open public verify page"
          to={`/verify?code=${cert.verificationCode}`}
        />
      ) : (
        <NextMove
          label="Not issued yet"
          title={eligibility.progressLabel}
          detail="Finish the open criteria below. Programme staff issue the certificate when required rules clear."
          cta="Improve readiness"
          to="/participant/readiness"
          tone="attention"
        />
      )}

      {cert ? (
        <div className="overflow-hidden rounded-xl border border-foreground/10">
          <div className="mesh-panel px-6 py-6 text-white md:px-8">
            <p className="text-xs font-semibold tracking-[0.18em] text-white/70 uppercase">
              Certificate of completion
            </p>
            <h2 className="mt-3 font-heading text-2xl font-semibold md:text-3xl">
              {cert.recipientName}
            </h2>
            <p className="mt-1 text-sm text-white/80">{cert.businessName}</p>
            <p className="mt-4 max-w-xl text-sm leading-relaxed text-white/85">
              {cert.programme}
            </p>
            <div className="mt-6 flex flex-wrap gap-6 text-sm">
              <div>
                <p className="text-white/60">Certificate No.</p>
                <p className="font-medium">{cert.code}</p>
              </div>
              <div>
                <p className="text-white/60">Verification</p>
                <p className="font-medium">{cert.verificationCode}</p>
              </div>
              <div>
                <p className="text-white/60">Issued</p>
                <p className="font-medium">{cert.issuedAt}</p>
              </div>
            </div>
          </div>
          <div className="flex flex-wrap gap-2 bg-card/80 p-4">
            <Button
              size="sm"
              onClick={() => {
                void navigator.clipboard.writeText(cert.verificationCode)
                toast.success("Verification code copied")
              }}
            >
              Copy verification code
            </Button>
            <Button asChild size="sm" variant="outline">
              <Link to={`/verify?code=${cert.verificationCode}`}>
                Public verify page
              </Link>
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => toast.message("PDF download mocked in frontend")}
            >
              Download PDF (mock)
            </Button>
          </div>
        </div>
      ) : null}

      <div className="space-y-3">
        <SectionLabel>Eligibility checklist</SectionLabel>
        <WorkList>
          {eligibility.checks.map((check) => (
            <WorkRow
              key={check.ruleId}
              title={check.label}
              meta={`You: ${check.actual} · Required: ${check.required}`}
              status={
                <StatusLabel tone={check.met ? "success" : "attention"}>
                  {check.met ? "Met" : "Not met"}
                </StatusLabel>
              }
            />
          ))}
        </WorkList>
      </div>
    </PageLayout>
  )
}
