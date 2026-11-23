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
  partnerProfiles as seedPartners,
  type PartnerProfile,
  type PartnerType,
} from "@/shared/data/mock-matchmaking"
import { NextMove, SectionLabel } from "@/shared/components/next-move"
import { PageIntro } from "@/shared/components/page-intro"
import {
  StatusLabel,
  WorkList,
  WorkRow,
} from "@/shared/components/work-row"

export function AdminPartnersPage() {
  const [partners, setPartners] =
    React.useState<PartnerProfile[]>(seedPartners)
  const [showForm, setShowForm] = React.useState(false)
  const [type, setType] = React.useState<PartnerType>("Investor")
  const [name, setName] = React.useState("")
  const [focus, setFocus] = React.useState("")
  const [filter, setFilter] = React.useState<"All" | PartnerType>("All")

  const visible = partners.filter(
    (item) => filter === "All" || item.type === filter
  )
  const active = partners.filter((item) => item.status === "Active").length

  function addPartner() {
    if (!name.trim()) {
      toast.error("Partner name is required")
      return
    }
    const next: PartnerProfile = {
      id: `partner-${Date.now()}`,
      type,
      name: name.trim(),
      organization: name.trim(),
      focus: focus
        .split(",")
        .map((part) => part.trim())
        .filter(Boolean),
      geographies: ["West Africa"],
      ticketOrVolume: type === "Investor" ? "Cheque TBD" : "Volume TBD",
      thesis: "Newly added commercial partner profile.",
      contactName: "Pending contact",
      email: "partner@example.com",
      status: "Active",
    }
    setPartners((prev) => [next, ...prev])
    setName("")
    setFocus("")
    setShowForm(false)
    toast.success(`${type} profile created`)
  }

  return (
    <div className="flex flex-col gap-8">
      <PageIntro
        eyebrow="Commercial partners"
        title="Investor and buyer profiles"
        description="Who can meet bootcamp enterprises — thesis, geography, and capacity. Mentors live under Mentorship, not here."
        action={
          <Button size="lg" onClick={() => setShowForm((v) => !v)}>
            {showForm ? "Close" : "Add partner"}
          </Button>
        }
      />

      <NextMove
        label="Network health"
        title={`${active} active partners ready for matching`}
        detail="Use recommendations on Matchmaking once enterprises clear readiness."
        cta="Open matchmaking pipeline"
        to="/admin/matchmaking"
      />

      <div className="flex flex-wrap gap-2">
        {(["All", "Investor", "Buyer"] as const).map((item) => (
          <Button
            key={item}
            size="sm"
            variant={filter === item ? "default" : "outline"}
            onClick={() => setFilter(item)}
          >
            {item}
          </Button>
        ))}
      </div>

      {showForm ? (
        <div className="rounded-xl border border-foreground/10 bg-card/80 p-5">
          <SectionLabel>New partner profile</SectionLabel>
          <FieldGroup className="mt-4 grid gap-4 sm:grid-cols-3">
            <Field>
              <FieldLabel>Type</FieldLabel>
              <div className="flex gap-2">
                {(["Investor", "Buyer"] as const).map((item) => (
                  <Button
                    key={item}
                    type="button"
                    size="sm"
                    variant={type === item ? "default" : "outline"}
                    onClick={() => setType(item)}
                  >
                    {item}
                  </Button>
                ))}
              </div>
            </Field>
            <Field>
              <FieldLabel htmlFor="partner-name">Name</FieldLabel>
              <Input
                id="partner-name"
                value={name}
                onChange={(event) => setName(event.target.value)}
              />
            </Field>
            <Field>
              <FieldLabel htmlFor="partner-focus">Focus (comma-separated)</FieldLabel>
              <Input
                id="partner-focus"
                value={focus}
                onChange={(event) => setFocus(event.target.value)}
                placeholder="Agribusiness, Export"
              />
            </Field>
          </FieldGroup>
          <Button className="mt-4" onClick={addPartner}>
            Save profile
          </Button>
        </div>
      ) : null}

      <div className="space-y-3">
        <SectionLabel>Partner directory</SectionLabel>
        <WorkList>
          {visible.map((partner) => (
            <WorkRow
              key={partner.id}
              title={partner.name}
              meta={`${partner.contactName} · ${partner.email} · ${partner.ticketOrVolume}`}
              status={
                <div className="flex flex-wrap gap-2">
                  <StatusLabel tone="primary">{partner.type}</StatusLabel>
                  <StatusLabel
                    tone={partner.status === "Active" ? "success" : "neutral"}
                  >
                    {partner.status}
                  </StatusLabel>
                </div>
              }
              action={
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => {
                    setPartners((prev) =>
                      prev.map((row) =>
                        row.id === partner.id
                          ? {
                              ...row,
                              status:
                                row.status === "Active" ? "Paused" : "Active",
                            }
                          : row
                      )
                    )
                    toast.success("Partner status updated")
                  }}
                >
                  Toggle status
                </Button>
              }
            >
              <p className="text-sm text-muted-foreground">{partner.thesis}</p>
              <p className="text-xs text-muted-foreground">
                Focus: {partner.focus.join(" · ")} · Geo:{" "}
                {partner.geographies.join(" · ")}
              </p>
            </WorkRow>
          ))}
        </WorkList>
      </div>
    </div>
  )
}
