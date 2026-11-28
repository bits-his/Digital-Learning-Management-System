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
  mentorProfiles as seedMentors,
  type MentorProfile,
} from "@/shared/data/mock-mentorship"
import { NextMove, SectionLabel } from "@/shared/components/next-move"
import { PageLayout } from "@/shared/components/page-layout"
import {
  HonestProgress,
  StatusLabel,
  WorkList,
  WorkRow,
} from "@/shared/components/work-row"

export function AdminMentorsPage() {
  const [mentors, setMentors] = React.useState<MentorProfile[]>(seedMentors)
  const [name, setName] = React.useState("")
  const [email, setEmail] = React.useState("")
  const [expertise, setExpertise] = React.useState("")
  const [showCreate, setShowCreate] = React.useState(false)

  const openCapacity = mentors.filter(
    (mentor) =>
      mentor.status === "Active" && mentor.allocated < mentor.capacity
  )

  function addMentor() {
    if (!name.trim() || !email.trim()) {
      toast.error("Name and email are required")
      return
    }

    const next: MentorProfile = {
      id: `mentor-profile-${Date.now()}`,
      userId: `mentor-${Date.now()}`,
      name: name.trim(),
      email: email.trim(),
      title: "Mentor",
      organization: "AAIIRI Network",
      expertise: expertise
        .split(",")
        .map((part) => part.trim())
        .filter(Boolean),
      capacity: 3,
      allocated: 0,
      bio: "New mentor profile pending onboarding.",
      status: "Active",
    }
    setMentors((prev) => [next, ...prev])
    setName("")
    setEmail("")
    setExpertise("")
    setShowCreate(false)
    toast.success("Mentor profile created")
  }

  return (
    <PageLayout variant="bare">
      <div className="flex flex-wrap items-center justify-end gap-2">
        <Button size="lg" onClick={() => setShowCreate((v) => !v)}>
            {showCreate ? "Close" : "Add mentor"}
          </Button>
      </div>

      <NextMove
        label="Capacity left"
        title={`${openCapacity.length} mentor${openCapacity.length === 1 ? "" : "s"} can take more mentees`}
        detail="Allocate from Mentorship → Allocations once the match makes sense."
        cta="Go to allocations"
        to="/admin/allocations"
      />

      {showCreate ? (
        <div className="rounded-xl border border-foreground/10 bg-card/80 p-5">
          <SectionLabel>New mentor profile</SectionLabel>
          <FieldGroup className="mt-4 grid gap-4 sm:grid-cols-3">
            <Field>
              <FieldLabel htmlFor="mentor-name">Name</FieldLabel>
              <Input
                id="mentor-name"
                value={name}
                onChange={(event) => setName(event.target.value)}
              />
            </Field>
            <Field>
              <FieldLabel htmlFor="mentor-email">Email</FieldLabel>
              <Input
                id="mentor-email"
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
              />
            </Field>
            <Field>
              <FieldLabel htmlFor="mentor-expertise">Expertise</FieldLabel>
              <Input
                id="mentor-expertise"
                value={expertise}
                onChange={(event) => setExpertise(event.target.value)}
                placeholder="Pitch, Export, Finance"
              />
            </Field>
          </FieldGroup>
          <Button className="mt-4" onClick={addMentor}>
            Create profile
          </Button>
        </div>
      ) : null}

      <div className="space-y-3">
        <SectionLabel>Mentor directory</SectionLabel>
        <WorkList>
          {mentors.map((mentor) => (
            <WorkRow
              key={mentor.id}
              title={mentor.name}
              meta={`${mentor.title} · ${mentor.organization} · ${mentor.email}`}
              status={
                <StatusLabel
                  tone={mentor.status === "Active" ? "success" : "neutral"}
                >
                  {mentor.status}
                </StatusLabel>
              }
              action={
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => {
                    setMentors((prev) =>
                      prev.map((row) =>
                        row.id === mentor.id
                          ? {
                              ...row,
                              status:
                                row.status === "Active" ? "Inactive" : "Active",
                            }
                          : row
                      )
                    )
                    toast.success("Status updated")
                  }}
                >
                  Toggle status
                </Button>
              }
            >
              <p className="text-sm text-muted-foreground">{mentor.bio}</p>
              <HonestProgress
                label="Capacity used"
                value={mentor.allocated}
                max={mentor.capacity}
              />
              <p className="text-xs text-muted-foreground">
                {mentor.expertise.join(" · ") || "No expertise listed"}
              </p>
            </WorkRow>
          ))}
        </WorkList>
      </div>
    </PageLayout>
  )
}
