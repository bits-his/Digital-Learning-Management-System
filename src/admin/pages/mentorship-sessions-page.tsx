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
  mentorshipSessions as seedSessions,
  type MentorshipSession,
} from "@/shared/data/mock-mentorship"
import { NextMove, SectionLabel } from "@/shared/components/next-move"
import { PageLayout } from "@/shared/components/page-layout"
import {
  StatusLabel,
  WorkList,
  WorkRow,
} from "@/shared/components/work-row"

export function AdminMentorshipSessionsPage() {
  const [sessions, setSessions] =
    React.useState<MentorshipSession[]>(seedSessions)
  const [mentorName, setMentorName] = React.useState("")
  const [participantName, setParticipantName] = React.useState("")
  const [date, setDate] = React.useState("")
  const [focus, setFocus] = React.useState("")
  const [showForm, setShowForm] = React.useState(false)

  const scheduled = sessions.filter((item) => item.status === "Scheduled")

  function schedule() {
    if (
      !mentorName.trim() ||
      !participantName.trim() ||
      !date.trim() ||
      !focus.trim()
    ) {
      toast.error("Fill all scheduling fields")
      return
    }

    const next: MentorshipSession = {
      id: `ms-${Date.now()}`,
      mentorId: "mentor-profile-1",
      mentorName: mentorName.trim(),
      participantId: "participant-pending",
      participantName: participantName.trim(),
      date: date.trim(),
      time: "15:00 WAT",
      focus: focus.trim(),
      status: "Scheduled",
    }
    setSessions((prev) => [next, ...prev])
    setMentorName("")
    setParticipantName("")
    setDate("")
    setFocus("")
    setShowForm(false)
    toast.success("Session scheduled")
  }

  return (
    <PageLayout variant="bare">
      <div className="flex flex-wrap items-center justify-end gap-2">
        <Button size="lg" onClick={() => setShowForm((v) => !v)}>
            {showForm ? "Close" : "Schedule session"}
          </Button>
      </div>

      <NextMove
        title="Mentors close the loop in their hub"
        detail="Admin schedules here; mentors log notes and feedback under Sessions."
        cta="Review mentor reports"
        to="/admin/mentor-reports"
      />

      {showForm ? (
        <div className="rounded-xl border border-foreground/10 bg-card/80 p-5">
          <SectionLabel>Schedule</SectionLabel>
          <FieldGroup className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <Field>
              <FieldLabel htmlFor="ms-mentor">Mentor</FieldLabel>
              <Input
                id="ms-mentor"
                value={mentorName}
                onChange={(event) => setMentorName(event.target.value)}
              />
            </Field>
            <Field>
              <FieldLabel htmlFor="ms-participant">Participant</FieldLabel>
              <Input
                id="ms-participant"
                value={participantName}
                onChange={(event) => setParticipantName(event.target.value)}
              />
            </Field>
            <Field>
              <FieldLabel htmlFor="ms-date">Date</FieldLabel>
              <Input
                id="ms-date"
                value={date}
                onChange={(event) => setDate(event.target.value)}
                placeholder="e.g. 20 Feb 2027"
              />
            </Field>
            <Field>
              <FieldLabel htmlFor="ms-focus">Focus</FieldLabel>
              <Input
                id="ms-focus"
                value={focus}
                onChange={(event) => setFocus(event.target.value)}
              />
            </Field>
          </FieldGroup>
          <Button className="mt-4" onClick={schedule}>
            Schedule
          </Button>
        </div>
      ) : null}

      <div className="space-y-3">
        <SectionLabel>All sessions</SectionLabel>
        <WorkList>
          {sessions.map((session) => (
            <WorkRow
              key={session.id}
              title={session.focus}
              meta={`${session.mentorName} with ${session.participantName} · ${session.date} · ${session.time}`}
              status={
                <StatusLabel
                  tone={
                    session.status === "Completed"
                      ? "success"
                      : session.status === "Cancelled"
                        ? "neutral"
                        : "primary"
                  }
                >
                  {session.status}
                </StatusLabel>
              }
              action={
                session.status === "Scheduled" ? (
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      onClick={() => {
                        setSessions((prev) =>
                          prev.map((row) =>
                            row.id === session.id
                              ? { ...row, status: "Completed" }
                              : row
                          )
                        )
                        toast.success("Marked completed")
                      }}
                    >
                      Complete
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        setSessions((prev) =>
                          prev.map((row) =>
                            row.id === session.id
                              ? { ...row, status: "Cancelled" }
                              : row
                          )
                        )
                        toast.message("Cancelled")
                      }}
                    >
                      Cancel
                    </Button>
                  </div>
                ) : undefined
              }
            >
              {session.notes ? (
                <p className="text-sm text-muted-foreground">{session.notes}</p>
              ) : null}
            </WorkRow>
          ))}
        </WorkList>
      </div>
    </PageLayout>
  )
}
