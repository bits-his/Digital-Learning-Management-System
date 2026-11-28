import * as React from "react"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import {
  Field,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import {
  matchOutcomes as seedOutcomes,
  type MatchOutcome,
} from "@/shared/data/mock-matchmaking"
import { NextMove, SectionLabel } from "@/shared/components/next-move"
import { PageLayout } from "@/shared/components/page-layout"
import {
  StatusLabel,
  WorkList,
  WorkRow,
} from "@/shared/components/work-row"

const RESULT_OPTIONS: MatchOutcome["result"][] = [
  "Intro completed",
  "Due diligence",
  "Pilot agreed",
  "Investment interest",
  "No fit",
  "Follow-up needed",
]

export function AdminMatchOutcomesPage() {
  const [outcomes, setOutcomes] =
    React.useState<MatchOutcome[]>(seedOutcomes)
  const [showForm, setShowForm] = React.useState(false)
  const [enterpriseName, setEnterpriseName] = React.useState("")
  const [partnerName, setPartnerName] = React.useState("")
  const [result, setResult] =
    React.useState<MatchOutcome["result"]>("Follow-up needed")
  const [summary, setSummary] = React.useState("")
  const [nextStep, setNextStep] = React.useState("")

  const followUps = outcomes.filter(
    (item) => item.result === "Follow-up needed" || item.followUpDate
  )

  function addOutcome() {
    if (!enterpriseName.trim() || !partnerName.trim() || !summary.trim()) {
      toast.error("Enterprise, partner, and summary are required")
      return
    }
    const next: MatchOutcome = {
      id: `out-${Date.now()}`,
      matchId: `match-${Date.now()}`,
      enterpriseName: enterpriseName.trim(),
      partnerName: partnerName.trim(),
      partnerType: "Investor",
      result,
      summary: summary.trim(),
      nextStep: nextStep.trim() || "No next step recorded",
      followUpDate: result === "Follow-up needed" ? "TBD" : undefined,
      updatedAt: "Today",
    }
    setOutcomes((prev) => [next, ...prev])
    setEnterpriseName("")
    setPartnerName("")
    setSummary("")
    setNextStep("")
    setShowForm(false)
    toast.success("Outcome recorded")
  }

  return (
    <PageLayout variant="bare">
      <div className="flex flex-wrap items-center justify-end gap-2">
        <Button size="lg" onClick={() => setShowForm((v) => !v)}>
            {showForm ? "Close" : "Log outcome"}
          </Button>
      </div>

      <NextMove
        label="Follow-up radar"
        title={
          followUps.length
            ? `${followUps.length} outcome${followUps.length === 1 ? "" : "s"} need attention`
            : "No open follow-ups"
        }
        detail="Commercial progress dies when outcomes aren’t written down."
        cta={followUps.length ? "Review list below" : "Log an outcome"}
        onClick={() => {
          if (!followUps.length) setShowForm(true)
        }}
      />

      {showForm ? (
        <div className="rounded-xl border border-foreground/10 bg-card/80 p-5">
          <SectionLabel>Record matchmaking outcome</SectionLabel>
          <FieldGroup className="mt-4 grid gap-4 sm:grid-cols-2">
            <Field>
              <FieldLabel htmlFor="out-ent">Enterprise</FieldLabel>
              <Input
                id="out-ent"
                value={enterpriseName}
                onChange={(event) => setEnterpriseName(event.target.value)}
              />
            </Field>
            <Field>
              <FieldLabel htmlFor="out-partner">Partner</FieldLabel>
              <Input
                id="out-partner"
                value={partnerName}
                onChange={(event) => setPartnerName(event.target.value)}
              />
            </Field>
            <Field>
              <FieldLabel>Result</FieldLabel>
              <div className="flex flex-wrap gap-2">
                {RESULT_OPTIONS.map((item) => (
                  <Button
                    key={item}
                    type="button"
                    size="sm"
                    variant={result === item ? "default" : "outline"}
                    onClick={() => setResult(item)}
                  >
                    {item}
                  </Button>
                ))}
              </div>
            </Field>
            <Field>
              <FieldLabel htmlFor="out-summary">Summary</FieldLabel>
              <Input
                id="out-summary"
                value={summary}
                onChange={(event) => setSummary(event.target.value)}
              />
            </Field>
            <Field className="sm:col-span-2">
              <FieldLabel htmlFor="out-next">Next step</FieldLabel>
              <Input
                id="out-next"
                value={nextStep}
                onChange={(event) => setNextStep(event.target.value)}
              />
            </Field>
          </FieldGroup>
          <Button className="mt-4" onClick={addOutcome}>
            Save outcome
          </Button>
        </div>
      ) : null}

      <div className="space-y-3">
        <SectionLabel>Outcome log</SectionLabel>
        <WorkList>
          {outcomes.map((outcome) => (
            <WorkRow
              key={outcome.id}
              title={`${outcome.enterpriseName} × ${outcome.partnerName}`}
              meta={`Updated ${outcome.updatedAt}${outcome.followUpDate ? ` · Follow-up ${outcome.followUpDate}` : ""}`}
              status={
                <div className="flex flex-wrap gap-2">
                  <StatusLabel tone="primary">{outcome.partnerType}</StatusLabel>
                  <StatusLabel
                    tone={
                      outcome.result === "No fit" ? "neutral" : "success"
                    }
                  >
                    {outcome.result}
                  </StatusLabel>
                </div>
              }
            >
              <p className="text-sm text-muted-foreground">{outcome.summary}</p>
              <p className="text-sm">
                <span className="text-muted-foreground">Next: </span>
                {outcome.nextStep}
              </p>
            </WorkRow>
          ))}
        </WorkList>
      </div>
    </PageLayout>
  )
}
