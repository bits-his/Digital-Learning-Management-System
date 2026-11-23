import * as React from "react"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import {
  mentorReports as seedReports,
  type MentorReport,
} from "@/shared/data/mock-mentorship"
import { NextMove, SectionLabel } from "@/shared/components/next-move"
import { PageIntro } from "@/shared/components/page-intro"
import {
  StatusLabel,
  WorkList,
  WorkRow,
} from "@/shared/components/work-row"

export function AdminMentorReportsPage() {
  const [reports, setReports] = React.useState<MentorReport[]>(seedReports)
  const waiting = reports.filter((item) => item.status === "Submitted")

  return (
    <div className="flex flex-col gap-8">
      <PageIntro
        eyebrow="Development signal"
        title={
          waiting.length
            ? `${waiting.length} report${waiting.length === 1 ? "" : "s"} awaiting your review`
            : "No mentor reports waiting"
        }
        description="Read what mentors observed, mark reviewed, then act in allocations or grading."
      />

      {waiting[0] ? (
        <NextMove
          label="Review next"
          title={`${waiting[0].participantName} · ${waiting[0].period}`}
          detail={`From ${waiting[0].mentorName}. ${waiting[0].summary}`}
          cta="Mark reviewed"
          tone="attention"
          onClick={() => {
            setReports((prev) =>
              prev.map((row) =>
                row.id === waiting[0].id
                  ? { ...row, status: "Reviewed" }
                  : row
              )
            )
            toast.success("Marked reviewed")
          }}
        />
      ) : (
        <NextMove
          title="Inbox clear"
          detail="Drafts still live with mentors until they submit."
          cta="View mentors"
          to="/admin/mentors"
        />
      )}

      <div className="space-y-3">
        <SectionLabel>All reports</SectionLabel>
        <WorkList>
          {reports.map((report) => (
            <WorkRow
              key={report.id}
              title={`${report.participantName} · ${report.period}`}
              meta={`Mentor: ${report.mentorName}${report.submittedAt ? ` · ${report.submittedAt}` : ""}`}
              status={
                <StatusLabel
                  tone={
                    report.status === "Reviewed"
                      ? "success"
                      : report.status === "Submitted"
                        ? "attention"
                        : "neutral"
                  }
                >
                  {report.status}
                </StatusLabel>
              }
              action={
                report.status === "Submitted" ? (
                  <Button
                    size="sm"
                    onClick={() => {
                      setReports((prev) =>
                        prev.map((row) =>
                          row.id === report.id
                            ? { ...row, status: "Reviewed" }
                            : row
                        )
                      )
                      toast.success("Marked reviewed")
                    }}
                  >
                    Mark reviewed
                  </Button>
                ) : undefined
              }
            >
              <div className="space-y-1 text-sm text-muted-foreground">
                <p>
                  <span className="font-medium text-foreground">Summary:</span>{" "}
                  {report.summary}
                </p>
                <p>{report.developmentNotes}</p>
                <p>{report.recommendations}</p>
              </div>
            </WorkRow>
          ))}
        </WorkList>
      </div>
    </div>
  )
}
