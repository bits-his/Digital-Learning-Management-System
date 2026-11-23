import * as React from "react"
import { Link } from "react-router-dom"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import {
  Field,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import {
  certificationRules,
  generateCertificateCodes,
  getParticipantEligibility,
  issuedCertificates as seedCerts,
  type CertificateRecord,
} from "@/shared/data/mock-certification"
import { enterpriseProfiles } from "@/shared/data/mock-matchmaking"
import { JourneyRail } from "@/shared/components/journey-rail"
import { NextMove, SectionLabel } from "@/shared/components/next-move"
import { PageIntro } from "@/shared/components/page-intro"
import {
  StatusLabel,
  WorkList,
  WorkRow,
} from "@/shared/components/work-row"

export function AdminCertificationPage() {
  const [certs, setCerts] = React.useState<CertificateRecord[]>(seedCerts)
  const [selectedEnterpriseId, setSelectedEnterpriseId] = React.useState(
    enterpriseProfiles[0]?.id ?? ""
  )
  const [showIssue, setShowIssue] = React.useState(false)

  const enterprise = enterpriseProfiles.find(
    (item) => item.id === selectedEnterpriseId
  )
  const eligibility = enterprise
    ? getParticipantEligibility(enterprise.participantId)
    : null
  const alreadyIssued = enterprise
    ? certs.some(
        (item) =>
          item.participantId === enterprise.participantId &&
          item.status === "Issued"
      )
    : false

  function issueCertificate() {
    if (!enterprise || !eligibility) return
    if (!eligibility.eligible) {
      toast.error("Required eligibility rules are not met")
      return
    }
    if (alreadyIssued) {
      toast.message("A certificate is already issued for this participant")
      return
    }

    const codes = generateCertificateCodes(enterprise.businessName)
    const next: CertificateRecord = {
      id: `cert-${Date.now()}`,
      code: codes.code,
      verificationCode: codes.verificationCode,
      participantId: enterprise.participantId,
      recipientName: enterprise.founderName,
      businessName: enterprise.businessName,
      programme: "AAIIRI Bootcamp 2027 — Export & Investment Track",
      cohort: "Cohort 2027-A",
      issuedAt: "Today",
      issuedBy: "Ada Okonkwo",
      status: "Issued",
      eligibilitySnapshot: eligibility.checks,
    }
    setCerts((prev) => [next, ...prev])
    setShowIssue(false)
    toast.success(`Issued ${codes.code}`)
  }

  return (
    <div className="flex flex-col gap-8">
      <PageIntro
        eyebrow="Certification"
        title="Eligibility rules, verification, and issuance"
        description="Certificates are earned against explicit rules — then issued with a unique code anyone can verify."
        action={
          <Button asChild size="lg" variant="outline">
            <Link to="/verify" target="_blank" rel="noreferrer">
              Open public verify
            </Link>
          </Button>
        }
      />

      <JourneyRail
        steps={[
          { id: "rules", label: "Rules", state: "done" },
          {
            id: "check",
            label: "Verify completion",
            state: "current",
          },
          { id: "issue", label: "Issue", state: "upcoming" },
          { id: "public", label: "Public verify", state: "upcoming" },
        ]}
      />

      <div className="space-y-3">
        <SectionLabel>Eligibility rules</SectionLabel>
        <WorkList>
          {certificationRules.map((rule) => (
            <WorkRow
              key={rule.id}
              title={rule.label}
              meta={rule.description}
              status={
                <StatusLabel tone={rule.required ? "attention" : "neutral"}>
                  {rule.required ? "Required" : "Optional"} ·{" "}
                  {rule.thresholdLabel}
                </StatusLabel>
              }
            />
          ))}
        </WorkList>
      </div>

      <div className="rounded-xl border border-foreground/10 bg-card/80 p-5">
        <SectionLabel>Completion verification & issue</SectionLabel>
        <FieldGroup className="mt-4 grid gap-4 sm:grid-cols-[1fr_auto]">
          <Field>
            <FieldLabel htmlFor="cert-ent">Enterprise / participant</FieldLabel>
            <select
              id="cert-ent"
              className="h-9 w-full rounded-lg border border-input bg-transparent px-2.5 text-sm"
              value={selectedEnterpriseId}
              onChange={(event) => setSelectedEnterpriseId(event.target.value)}
            >
              {enterpriseProfiles.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.businessName} — {item.founderName}
                </option>
              ))}
            </select>
          </Field>
          <div className="flex items-end">
            <Button onClick={() => setShowIssue(true)}>Check & issue</Button>
          </div>
        </FieldGroup>

        {showIssue && enterprise && eligibility ? (
          <div className="mt-5 space-y-4 border-t border-foreground/8 pt-4">
            <NextMove
              label={eligibility.eligible ? "Eligible" : "Not yet eligible"}
              title={`${enterprise.founderName} · ${enterprise.businessName}`}
              detail={eligibility.progressLabel}
              cta={
                alreadyIssued
                  ? "Already issued"
                  : eligibility.eligible
                    ? "Generate certificate"
                    : "Cannot issue yet"
              }
              tone={eligibility.eligible && !alreadyIssued ? "attention" : "default"}
              onClick={() => {
                if (eligibility.eligible && !alreadyIssued) issueCertificate()
              }}
            />
            <WorkList>
              {eligibility.checks.map((check) => (
                <WorkRow
                  key={check.ruleId}
                  title={check.label}
                  meta={`Actual ${check.actual} · Required ${check.required}`}
                  status={
                    <StatusLabel tone={check.met ? "success" : "attention"}>
                      {check.met ? "Met" : "Not met"}
                    </StatusLabel>
                  }
                />
              ))}
            </WorkList>
          </div>
        ) : null}
      </div>

      <div className="space-y-3">
        <SectionLabel>Issued certificates</SectionLabel>
        <WorkList>
          {certs.map((cert) => (
            <WorkRow
              key={cert.id}
              title={`${cert.recipientName} · ${cert.businessName}`}
              meta={`${cert.code} · Verify ${cert.verificationCode} · ${cert.programme}`}
              status={
                <StatusLabel
                  tone={cert.status === "Issued" ? "success" : "neutral"}
                >
                  {cert.status}
                </StatusLabel>
              }
              action={
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => {
                    void navigator.clipboard.writeText(
                      `${window.location.origin}/verify?code=${cert.verificationCode}`
                    )
                    toast.success("Verification link copied")
                  }}
                >
                  Copy verify link
                </Button>
              }
            >
              <p className="text-sm text-muted-foreground">
                Issued {cert.issuedAt} by {cert.issuedBy} · {cert.cohort}
              </p>
            </WorkRow>
          ))}
        </WorkList>
      </div>
    </div>
  )
}
