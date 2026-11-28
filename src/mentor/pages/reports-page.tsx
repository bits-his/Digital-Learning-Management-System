import * as React from "react"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import {
  Field,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { useAuth } from "@/shared/auth/auth-context"
import {
  getMentorProfileByUserId,
  getReportsForMentor,
  type MentorReport,
} from "@/shared/data/mock-mentorship"
import { JourneyRail } from "@/shared/components/journey-rail"
import { NextMove, SectionLabel } from "@/shared/components/next-move"
import { PageLayout } from "@/shared/components/page-layout"
import {
  StatusLabel,
  WorkList,
  WorkRow,
} from "@/shared/components/work-row"

export function MentorReportsPage() {
  const { user } = useAuth()
  const profile = getMentorProfileByUserId(user?.id ?? "mentor-1")
  const mentorId = profile?.id ?? "mentor-profile-1"
  const [reports, setReports] = React.useState<MentorReport[]>(() =>
    getReportsForMentor(mentorId)
  )
  const [drafts, setDrafts] = React.useState<
    Record<
      string,
      { summary: string; development: string; recommendations: string }
    >
  >({})
  const [openId, setOpenId] = React.useState<string | null>(null)

  const draft = reports.find((item) => item.status === "Draft")

  function submit(id: string) {
    const draftValues = drafts[id]
    setReports((prev) =>
      prev.map((report) =>
        report.id === id
          ? {
              ...report,
              summary: draftValues?.summary?.trim() || report.summary,
              developmentNotes:
                draftValues?.development?.trim() || report.developmentNotes,
              recommendations:
                draftValues?.recommendations?.trim() || report.recommendations,
              status: "Submitted",
              submittedAt: "Today",
            }
          : report
      )
    )
    toast.success("Report submitted for programme review")
    setOpenId(null)
  }

  return (
    <PageLayout variant="bare">
      

      <JourneyRail
        steps={[
          {
            id: "draft",
            label: "Draft",
            state: draft ? "current" : "done",
          },
          { id: "submit", label: "Submit", state: "upcoming" },
          { id: "review", label: "Staff review", state: "upcoming" },
          { id: "act", label: "Programme acts", state: "upcoming" },
        ]}
      />

      {draft ? (
        <NextMove
          label="Unfinished report"
          title={`${draft.participantName} · ${draft.period}`}
          detail="Finish the summary and recommendations so admin can mark it reviewed."
          cta="Continue draft"
          tone="attention"
          onClick={() => setOpenId(draft.id)}
        />
      ) : (
        <NextMove
          title="No drafts waiting"
          detail="Submitted reports stay visible below for your records."
          cta="Back to sessions"
          to="/mentor/sessions"
        />
      )}

      <div className="space-y-3">
        <SectionLabel>Report list</SectionLabel>
        <WorkList>
          {reports.map((report) => {
            const open = openId === report.id
            return (
              <WorkRow
                key={report.id}
                title={`${report.participantName} · ${report.period}`}
                meta="Visible to programme staff after submit"
                status={
                  <StatusLabel
                    tone={
                      report.status === "Reviewed"
                        ? "success"
                        : report.status === "Submitted"
                          ? "primary"
                          : "attention"
                    }
                  >
                    {report.status}
                  </StatusLabel>
                }
                action={
                  report.status === "Draft" ? (
                    <Button
                      size="sm"
                      variant={open ? "secondary" : "outline"}
                      onClick={() => setOpenId(open ? null : report.id)}
                    >
                      {open ? "Close" : "Edit"}
                    </Button>
                  ) : undefined
                }
              >
                {report.status !== "Draft" ? (
                  <div className="space-y-1 text-sm text-muted-foreground">
                    <p>{report.summary}</p>
                    <p>{report.recommendations}</p>
                  </div>
                ) : null}
                {open ? (
                  <FieldGroup className="grid gap-3 border-t border-foreground/8 pt-3">
                    <Field>
                      <FieldLabel htmlFor={`summary-${report.id}`}>
                        Summary
                      </FieldLabel>
                      <Input
                        id={`summary-${report.id}`}
                        defaultValue={report.summary}
                        onChange={(event) =>
                          setDrafts((prev) => ({
                            ...prev,
                            [report.id]: {
                              summary: event.target.value,
                              development:
                                prev[report.id]?.development ??
                                report.developmentNotes,
                              recommendations:
                                prev[report.id]?.recommendations ??
                                report.recommendations,
                            },
                          }))
                        }
                      />
                    </Field>
                    <Field>
                      <FieldLabel htmlFor={`dev-${report.id}`}>
                        Development notes
                      </FieldLabel>
                      <Input
                        id={`dev-${report.id}`}
                        defaultValue={report.developmentNotes}
                        onChange={(event) =>
                          setDrafts((prev) => ({
                            ...prev,
                            [report.id]: {
                              summary:
                                prev[report.id]?.summary ?? report.summary,
                              development: event.target.value,
                              recommendations:
                                prev[report.id]?.recommendations ??
                                report.recommendations,
                            },
                          }))
                        }
                      />
                    </Field>
                    <Field>
                      <FieldLabel htmlFor={`rec-${report.id}`}>
                        Recommendations
                      </FieldLabel>
                      <Input
                        id={`rec-${report.id}`}
                        defaultValue={report.recommendations}
                        onChange={(event) =>
                          setDrafts((prev) => ({
                            ...prev,
                            [report.id]: {
                              summary:
                                prev[report.id]?.summary ?? report.summary,
                              development:
                                prev[report.id]?.development ??
                                report.developmentNotes,
                              recommendations: event.target.value,
                            },
                          }))
                        }
                      />
                    </Field>
                    <Button
                      className="w-fit"
                      onClick={() => submit(report.id)}
                    >
                      Submit to programme
                    </Button>
                  </FieldGroup>
                ) : null}
              </WorkRow>
            )
          })}
        </WorkList>
      </div>
    </PageLayout>
  )
}
