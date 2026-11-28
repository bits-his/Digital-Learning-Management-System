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
  quizzes,
  type AssessmentStatus,
  type Quiz,
} from "@/shared/data/mock-assessment"
import { JourneyRail } from "@/shared/components/journey-rail"
import { NextMove, SectionLabel } from "@/shared/components/next-move"
import { PageLayout } from "@/shared/components/page-layout"
import {
  StatusLabel,
  WorkList,
  WorkRow,
} from "@/shared/components/work-row"

export function AdminAssessmentsPage() {
  const [items, setItems] = React.useState<Quiz[]>(quizzes)
  const [title, setTitle] = React.useState("")
  const [module, setModule] = React.useState("")
  const [showCreate, setShowCreate] = React.useState(false)

  const drafts = items.filter((item) => item.status === "Draft")
  const published = items.filter((item) => item.status === "Published")

  function addQuiz() {
    if (!title.trim()) {
      toast.error("Give the quiz a title learners will recognise")
      return
    }

    const next: Quiz = {
      id: `quiz-${Date.now()}`,
      title: title.trim(),
      module: module.trim() || "General",
      cohort: "Cohort 2027-A",
      status: "Draft",
      durationMinutes: 20,
      passingScore: 70,
      questions: [],
    }
    setItems((prev) => [next, ...prev])
    setTitle("")
    setModule("")
    setShowCreate(false)
    toast.success("Draft saved — publish when questions are ready")
  }

  function setStatus(id: string, status: AssessmentStatus) {
    setItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, status } : item))
    )
    toast.success(
      status === "Published"
        ? "Live for participants"
        : `Marked ${status.toLowerCase()}`
    )
  }

  return (
    <PageLayout variant="bare">
      <div className="flex flex-wrap items-center justify-end gap-2">
        <Button size="lg" onClick={() => setShowCreate((value) => !value)}>
            {showCreate ? "Close form" : "New quiz"}
          </Button>
      </div>

      <JourneyRail
        steps={[
          {
            id: "draft",
            label: "Draft",
            state: drafts.length ? "current" : "done",
          },
          { id: "publish", label: "Publish", state: "upcoming" },
          {
            id: "attempt",
            label: "Learners attempt",
            state: published.length ? "done" : "upcoming",
          },
          { id: "record", label: "On record", state: "upcoming" },
        ]}
      />

      {drafts[0] ? (
        <NextMove
          label="Ready to go live?"
          title={drafts[0].title}
          detail="Drafts stay invisible to participants until you publish."
          cta="Publish this draft"
          onClick={() => setStatus(drafts[0].id, "Published")}
        />
      ) : (
        <NextMove
          label="Catalogue health"
          title={`${published.length} published assessments`}
          detail="Create a new check when a module needs proof of learning."
          cta="Create quiz"
          onClick={() => setShowCreate(true)}
        />
      )}

      {showCreate ? (
        <div className="rounded-xl border border-foreground/10 bg-card/80 p-5 backdrop-blur-sm">
          <SectionLabel>New quiz / exam</SectionLabel>
          <FieldGroup className="mt-4 grid gap-4 sm:grid-cols-2">
            <Field>
              <FieldLabel htmlFor="quiz-title">Title</FieldLabel>
              <Input
                id="quiz-title"
                value={title}
                onChange={(event) => setTitle(event.target.value)}
                placeholder="e.g. Market validation check"
              />
            </Field>
            <Field>
              <FieldLabel htmlFor="quiz-module">Linked module</FieldLabel>
              <Input
                id="quiz-module"
                value={module}
                onChange={(event) => setModule(event.target.value)}
                placeholder="Module name"
              />
            </Field>
          </FieldGroup>
          <Button className="mt-4" onClick={addQuiz}>
            Save draft
          </Button>
        </div>
      ) : null}

      <div className="space-y-3">
        <SectionLabel>Assessment catalogue</SectionLabel>
        <WorkList>
          {items.map((item) => (
            <WorkRow
              key={item.id}
              title={item.title}
              meta={`${item.module} · ${item.cohort} · ${item.durationMinutes} min · pass ${item.passingScore}%`}
              status={
                <StatusLabel
                  tone={
                    item.status === "Published"
                      ? "success"
                      : item.status === "Draft"
                        ? "attention"
                        : "neutral"
                  }
                >
                  {item.status}
                </StatusLabel>
              }
              action={
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() =>
                      toast.message(
                        `${item.questions.length} questions ready in mock data`
                      )
                    }
                  >
                    Questions
                  </Button>
                  {item.status !== "Published" ? (
                    <Button
                      size="sm"
                      onClick={() => setStatus(item.id, "Published")}
                    >
                      Publish
                    </Button>
                  ) : (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setStatus(item.id, "Closed")}
                    >
                      Close
                    </Button>
                  )}
                </div>
              }
            />
          ))}
        </WorkList>
      </div>
    </PageLayout>
  )
}
