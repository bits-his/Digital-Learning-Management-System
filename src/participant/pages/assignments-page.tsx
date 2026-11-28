import * as React from "react"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import { Field, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { useAuth } from "@/shared/auth/auth-context"
import {
  getAssignmentById,
  getParticipantSubmissions,
  type AssignmentSubmission,
} from "@/shared/data/mock-assessment"
import { JourneyRail } from "@/shared/components/journey-rail"
import { NextMove, SectionLabel } from "@/shared/components/next-move"
import { PageLayout } from "@/shared/components/page-layout"
import {
  HonestProgress,
  StatusLabel,
  WorkList,
  WorkRow,
} from "@/shared/components/work-row"

function statusTone(
  status: AssignmentSubmission["status"]
): "neutral" | "attention" | "success" | "primary" {
  if (status === "Graded") return "success"
  if (status === "Submitted") return "primary"
  if (status === "Overdue") return "attention"
  if (status === "In progress") return "attention"
  return "neutral"
}

export function ParticipantAssignmentsPage() {
  const { user } = useAuth()
  const participantId = user?.id ?? "participant-1"
  const [items, setItems] = React.useState<AssignmentSubmission[]>(() =>
    getParticipantSubmissions(participantId)
  )
  const [files, setFiles] = React.useState<Record<string, File | null>>({})
  const [expanded, setExpanded] = React.useState<string | null>(null)
  const fileInputRefs = React.useRef<Record<string, HTMLInputElement | null>>(
    {}
  )

  const nextItem =
    items.find((item) => item.status === "In progress") ??
    items.find((item) => item.status === "Not started")
  const nextAssignment = nextItem
    ? getAssignmentById(nextItem.assignmentId)
    : undefined
  const graded = items.filter((item) => item.status === "Graded").length

  function formatBytes(size: number) {
    if (size < 1024) return `${size} B`
    if (size < 1024 * 1024) return `${(size / 1024).toFixed(1)} KB`
    return `${(size / (1024 * 1024)).toFixed(1)} MB`
  }

  function submit(id: string) {
    const file = files[id]
    if (!file) {
      toast.error("Choose a file to upload before submitting")
      return
    }

    setItems((prev) =>
      prev.map((item) =>
        item.id === id
          ? {
              ...item,
              status: "Submitted",
              fileName: file.name,
              submittedAt: "Today",
            }
          : item
      )
    )
    setFiles((prev) => ({ ...prev, [id]: null }))
    if (fileInputRefs.current[id]) {
      fileInputRefs.current[id]!.value = ""
    }
    toast.success(`Uploaded ${file.name} — waiting for facilitator feedback`)
    setExpanded(null)
  }

  return (
    <PageLayout variant="bare">
      <JourneyRail
        steps={[
          { id: "brief", label: "Read brief", state: "done" },
          {
            id: "work",
            label: "Prepare work",
            state: nextItem?.status === "In progress" ? "current" : "done",
          },
          {
            id: "submit",
            label: "Submit",
            state:
              nextItem?.status === "Not started" ||
              nextItem?.status === "In progress"
                ? "current"
                : "done",
          },
          {
            id: "feedback",
            label: "Get feedback",
            state: graded > 0 ? "done" : "upcoming",
          },
        ]}
      />

      {nextItem && nextAssignment ? (
        <NextMove
          title={nextAssignment.title}
          detail={`Due ${nextAssignment.due}. ${nextAssignment.brief}`}
          cta={
            nextItem.status === "In progress" ? "Continue submission" : "Start now"
          }
          tone="attention"
          onClick={() => setExpanded(nextItem.id)}
        />
      ) : (
        <NextMove
          label="You're caught up"
          title="All current assignments are submitted"
          detail="Check Performance for graded feedback, or wait for the next brief."
          cta="View performance"
          to="/participant/performance"
        />
      )}

      <div className="story-enter-late space-y-3">
        <div className="flex items-end justify-between gap-4">
          <SectionLabel>Your assignment list</SectionLabel>
          <p className="text-sm text-muted-foreground">
            {graded} of {items.length} graded
          </p>
        </div>
        <HonestProgress
          label="Graded evidence"
          value={graded}
          max={items.length}
        />
        <WorkList>
          {items.map((item) => {
            const assignment = getAssignmentById(item.assignmentId)
            const open = expanded === item.id
            return (
              <WorkRow
                key={item.id}
                title={assignment?.title ?? "Assignment"}
                meta={`Due ${assignment?.due ?? "—"} · ${assignment?.module}`}
                status={
                  <StatusLabel tone={statusTone(item.status)}>
                    {item.status}
                  </StatusLabel>
                }
                action={
                  <Button
                    size="sm"
                    variant={open ? "secondary" : "outline"}
                    onClick={() => setExpanded(open ? null : item.id)}
                  >
                    {open ? "Close" : "Open"}
                  </Button>
                }
              >
                {open ? (
                  <div className="space-y-3 border-t border-foreground/8 pt-3">
                    <p className="text-sm leading-relaxed text-muted-foreground">
                      {assignment?.brief}
                    </p>
                    {item.status === "Graded" ? (
                      <div className="rounded-lg bg-success/8 p-3 text-sm">
                        <p className="font-medium">
                          Score {item.score}/{assignment?.maxScore ?? 100}
                        </p>
                        <p className="mt-1 text-muted-foreground">
                          {item.feedback}
                        </p>
                      </div>
                    ) : item.status === "Submitted" ? (
                      <p className="text-sm text-muted-foreground">
                        Submitted as <span className="font-medium">{item.fileName}</span>.
                        Facilitators will score this next.
                      </p>
                    ) : (
                      <div className="flex flex-col gap-3">
                        <Field className="flex-1">
                          <FieldLabel htmlFor={`file-${item.id}`}>
                            Upload your file
                          </FieldLabel>
                          <Input
                            id={`file-${item.id}`}
                            ref={(node) => {
                              fileInputRefs.current[item.id] = node
                            }}
                            type="file"
                            accept=".pdf,.doc,.docx,.ppt,.pptx,.xls,.xlsx,.png,.jpg,.jpeg,.zip"
                            className="h-auto min-h-10 cursor-pointer py-2 file:mr-3 file:rounded-md file:border-0 file:bg-primary file:px-3 file:py-1.5 file:text-sm file:font-medium file:text-primary-foreground"
                            onChange={(event) => {
                              const file = event.target.files?.[0] ?? null
                              setFiles((prev) => ({
                                ...prev,
                                [item.id]: file,
                              }))
                              if (file) {
                                toast.message(`Selected ${file.name}`)
                              }
                            }}
                          />
                          {files[item.id] ? (
                            <p className="text-sm text-muted-foreground">
                              Ready:{" "}
                              <span className="font-medium text-foreground">
                                {files[item.id]!.name}
                              </span>{" "}
                              ({formatBytes(files[item.id]!.size)})
                            </p>
                          ) : (
                            <p className="text-sm text-muted-foreground">
                              PDF, Office docs, images, or ZIP — pick a real
                              file from your device.
                            </p>
                          )}
                        </Field>
                        <Button
                          className="w-fit"
                          onClick={() => submit(item.id)}
                          disabled={!files[item.id]}
                        >
                          Submit for grading
                        </Button>
                      </div>
                    )}
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
