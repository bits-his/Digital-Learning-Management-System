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
  matchMeetings as seedMeetings,
  type MatchMeeting,
} from "@/shared/data/mock-matchmaking"
import { NextMove, SectionLabel } from "@/shared/components/next-move"
import { PageLayout } from "@/shared/components/page-layout"
import {
  StatusLabel,
  WorkList,
  WorkRow,
} from "@/shared/components/work-row"

export function AdminMatchMeetingsPage() {
  const [meetings, setMeetings] =
    React.useState<MatchMeeting[]>(seedMeetings)
  const [showForm, setShowForm] = React.useState(false)
  const [enterpriseName, setEnterpriseName] = React.useState("")
  const [partnerName, setPartnerName] = React.useState("")
  const [date, setDate] = React.useState("")
  const [agenda, setAgenda] = React.useState("")

  const upcoming = meetings.filter((item) => item.status === "Scheduled")

  function schedule() {
    if (!enterpriseName.trim() || !partnerName.trim() || !date.trim()) {
      toast.error("Enterprise, partner, and date are required")
      return
    }
    const next: MatchMeeting = {
      id: `mm-${Date.now()}`,
      matchId: `match-${Date.now()}`,
      enterpriseName: enterpriseName.trim(),
      partnerName: partnerName.trim(),
      partnerType: "Investor",
      date: date.trim(),
      time: "15:00 WAT",
      mode: "Virtual",
      status: "Scheduled",
      agenda: agenda.trim() || "Introductory commercial conversation",
    }
    setMeetings((prev) => [next, ...prev])
    setEnterpriseName("")
    setPartnerName("")
    setDate("")
    setAgenda("")
    setShowForm(false)
    toast.success("Meeting scheduled")
  }

  return (
    <PageLayout variant="bare">
      <div className="flex flex-wrap items-center justify-end gap-2">
        <Button size="lg" onClick={() => setShowForm((v) => !v)}>
            {showForm ? "Close" : "Schedule meeting"}
          </Button>
      </div>

      {upcoming[0] ? (
        <NextMove
          label="Next on the calendar"
          title={`${upcoming[0].enterpriseName} × ${upcoming[0].partnerName}`}
          detail={`${upcoming[0].date} · ${upcoming[0].time} · ${upcoming[0].mode} · ${upcoming[0].agenda}`}
          cta="Mark completed after call"
          onClick={() => {
            setMeetings((prev) =>
              prev.map((row) =>
                row.id === upcoming[0].id
                  ? {
                      ...row,
                      status: "Completed",
                      notes: row.notes || "Meeting completed — log outcome next.",
                    }
                  : row
              )
            )
            toast.success("Meeting marked completed")
          }}
        />
      ) : (
        <NextMove
          title="No upcoming matchmaking meetings"
          detail="Approved matches can be scheduled here."
          cta="Back to pipeline"
          to="/admin/matchmaking"
        />
      )}

      {showForm ? (
        <div className="rounded-xl border border-foreground/10 bg-card/80 p-5">
          <SectionLabel>Schedule commercial meeting</SectionLabel>
          <FieldGroup className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <Field>
              <FieldLabel htmlFor="mm-ent">Enterprise</FieldLabel>
              <Input
                id="mm-ent"
                value={enterpriseName}
                onChange={(event) => setEnterpriseName(event.target.value)}
              />
            </Field>
            <Field>
              <FieldLabel htmlFor="mm-partner">Partner</FieldLabel>
              <Input
                id="mm-partner"
                value={partnerName}
                onChange={(event) => setPartnerName(event.target.value)}
              />
            </Field>
            <Field>
              <FieldLabel htmlFor="mm-date">Date</FieldLabel>
              <Input
                id="mm-date"
                value={date}
                onChange={(event) => setDate(event.target.value)}
                placeholder="e.g. 25 Feb 2027"
              />
            </Field>
            <Field>
              <FieldLabel htmlFor="mm-agenda">Agenda</FieldLabel>
              <Input
                id="mm-agenda"
                value={agenda}
                onChange={(event) => setAgenda(event.target.value)}
              />
            </Field>
          </FieldGroup>
          <Button className="mt-4" onClick={schedule}>
            Save meeting
          </Button>
        </div>
      ) : null}

      <div className="space-y-3">
        <SectionLabel>Meeting records</SectionLabel>
        <WorkList>
          {meetings.map((meeting) => (
            <WorkRow
              key={meeting.id}
              title={`${meeting.enterpriseName} × ${meeting.partnerName}`}
              meta={`${meeting.date} · ${meeting.time} · ${meeting.mode} · ${meeting.agenda}`}
              status={
                <div className="flex flex-wrap gap-2">
                  <StatusLabel tone="primary">{meeting.partnerType}</StatusLabel>
                  <StatusLabel
                    tone={
                      meeting.status === "Completed"
                        ? "success"
                        : meeting.status === "Scheduled"
                          ? "attention"
                          : "neutral"
                    }
                  >
                    {meeting.status}
                  </StatusLabel>
                </div>
              }
              action={
                meeting.status === "Scheduled" ? (
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      onClick={() => {
                        setMeetings((prev) =>
                          prev.map((row) =>
                            row.id === meeting.id
                              ? { ...row, status: "Completed" }
                              : row
                          )
                        )
                        toast.success("Completed — add an outcome next")
                      }}
                    >
                      Complete
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        setMeetings((prev) =>
                          prev.map((row) =>
                            row.id === meeting.id
                              ? { ...row, status: "Cancelled" }
                              : row
                          )
                        )
                        toast.message("Meeting cancelled")
                      }}
                    >
                      Cancel
                    </Button>
                  </div>
                ) : undefined
              }
            >
              {meeting.notes ? (
                <p className="text-sm text-muted-foreground">{meeting.notes}</p>
              ) : null}
            </WorkRow>
          ))}
        </WorkList>
      </div>
    </PageLayout>
  )
}
