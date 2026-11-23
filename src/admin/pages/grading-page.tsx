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
  assignmentSubmissions as seedSubmissions,
  getAssignmentById,
  type AssignmentSubmission,
} from "@/shared/data/mock-assessment"
import { JourneyRail } from "@/shared/components/journey-rail"
import { NextMove, SectionLabel } from "@/shared/components/next-move"
import { PageIntro } from "@/shared/components/page-intro"
import {
  StatusLabel,
  WorkList,
  WorkRow,
} from "@/shared/components/work-row"

export function AdminGradingPage() {
  const [submissions, setSubmissions] =
    React.useState<AssignmentSubmission[]>(seedSubmissions)
  const [scores, setScores] = React.useState<Record<string, string>>({})
  const [feedback, setFeedback] = React.useState<Record<string, string>>({})
  const [activeId, setActiveId] = React.useState<string | null>(null)

  const pending = submissions.filter((item) => item.status === "Submitted")
  const graded = submissions.filter((item) => item.status === "Graded")
  const focus = pending[0]
  const focusAssignment = focus
    ? getAssignmentById(focus.assignmentId)
    : undefined

  function grade(id: string) {
    const scoreValue = Number(scores[id])
    if (Number.isNaN(scoreValue) || scoreValue < 0 || scoreValue > 100) {
      toast.error("Score must be between 0 and 100")
      return
    }

    setSubmissions((prev) =>
      prev.map((item) =>
        item.id === id
          ? {
              ...item,
              status: "Graded",
              score: scoreValue,
              feedback: feedback[id]?.trim() || "Solid effort — keep going.",
            }
          : item
      )
    )
    toast.success("Graded — participant can now see feedback")
    setActiveId(null)
  }

  return (
    <div className="flex flex-col gap-8">
      <PageIntro
        eyebrow="Facilitator inbox"
        title={
          pending.length
            ? `${pending.length} submission${pending.length === 1 ? "" : "s"} waiting on you`
            : "Grading inbox is clear"
        }
        description="Instructors ask one question on login: who needs my attention? Oldest pending work rises first."
      />

      <JourneyRail
        steps={[
          {
            id: "queue",
            label: "Queue",
            state: pending.length ? "current" : "done",
          },
          { id: "score", label: "Score", state: "upcoming" },
          { id: "feedback", label: "Feedback", state: "upcoming" },
          {
            id: "done",
            label: "On record",
            state: graded.length ? "done" : "upcoming",
          },
        ]}
      />

      {focus && focusAssignment ? (
        <NextMove
          label="Grade next"
          title={`${focus.participantName} · ${focusAssignment.title}`}
          detail={`Submitted ${focus.submittedAt}${focus.fileName ? ` · ${focus.fileName}` : ""}. Score it, leave one useful comment, move on.`}
          cta="Open this submission"
          tone="attention"
          onClick={() => setActiveId(focus.id)}
        />
      ) : (
        <NextMove
          label="Caught up"
          title="No pending submissions"
          detail="Check Performance to see how cohorts are tracking overall."
          cta="Open performance"
          to="/admin/performance"
        />
      )}

      <div className="space-y-3">
        <SectionLabel>Grading queue</SectionLabel>
        <WorkList>
          {[...pending, ...graded].map((item) => {
            const assignment = getAssignmentById(item.assignmentId)
            const open = activeId === item.id
            return (
              <WorkRow
                key={item.id}
                title={assignment?.title ?? "Assignment"}
                meta={`${item.participantName} · ${item.organization}${item.submittedAt ? ` · ${item.submittedAt}` : ""}`}
                status={
                  <StatusLabel
                    tone={item.status === "Graded" ? "success" : "attention"}
                  >
                    {item.status}
                  </StatusLabel>
                }
                action={
                  item.status === "Submitted" ? (
                    <Button
                      size="sm"
                      variant={open ? "secondary" : "outline"}
                      onClick={() => setActiveId(open ? null : item.id)}
                    >
                      {open ? "Close" : "Grade"}
                    </Button>
                  ) : undefined
                }
              >
                {item.status === "Graded" ? (
                  <p className="text-sm text-muted-foreground">
                    <span className="font-medium text-foreground">
                      {item.score}/100
                    </span>{" "}
                    — {item.feedback}
                  </p>
                ) : null}
                {open ? (
                  <FieldGroup className="grid gap-3 border-t border-foreground/8 pt-3 sm:grid-cols-[120px_1fr_auto]">
                    <Field>
                      <FieldLabel htmlFor={`score-${item.id}`}>Score</FieldLabel>
                      <Input
                        id={`score-${item.id}`}
                        type="number"
                        min={0}
                        max={100}
                        value={scores[item.id] ?? ""}
                        onChange={(event) =>
                          setScores((prev) => ({
                            ...prev,
                            [item.id]: event.target.value,
                          }))
                        }
                      />
                    </Field>
                    <Field>
                      <FieldLabel htmlFor={`feedback-${item.id}`}>
                        Feedback learners will read
                      </FieldLabel>
                      <Input
                        id={`feedback-${item.id}`}
                        value={feedback[item.id] ?? ""}
                        onChange={(event) =>
                          setFeedback((prev) => ({
                            ...prev,
                            [item.id]: event.target.value,
                          }))
                        }
                        placeholder="One concrete next step…"
                      />
                    </Field>
                    <div className="flex items-end">
                      <Button onClick={() => grade(item.id)}>Save grade</Button>
                    </div>
                  </FieldGroup>
                ) : null}
              </WorkRow>
            )
          })}
        </WorkList>
      </div>
    </div>
  )
}
