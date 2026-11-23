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
  assignments as seedAssignments,
  type Assignment,
} from "@/shared/data/mock-assessment"
import { NextMove, SectionLabel } from "@/shared/components/next-move"
import { PageIntro } from "@/shared/components/page-intro"
import {
  StatusLabel,
  WorkList,
  WorkRow,
} from "@/shared/components/work-row"

export function AdminAssignmentsPage() {
  const [items, setItems] = React.useState<Assignment[]>(seedAssignments)
  const [title, setTitle] = React.useState("")
  const [due, setDue] = React.useState("")
  const [cohort, setCohort] = React.useState("Cohort 2027-A")
  const [showCreate, setShowCreate] = React.useState(false)

  const draft = items.find((item) => item.status === "Draft")

  function addAssignment() {
    if (!title.trim() || !due.trim()) {
      toast.error("Title and due date are required")
      return
    }

    const next: Assignment = {
      id: `assign-${Date.now()}`,
      title: title.trim(),
      brief: "Brief to be refined by facilitators.",
      module: "General",
      cohort,
      due: due.trim(),
      maxScore: 100,
      status: "Draft",
    }
    setItems((prev) => [next, ...prev])
    setTitle("")
    setDue("")
    setShowCreate(false)
    toast.success("Assignment draft created")
  }

  return (
    <div className="flex flex-col gap-8">
      <PageIntro
        eyebrow="Assignment bank"
        title="Briefs with deadlines learners cannot miss"
        description="Publish work that produces evidence. Cohort labels are references — enrolment stays with Learning."
        action={
          <Button size="lg" onClick={() => setShowCreate((v) => !v)}>
            {showCreate ? "Close" : "New assignment"}
          </Button>
        }
      />

      {draft ? (
        <NextMove
          label="Unpublished brief"
          title={draft.title}
          detail={`Due ${draft.due} · ${draft.cohort}`}
          cta="Publish now"
          onClick={() => {
            setItems((prev) =>
              prev.map((row) =>
                row.id === draft.id ? { ...row, status: "Published" } : row
              )
            )
            toast.success("Assignment published to participants")
          }}
        />
      ) : (
        <NextMove
          title="All briefs are live"
          detail="Create another when a module needs a graded artefact."
          cta="Create assignment"
          onClick={() => setShowCreate(true)}
        />
      )}

      {showCreate ? (
        <div className="rounded-xl border border-foreground/10 bg-card/80 p-5">
          <SectionLabel>Create assignment</SectionLabel>
          <FieldGroup className="mt-4 grid gap-4 sm:grid-cols-3">
            <Field>
              <FieldLabel htmlFor="assign-title">Title</FieldLabel>
              <Input
                id="assign-title"
                value={title}
                onChange={(event) => setTitle(event.target.value)}
              />
            </Field>
            <Field>
              <FieldLabel htmlFor="assign-due">Due date</FieldLabel>
              <Input
                id="assign-due"
                value={due}
                onChange={(event) => setDue(event.target.value)}
                placeholder="e.g. 28 Feb 2027"
              />
            </Field>
            <Field>
              <FieldLabel htmlFor="assign-cohort">Cohort</FieldLabel>
              <Input
                id="assign-cohort"
                value={cohort}
                onChange={(event) => setCohort(event.target.value)}
              />
            </Field>
          </FieldGroup>
          <Button className="mt-4" onClick={addAssignment}>
            Save draft
          </Button>
        </div>
      ) : null}

      <div className="space-y-3">
        <SectionLabel>Assignment bank</SectionLabel>
        <WorkList>
          {items.map((item) => (
            <WorkRow
              key={item.id}
              title={item.title}
              meta={`${item.module} · ${item.cohort} · Due ${item.due} · Max ${item.maxScore}`}
              status={
                <StatusLabel
                  tone={item.status === "Published" ? "success" : "attention"}
                >
                  {item.status}
                </StatusLabel>
              }
              action={
                item.status !== "Published" ? (
                  <Button
                    size="sm"
                    onClick={() => {
                      setItems((prev) =>
                        prev.map((row) =>
                          row.id === item.id
                            ? { ...row, status: "Published" }
                            : row
                        )
                      )
                      toast.success("Published")
                    }}
                  >
                    Publish
                  </Button>
                ) : (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => toast.message(`Editing ${item.title}`)}
                  >
                    Edit brief
                  </Button>
                )
              }
            >
              <p className="text-sm text-muted-foreground">{item.brief}</p>
            </WorkRow>
          ))}
        </WorkList>
      </div>
    </div>
  )
}
