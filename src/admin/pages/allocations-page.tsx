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
  mentorshipAllocations as seedAllocations,
  mentorProfiles,
  type MentorshipAllocation,
} from "@/shared/data/mock-mentorship"
import { NextMove, SectionLabel } from "@/shared/components/next-move"
import { PageIntro } from "@/shared/components/page-intro"
import {
  HonestProgress,
  StatusLabel,
  WorkList,
  WorkRow,
} from "@/shared/components/work-row"

export function AdminAllocationsPage() {
  const [allocations, setAllocations] =
    React.useState<MentorshipAllocation[]>(seedAllocations)
  const [mentorId, setMentorId] = React.useState(mentorProfiles[0]?.id ?? "")
  const [participantName, setParticipantName] = React.useState("")
  const [focusArea, setFocusArea] = React.useState("")
  const [showForm, setShowForm] = React.useState(false)

  function allocate() {
    const mentor = mentorProfiles.find((item) => item.id === mentorId)
    if (!mentor || !participantName.trim() || !focusArea.trim()) {
      toast.error("Select a mentor and fill participant + focus area")
      return
    }
    if (mentor.allocated >= mentor.capacity) {
      toast.error("That mentor is at capacity")
      return
    }

    const next: MentorshipAllocation = {
      id: `alloc-${Date.now()}`,
      mentorId: mentor.id,
      mentorName: mentor.name,
      participantId: `participant-${Date.now()}`,
      participantName: participantName.trim(),
      organization: "Pending profile",
      focusArea: focusArea.trim(),
      startDate: "Today",
      status: "Active",
    }
    setAllocations((prev) => [next, ...prev])
    setParticipantName("")
    setFocusArea("")
    setShowForm(false)
    toast.success("Mentor allocated")
  }

  return (
    <div className="flex flex-col gap-8">
      <PageIntro
        eyebrow="Mentor ↔ participant"
        title="Match people on purpose, not leftover capacity"
        description="Every allocation needs a focus area. Capacity bars stop overloading mentors."
        action={
          <Button size="lg" onClick={() => setShowForm((v) => !v)}>
            {showForm ? "Close" : "New allocation"}
          </Button>
        }
      />

      <NextMove
        title="Keep the matching story clean"
        detail="Investor and buyer intros stay in Matchmaking. Mentors live only here."
        cta="View mentor directory"
        to="/admin/mentors"
      />

      <div className="grid gap-3 sm:grid-cols-3">
        {mentorProfiles.map((mentor) => (
          <div
            key={mentor.id}
            className="rounded-xl border border-foreground/10 bg-card/70 p-4"
          >
            <p className="font-heading text-base font-medium">{mentor.name}</p>
            <div className="mt-3">
              <HonestProgress
                label="Allocated"
                value={mentor.allocated}
                max={mentor.capacity}
              />
            </div>
          </div>
        ))}
      </div>

      {showForm ? (
        <div className="rounded-xl border border-foreground/10 bg-card/80 p-5">
          <SectionLabel>Allocate mentor</SectionLabel>
          <FieldGroup className="mt-4 grid gap-4 sm:grid-cols-3">
            <Field>
              <FieldLabel htmlFor="alloc-mentor">Mentor ID</FieldLabel>
              <Input
                id="alloc-mentor"
                value={mentorId}
                onChange={(event) => setMentorId(event.target.value)}
                list="mentor-ids"
              />
              <datalist id="mentor-ids">
                {mentorProfiles.map((mentor) => (
                  <option key={mentor.id} value={mentor.id}>
                    {mentor.name}
                  </option>
                ))}
              </datalist>
            </Field>
            <Field>
              <FieldLabel htmlFor="alloc-participant">Participant</FieldLabel>
              <Input
                id="alloc-participant"
                value={participantName}
                onChange={(event) => setParticipantName(event.target.value)}
              />
            </Field>
            <Field>
              <FieldLabel htmlFor="alloc-focus">Focus area</FieldLabel>
              <Input
                id="alloc-focus"
                value={focusArea}
                onChange={(event) => setFocusArea(event.target.value)}
              />
            </Field>
          </FieldGroup>
          <Button className="mt-4" onClick={allocate}>
            Allocate
          </Button>
        </div>
      ) : null}

      <div className="space-y-3">
        <SectionLabel>Active allocations</SectionLabel>
        <WorkList>
          {allocations.map((item) => (
            <WorkRow
              key={item.id}
              title={`${item.mentorName} → ${item.participantName}`}
              meta={`${item.organization} · ${item.focusArea} · since ${item.startDate}`}
              status={<StatusLabel tone="primary">{item.status}</StatusLabel>}
              action={
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => {
                    setAllocations((prev) =>
                      prev.map((row) =>
                        row.id === item.id
                          ? {
                              ...row,
                              status:
                                row.status === "Active" ? "Paused" : "Active",
                            }
                          : row
                      )
                    )
                    toast.success("Allocation updated")
                  }}
                >
                  Toggle pause
                </Button>
              }
            />
          ))}
        </WorkList>
      </div>
    </div>
  )
}
