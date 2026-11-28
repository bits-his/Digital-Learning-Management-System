import * as React from "react"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import { Field, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { useAuth } from "@/shared/auth/auth-context"
import {
  getMentorProfileByUserId,
  getSessionsForMentor,
  type MentorshipSession,
} from "@/shared/data/mock-mentorship"
import { JourneyRail } from "@/shared/components/journey-rail"
import { NextMove, SectionLabel } from "@/shared/components/next-move"
import { PageLayout } from "@/shared/components/page-layout"
import {
  StatusLabel,
  WorkList,
  WorkRow,
} from "@/shared/components/work-row"

export function MentorSessionsPage() {
  const { user } = useAuth()
  const profile = getMentorProfileByUserId(user?.id ?? "mentor-1")
  const mentorId = profile?.id ?? "mentor-profile-1"
  const [sessions, setSessions] = React.useState<MentorshipSession[]>(() =>
    getSessionsForMentor(mentorId)
  )
  const [feedback, setFeedback] = React.useState<Record<string, string>>({})
  const [notes, setNotes] = React.useState<Record<string, string>>({})
  const [activeId, setActiveId] = React.useState<string | null>(null)

  const next = sessions.find((item) => item.status === "Scheduled")

  function complete(id: string) {
    setSessions((prev) =>
      prev.map((session) =>
        session.id === id
          ? {
              ...session,
              status: "Completed",
              notes: notes[id]?.trim() || session.notes || "Session completed.",
              mentorFeedback:
                feedback[id]?.trim() ||
                session.mentorFeedback ||
                "Keep pushing the focus area this week.",
            }
          : session
      )
    )
    toast.success("Session recorded — mentee can read your feedback")
    setActiveId(null)
  }

  return (
    <PageLayout variant="bare">
      

      <JourneyRail
        steps={[
          {
            id: "prep",
            label: "Prepare",
            state: next ? "current" : "done",
          },
          { id: "meet", label: "Meet", state: "upcoming" },
          { id: "note", label: "Write feedback", state: "upcoming" },
          { id: "close", label: "Mark complete", state: "upcoming" },
        ]}
      />

      {next ? (
        <NextMove
          label="Up next"
          title={`${next.participantName} · ${next.focus}`}
          detail={`${next.date} · ${next.time}`}
          cta="Log this session"
          tone="attention"
          onClick={() => setActiveId(next.id)}
        />
      ) : (
        <NextMove
          title="No open sessions"
          detail="When something is scheduled, it will demand action here first."
          cta="Review mentees"
          to="/mentor/mentees"
        />
      )}

      <div className="space-y-3">
        <SectionLabel>Session board</SectionLabel>
        <WorkList>
          {sessions.map((session) => {
            const open = activeId === session.id
            return (
              <WorkRow
                key={session.id}
                title={session.focus}
                meta={`${session.participantName} · ${session.date} · ${session.time}`}
                status={
                  <StatusLabel
                    tone={
                      session.status === "Completed" ? "success" : "primary"
                    }
                  >
                    {session.status}
                  </StatusLabel>
                }
                action={
                  session.status === "Scheduled" ? (
                    <Button
                      size="sm"
                      variant={open ? "secondary" : "outline"}
                      onClick={() => setActiveId(open ? null : session.id)}
                    >
                      {open ? "Close" : "Complete"}
                    </Button>
                  ) : undefined
                }
              >
                {session.status === "Completed" ? (
                  <div className="space-y-1 text-sm text-muted-foreground">
                    <p>Notes: {session.notes}</p>
                    <p>Feedback: {session.mentorFeedback}</p>
                  </div>
                ) : null}
                {open ? (
                  <div className="space-y-3 border-t border-foreground/8 pt-3">
                    <Field>
                      <FieldLabel htmlFor={`notes-${session.id}`}>
                        What you covered
                      </FieldLabel>
                      <Input
                        id={`notes-${session.id}`}
                        value={notes[session.id] ?? ""}
                        onChange={(event) =>
                          setNotes((prev) => ({
                            ...prev,
                            [session.id]: event.target.value,
                          }))
                        }
                        placeholder="Session notes"
                      />
                    </Field>
                    <Field>
                      <FieldLabel htmlFor={`feedback-${session.id}`}>
                        Feedback the mentee will see
                      </FieldLabel>
                      <Input
                        id={`feedback-${session.id}`}
                        value={feedback[session.id] ?? ""}
                        onChange={(event) =>
                          setFeedback((prev) => ({
                            ...prev,
                            [session.id]: event.target.value,
                          }))
                        }
                        placeholder="One clear next action…"
                      />
                    </Field>
                    <Button onClick={() => complete(session.id)}>
                      Save & complete
                    </Button>
                  </div>
                ) : null}
              </WorkRow>
            )
          })}
        </WorkList>
      </div>
    </PageLayout>
  )
}
