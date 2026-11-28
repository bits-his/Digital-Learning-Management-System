import * as React from "react"
import { Link } from "react-router-dom"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSet,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import { Textarea } from "@/components/ui/textarea"
import { FormSelect } from "@/applicant/components/form-select"
import { useAuth } from "@/shared/auth/auth-context"
import { PageLayout } from "@/shared/components/page-layout"
import { SectionLabel } from "@/shared/components/next-move"
import { StatusLabel } from "@/shared/components/work-row"
import {
  computeReadinessScore,
  getEnterpriseByParticipant,
  loadReadinessItems,
} from "@/shared/data/mock-matchmaking"
import {
  EMPLOYEE_OPTIONS,
  EXPORT_OPTIONS,
  PRIMARY_NEED_OPTIONS,
  ROLE_OPTIONS,
  SECTOR_OPTIONS,
  STAGE_OPTIONS,
} from "@/shared/data/applications/types"

const PROFILE_KEY = "aaiiri-participant-profile"

type ProfileForm = {
  fullName: string
  email: string
  phone: string
  country: string
  city: string
  roleTitle: string
  businessName: string
  sector: string
  stage: string
  yearFounded: string
  employees: string
  offering: string
  traction: string
  targetMarkets: string
  fundingAsk: string
  exportExperience: string
  primaryNeed: string
  shareWithMentors: boolean
  shareWithPartners: boolean
}

function loadProfile(defaults: ProfileForm): ProfileForm {
  try {
    const raw = localStorage.getItem(PROFILE_KEY)
    if (!raw) return defaults
    return { ...defaults, ...(JSON.parse(raw) as Partial<ProfileForm>) }
  } catch {
    return defaults
  }
}

export function ParticipantProfilePage() {
  const { user } = useAuth()
  const participantId = user?.id ?? "participant-1"
  const enterprise = getEnterpriseByParticipant(participantId)
  const readiness = computeReadinessScore(loadReadinessItems(participantId))

  const defaults = React.useMemo<ProfileForm>(
    () => ({
      fullName: user?.name ?? enterprise?.founderName ?? "",
      email: user?.email ?? "",
      phone: "+234 800 000 0000",
      country: enterprise?.country ?? "Nigeria",
      city: "Lagos",
      roleTitle: user?.title ?? "Founder",
      businessName: enterprise?.businessName ?? user?.organization ?? "",
      sector: enterprise?.sector ?? "Agriculture",
      stage: enterprise?.stage ?? "Growth",
      yearFounded: "2020",
      employees: "6–20",
      offering: enterprise?.offering ?? "",
      traction: enterprise?.traction ?? "",
      targetMarkets: "ECOWAS, USA (AGOA)",
      fundingAsk: enterprise?.ask ?? "",
      exportExperience: enterprise?.exportReady
        ? "Currently exporting"
        : "Exploring export",
      primaryNeed: "Investment readiness",
      shareWithMentors: true,
      shareWithPartners: false,
    }),
    [enterprise, user]
  )

  const [form, setForm] = React.useState<ProfileForm>(() =>
    loadProfile(defaults)
  )

  React.useEffect(() => {
    setForm(loadProfile(defaults))
  }, [defaults])

  function update<K extends keyof ProfileForm>(key: K, value: ProfileForm[K]) {
    setForm((prev) => ({ ...prev, [key]: value }))
  }

  function handleSave(event: React.FormEvent) {
    event.preventDefault()
    localStorage.setItem(PROFILE_KEY, JSON.stringify(form))
    toast.success("Profile saved")
  }

  return (
    <PageLayout variant="bare">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-muted-foreground">
          Contact details and venture story for mentorship and matchmaking.
        </p>
        <div className="flex flex-wrap gap-2">
          <StatusLabel tone={readiness >= 75 ? "success" : "attention"}>
            Readiness {readiness}/100
          </StatusLabel>
          <Button asChild size="sm" variant="outline">
            <Link to="/participant/readiness">View readiness</Link>
          </Button>
        </div>
      </div>

      <form onSubmit={handleSave} className="flex flex-col gap-8">
        <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_280px]">
          <div className="flex flex-col gap-8">
            <FieldSet>
              <FieldLegend variant="label">Personal details</FieldLegend>
              <FieldGroup>
                <div className="grid gap-5 sm:grid-cols-2">
                  <Field>
                    <FieldLabel htmlFor="fullName">Full name</FieldLabel>
                    <Input
                      id="fullName"
                      className="h-11"
                      value={form.fullName}
                      onChange={(e) => update("fullName", e.target.value)}
                    />
                  </Field>
                  <Field>
                    <FieldLabel htmlFor="roleTitle">Role</FieldLabel>
                    <FormSelect
                      id="roleTitle"
                      value={form.roleTitle}
                      placeholder="Select role"
                      options={ROLE_OPTIONS}
                      onValueChange={(value) => update("roleTitle", value)}
                    />
                  </Field>
                  <Field>
                    <FieldLabel htmlFor="email">Email</FieldLabel>
                    <Input
                      id="email"
                      type="email"
                      className="h-11"
                      value={form.email}
                      onChange={(e) => update("email", e.target.value)}
                    />
                  </Field>
                  <Field>
                    <FieldLabel htmlFor="phone">Phone / WhatsApp</FieldLabel>
                    <Input
                      id="phone"
                      className="h-11"
                      value={form.phone}
                      onChange={(e) => update("phone", e.target.value)}
                    />
                  </Field>
                  <Field>
                    <FieldLabel htmlFor="country">Country</FieldLabel>
                    <Input
                      id="country"
                      className="h-11"
                      value={form.country}
                      onChange={(e) => update("country", e.target.value)}
                    />
                  </Field>
                  <Field>
                    <FieldLabel htmlFor="city">City</FieldLabel>
                    <Input
                      id="city"
                      className="h-11"
                      value={form.city}
                      onChange={(e) => update("city", e.target.value)}
                    />
                  </Field>
                </div>
              </FieldGroup>
            </FieldSet>

            <Separator />

            <FieldSet>
              <FieldLegend variant="label">Business profile</FieldLegend>
              <FieldGroup>
                <div className="grid gap-5 sm:grid-cols-2">
                  <Field className="sm:col-span-2">
                    <FieldLabel htmlFor="businessName">Business name</FieldLabel>
                    <Input
                      id="businessName"
                      className="h-11"
                      value={form.businessName}
                      onChange={(e) => update("businessName", e.target.value)}
                    />
                  </Field>
                  <Field>
                    <FieldLabel htmlFor="sector">Sector</FieldLabel>
                    <FormSelect
                      id="sector"
                      value={
                        SECTOR_OPTIONS.includes(
                          form.sector as (typeof SECTOR_OPTIONS)[number]
                        )
                          ? form.sector
                          : "Other"
                      }
                      placeholder="Select sector"
                      options={SECTOR_OPTIONS}
                      onValueChange={(value) => update("sector", value)}
                    />
                  </Field>
                  <Field>
                    <FieldLabel htmlFor="stage">Stage</FieldLabel>
                    <FormSelect
                      id="stage"
                      value={
                        STAGE_OPTIONS.includes(
                          form.stage as (typeof STAGE_OPTIONS)[number]
                        )
                          ? form.stage
                          : "Growth"
                      }
                      placeholder="Select stage"
                      options={STAGE_OPTIONS}
                      onValueChange={(value) => update("stage", value)}
                    />
                  </Field>
                  <Field>
                    <FieldLabel htmlFor="yearFounded">Year founded</FieldLabel>
                    <Input
                      id="yearFounded"
                      className="h-11"
                      value={form.yearFounded}
                      onChange={(e) => update("yearFounded", e.target.value)}
                    />
                  </Field>
                  <Field>
                    <FieldLabel htmlFor="employees">Team size</FieldLabel>
                    <FormSelect
                      id="employees"
                      value={form.employees}
                      placeholder="Select range"
                      options={EMPLOYEE_OPTIONS}
                      onValueChange={(value) => update("employees", value)}
                    />
                  </Field>
                  <Field>
                    <FieldLabel htmlFor="exportExperience">
                      Export experience
                    </FieldLabel>
                    <FormSelect
                      id="exportExperience"
                      value={form.exportExperience}
                      placeholder="Select experience"
                      options={EXPORT_OPTIONS}
                      onValueChange={(value) =>
                        update("exportExperience", value)
                      }
                    />
                  </Field>
                  <Field>
                    <FieldLabel htmlFor="primaryNeed">
                      Primary Bootcamp need
                    </FieldLabel>
                    <FormSelect
                      id="primaryNeed"
                      value={form.primaryNeed}
                      placeholder="Select need"
                      options={PRIMARY_NEED_OPTIONS}
                      onValueChange={(value) => update("primaryNeed", value)}
                    />
                  </Field>
                  <Field className="sm:col-span-2">
                    <FieldLabel htmlFor="offering">
                      Products / services
                    </FieldLabel>
                    <Textarea
                      id="offering"
                      className="min-h-24"
                      value={form.offering}
                      onChange={(e) => update("offering", e.target.value)}
                    />
                  </Field>
                  <Field className="sm:col-span-2">
                    <FieldLabel htmlFor="traction">Traction</FieldLabel>
                    <Textarea
                      id="traction"
                      className="min-h-20"
                      value={form.traction}
                      onChange={(e) => update("traction", e.target.value)}
                    />
                    <FieldDescription>
                      Buyers, revenue, pilots, or other proof points.
                    </FieldDescription>
                  </Field>
                  <Field>
                    <FieldLabel htmlFor="targetMarkets">
                      Target markets
                    </FieldLabel>
                    <Input
                      id="targetMarkets"
                      className="h-11"
                      value={form.targetMarkets}
                      onChange={(e) => update("targetMarkets", e.target.value)}
                    />
                  </Field>
                  <Field>
                    <FieldLabel htmlFor="fundingAsk">
                      Funding / partnership ask
                    </FieldLabel>
                    <Input
                      id="fundingAsk"
                      className="h-11"
                      value={form.fundingAsk}
                      onChange={(e) => update("fundingAsk", e.target.value)}
                    />
                  </Field>
                </div>
              </FieldGroup>
            </FieldSet>

            <Separator />

            <FieldSet>
              <FieldLegend variant="label">Sharing & consent</FieldLegend>
              <FieldGroup>
                <label className="flex cursor-pointer items-start gap-3 rounded-lg border border-foreground/10 p-4">
                  <input
                    type="checkbox"
                    className="mt-1 size-4 accent-primary"
                    checked={form.shareWithMentors}
                    onChange={(e) =>
                      update("shareWithMentors", e.target.checked)
                    }
                  />
                  <span>
                    <span className="font-medium">Share with my mentor</span>
                    <span className="mt-0.5 block text-sm text-muted-foreground">
                      Mentor can see your venture summary to coach you better.
                    </span>
                  </span>
                </label>
                <label className="flex cursor-pointer items-start gap-3 rounded-lg border border-foreground/10 p-4">
                  <input
                    type="checkbox"
                    className="mt-1 size-4 accent-primary"
                    checked={form.shareWithPartners}
                    onChange={(e) =>
                      update("shareWithPartners", e.target.checked)
                    }
                  />
                  <span>
                    <span className="font-medium">
                      Share with investors & buyers
                    </span>
                    <span className="mt-0.5 block text-sm text-muted-foreground">
                      Only after readiness unlocks and you request an intro.
                    </span>
                  </span>
                </label>
              </FieldGroup>
            </FieldSet>

            <div className="flex flex-wrap gap-3">
              <Button type="submit" size="lg" className="h-11 px-6">
                Save profile
              </Button>
              <Button asChild type="button" size="lg" variant="outline" className="h-11">
                <Link to="/participant/opportunities">View opportunities</Link>
              </Button>
            </div>
          </div>

          <aside className="flex h-fit flex-col gap-4 lg:sticky lg:top-24">
            <div className="rounded-xl border border-foreground/10 bg-card/70 p-4">
              <SectionLabel>Account</SectionLabel>
              <dl className="mt-3 space-y-3 text-sm">
                <div>
                  <dt className="text-muted-foreground">Signed in as</dt>
                  <dd className="font-medium">{user?.email}</dd>
                </div>
                <div>
                  <dt className="text-muted-foreground">Role</dt>
                  <dd className="font-medium capitalize">{user?.role}</dd>
                </div>
                <div>
                  <dt className="text-muted-foreground">Organization</dt>
                  <dd className="font-medium">
                    {form.businessName || user?.organization || "—"}
                  </dd>
                </div>
              </dl>
            </div>

            <div className="rounded-xl border border-foreground/10 bg-card/70 p-4">
              <SectionLabel>Programme links</SectionLabel>
              <div className="mt-3 flex flex-col gap-2">
                <Button asChild variant="outline" size="sm" className="justify-start">
                  <Link to="/participant/mentorship">Mentorship</Link>
                </Button>
                <Button asChild variant="outline" size="sm" className="justify-start">
                  <Link to="/participant/readiness">Readiness checklist</Link>
                </Button>
                <Button asChild variant="outline" size="sm" className="justify-start">
                  <Link to="/participant/certificates">Certificates</Link>
                </Button>
              </div>
            </div>
          </aside>
        </div>
      </form>
    </PageLayout>
  )
}
