import * as React from "react"
import { useNavigate } from "react-router-dom"
import { toast } from "sonner"

import {
  ApplicationStepper,
  type StepItem,
} from "@/applicant/components/application-stepper"
import { FileDropzone } from "@/applicant/components/file-dropzone"
import { FormSelect } from "@/applicant/components/form-select"
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
import { useAuth } from "@/shared/auth/auth-context"
import { useApplications } from "@/shared/data/applications/applications-context"
import {
  DOCUMENT_HINTS,
  DOCUMENT_LABELS,
  REQUIRED_DOCUMENTS,
  hasAllDocuments,
  isBusinessComplete,
  isPersonalComplete,
} from "@/shared/data/applications/gamification"
import type {
  BusinessProfile,
  DocumentType,
  PersonalDetails,
} from "@/shared/data/applications/types"
import {
  EMPLOYEE_OPTIONS,
  EXPORT_OPTIONS,
  PRIMARY_NEED_OPTIONS,
  REGISTRATION_OPTIONS,
  ROLE_OPTIONS,
  SECTOR_OPTIONS,
  STAGE_OPTIONS,
  emptyBusiness,
  emptyPersonal,
} from "@/shared/data/applications/types"

const steps: StepItem[] = [
  { id: "personal", label: "Personal", description: "Applicant details" },
  { id: "business", label: "Business", description: "Venture profile" },
  { id: "documents", label: "Documents", description: "Evidence pack" },
  { id: "review", label: "Review", description: "Confirm & submit" },
]

function sizeLabelFor(file: File) {
  return file.size > 1024 * 1024
    ? `${(file.size / (1024 * 1024)).toFixed(1)} MB`
    : `${Math.max(1, Math.round(file.size / 1024))} KB`
}

export function ApplicantFormPage() {
  const { user } = useAuth()
  const {
    getByApplicant,
    ensureDraftForApplicant,
    updatePersonal,
    updateBusiness,
    uploadDocument,
    removeDocument,
    submitApplication,
  } = useApplications()
  const navigate = useNavigate()
  const [step, setStep] = React.useState(0)

  React.useEffect(() => {
    if (!user) return
    if (getByApplicant(user.id)) return
    ensureDraftForApplicant({
      userId: user.id,
      personal: {
        ...emptyPersonal(),
        fullName: user.name,
        email: user.email,
      },
    })
  }, [ensureDraftForApplicant, getByApplicant, user])

  const liveApp = user ? getByApplicant(user.id) : undefined

  const [personal, setPersonal] = React.useState<PersonalDetails>({
    ...emptyPersonal(),
    fullName: user?.name ?? "",
    email: user?.email ?? "",
  })
  const [business, setBusiness] = React.useState<BusinessProfile>(emptyBusiness())

  React.useEffect(() => {
    if (!liveApp) return
    setPersonal(liveApp.personal)
    setBusiness(liveApp.business)
  }, [liveApp?.id])

  if (!user || !liveApp) {
    return null
  }

  const app = liveApp

  const completed = [
    isPersonalComplete(app.personal),
    isBusinessComplete(app.business),
    hasAllDocuments(app.documents),
    app.status !== "draft",
  ]

  function savePersonal() {
    updatePersonal(app.id, personal)
    if (!isPersonalComplete(personal)) {
      toast.error("Please complete all required personal fields.")
      return
    }
    setStep(1)
  }

  function saveBusiness() {
    updateBusiness(app.id, business)
    if (!isBusinessComplete(business)) {
      toast.error("Please complete all required business fields.")
      return
    }
    setStep(2)
  }

  function handleUpload(type: DocumentType, file: File) {
    uploadDocument(app.id, type, file.name, sizeLabelFor(file))
  }

  function handleSubmit() {
    const result = submitApplication(app.id)
    if (!result.ok) {
      toast.error(result.message)
      return
    }
    navigate("/apply/status")
  }

  return (
    <div className="mx-auto flex w-full max-w-3xl flex-col gap-8">
      <div className="flex flex-col gap-2">
        <p className="text-sm font-medium tracking-wide text-muted-foreground uppercase">
          Bootcamp application
        </p>
        <h1 className="font-heading text-3xl font-semibold tracking-tight">
          Complete your application
        </h1>
        <p className="text-muted-foreground">
          About 10–15 minutes. Progress is saved after each step.
        </p>
      </div>

      <ApplicationStepper
        steps={steps}
        current={step}
        completed={completed}
        onStepClick={setStep}
      />

      <Separator />

      {step === 0 ? (
        <section className="flex flex-col gap-8">
          <div>
            <h2 className="font-heading text-xl font-semibold">
              1. Applicant details
            </h2>
            <p className="text-sm text-muted-foreground">
              Who is applying, and how should AAIIRI contact you?
            </p>
          </div>

          <FieldSet>
            <FieldLegend variant="label">Identity & contact</FieldLegend>
            <FieldGroup>
              <Field>
                <FieldLabel htmlFor="fullName">Full name</FieldLabel>
                <Input
                  id="fullName"
                  className="h-11 px-3 text-base md:text-base"
                  value={personal.fullName}
                  onChange={(e) =>
                    setPersonal((p) => ({ ...p, fullName: e.target.value }))
                  }
                />
              </Field>
              <div className="grid gap-5 sm:grid-cols-2">
                <Field>
                  <FieldLabel htmlFor="email">Email</FieldLabel>
                  <Input
                    id="email"
                    type="email"
                    className="h-11 px-3 text-base md:text-base"
                    value={personal.email}
                    onChange={(e) =>
                      setPersonal((p) => ({ ...p, email: e.target.value }))
                    }
                  />
                </Field>
                <Field>
                  <FieldLabel htmlFor="phone">Phone (WhatsApp preferred)</FieldLabel>
                  <Input
                    id="phone"
                    className="h-11 px-3 text-base md:text-base"
                    value={personal.phone}
                    onChange={(e) =>
                      setPersonal((p) => ({ ...p, phone: e.target.value }))
                    }
                  />
                </Field>
              </div>
            </FieldGroup>
          </FieldSet>

          <FieldSet>
            <FieldLegend variant="label">Location & role</FieldLegend>
            <FieldGroup>
              <div className="grid gap-5 sm:grid-cols-2">
                <Field>
                  <FieldLabel htmlFor="pCountry">Country of residence</FieldLabel>
                  <Input
                    id="pCountry"
                    className="h-11 px-3 text-base md:text-base"
                    value={personal.country}
                    onChange={(e) =>
                      setPersonal((p) => ({ ...p, country: e.target.value }))
                    }
                  />
                </Field>
                <Field>
                  <FieldLabel htmlFor="city">City</FieldLabel>
                  <Input
                    id="city"
                    className="h-11 px-3 text-base md:text-base"
                    value={personal.city}
                    onChange={(e) =>
                      setPersonal((p) => ({ ...p, city: e.target.value }))
                    }
                  />
                </Field>
              </div>
              <Field>
                <FieldLabel htmlFor="roleTitle">Role in the business</FieldLabel>
                <FormSelect
                  id="roleTitle"
                  value={personal.roleTitle}
                  placeholder="Select your role"
                  options={ROLE_OPTIONS}
                  onValueChange={(value) =>
                    setPersonal((p) => ({ ...p, roleTitle: value }))
                  }
                />
              </Field>
            </FieldGroup>
          </FieldSet>

          <div className="flex justify-end">
            <Button size="lg" className="h-11 px-6" onClick={savePersonal}>
              Save and continue
            </Button>
          </div>
        </section>
      ) : null}

      {step === 1 ? (
        <section className="flex flex-col gap-8">
          <div>
            <h2 className="font-heading text-xl font-semibold">
              2. Business / startup profile
            </h2>
            <p className="text-sm text-muted-foreground">
              Structured details used for screening and matchmaking readiness.
            </p>
          </div>

          <FieldSet>
            <FieldLegend variant="label">Venture basics</FieldLegend>
            <FieldGroup>
              <Field>
                <FieldLabel htmlFor="businessName">Business name</FieldLabel>
                <Input
                  id="businessName"
                  className="h-11 px-3 text-base md:text-base"
                  value={business.businessName}
                  onChange={(e) =>
                    setBusiness((b) => ({
                      ...b,
                      businessName: e.target.value,
                    }))
                  }
                />
              </Field>
              <div className="grid gap-5 sm:grid-cols-2">
                <Field>
                  <FieldLabel htmlFor="registrationStatus">
                    Registration status
                  </FieldLabel>
                  <FormSelect
                    id="registrationStatus"
                    value={business.registrationStatus}
                    placeholder="Select status"
                    options={REGISTRATION_OPTIONS}
                    onValueChange={(value) =>
                      setBusiness((b) => ({
                        ...b,
                        registrationStatus: value,
                      }))
                    }
                  />
                </Field>
                <Field>
                  <FieldLabel htmlFor="sector">Sector</FieldLabel>
                  <FormSelect
                    id="sector"
                    value={business.sector}
                    placeholder="Select sector"
                    options={SECTOR_OPTIONS}
                    onValueChange={(value) =>
                      setBusiness((b) => ({ ...b, sector: value }))
                    }
                  />
                </Field>
                <Field>
                  <FieldLabel htmlFor="bCountry">Country of operation</FieldLabel>
                  <Input
                    id="bCountry"
                    className="h-11 px-3 text-base md:text-base"
                    value={business.country}
                    onChange={(e) =>
                      setBusiness((b) => ({ ...b, country: e.target.value }))
                    }
                  />
                </Field>
                <Field>
                  <FieldLabel htmlFor="yearFounded">Year founded</FieldLabel>
                  <Input
                    id="yearFounded"
                    className="h-11 px-3 text-base md:text-base"
                    placeholder="e.g. 2021"
                    value={business.yearFounded}
                    onChange={(e) =>
                      setBusiness((b) => ({
                        ...b,
                        yearFounded: e.target.value,
                      }))
                    }
                  />
                </Field>
              </div>
            </FieldGroup>
          </FieldSet>

          <FieldSet>
            <FieldLegend variant="label">Scale & readiness</FieldLegend>
            <FieldGroup>
              <div className="grid gap-5 sm:grid-cols-2">
                <Field>
                  <FieldLabel htmlFor="stage">Business stage</FieldLabel>
                  <FormSelect
                    id="stage"
                    value={business.stage}
                    placeholder="Select stage"
                    options={STAGE_OPTIONS}
                    onValueChange={(value) =>
                      setBusiness((b) => ({ ...b, stage: value }))
                    }
                  />
                </Field>
                <Field>
                  <FieldLabel htmlFor="employees">Team size</FieldLabel>
                  <FormSelect
                    id="employees"
                    value={business.employees}
                    placeholder="Select range"
                    options={EMPLOYEE_OPTIONS}
                    onValueChange={(value) =>
                      setBusiness((b) => ({ ...b, employees: value }))
                    }
                  />
                </Field>
                <Field>
                  <FieldLabel htmlFor="exportExperience">
                    Export experience
                  </FieldLabel>
                  <FormSelect
                    id="exportExperience"
                    value={business.exportExperience}
                    placeholder="Select experience"
                    options={EXPORT_OPTIONS}
                    onValueChange={(value) =>
                      setBusiness((b) => ({
                        ...b,
                        exportExperience: value,
                      }))
                    }
                  />
                </Field>
                <Field>
                  <FieldLabel htmlFor="primaryNeed">
                    Primary Bootcamp need
                  </FieldLabel>
                  <FormSelect
                    id="primaryNeed"
                    value={business.primaryNeed}
                    placeholder="What do you need most?"
                    options={PRIMARY_NEED_OPTIONS}
                    onValueChange={(value) =>
                      setBusiness((b) => ({ ...b, primaryNeed: value }))
                    }
                  />
                </Field>
              </div>
              <Field>
                <FieldLabel htmlFor="targetMarkets">Target markets</FieldLabel>
                <Input
                  id="targetMarkets"
                  className="h-11 px-3 text-base md:text-base"
                  placeholder="e.g. ECOWAS, USA (AGOA), EU"
                  value={business.targetMarkets}
                  onChange={(e) =>
                    setBusiness((b) => ({
                      ...b,
                      targetMarkets: e.target.value,
                    }))
                  }
                />
                <FieldDescription>
                  Regions or countries you want to sell into.
                </FieldDescription>
              </Field>
              <Field>
                <FieldLabel htmlFor="fundingNeed">
                  Funding / investment ask
                </FieldLabel>
                <Input
                  id="fundingNeed"
                  className="h-11 px-3 text-base md:text-base"
                  placeholder="e.g. USD 150,000 or Not seeking capital yet"
                  value={business.fundingNeed}
                  onChange={(e) =>
                    setBusiness((b) => ({
                      ...b,
                      fundingNeed: e.target.value,
                    }))
                  }
                />
              </Field>
            </FieldGroup>
          </FieldSet>

          <FieldSet>
            <FieldLegend variant="label">About the venture</FieldLegend>
            <FieldGroup>
              <Field>
                <FieldLabel htmlFor="description">
                  Products / services summary
                </FieldLabel>
                <Textarea
                  id="description"
                  className="min-h-28 px-3 text-base md:text-base"
                  placeholder="What do you sell or produce, and who buys it today?"
                  value={business.description}
                  onChange={(e) =>
                    setBusiness((b) => ({
                      ...b,
                      description: e.target.value,
                    }))
                  }
                />
              </Field>
            </FieldGroup>
          </FieldSet>

          <div className="flex justify-between gap-3">
            <Button
              size="lg"
              variant="outline"
              className="h-11"
              onClick={() => setStep(0)}
            >
              Back
            </Button>
            <Button size="lg" className="h-11 px-6" onClick={saveBusiness}>
              Save and continue
            </Button>
          </div>
        </section>
      ) : null}

      {step === 2 ? (
        <section className="flex flex-col gap-8">
          <div>
            <h2 className="font-heading text-xl font-semibold">
              3. Supporting documents
            </h2>
            <p className="text-sm text-muted-foreground">
              Upload clear files. You can replace any document before
              submission.
            </p>
          </div>
          <div className="flex flex-col gap-5">
            {REQUIRED_DOCUMENTS.map((type) => {
              const existing = app.documents.find((d) => d.type === type)
              return (
                <FileDropzone
                  key={type}
                  label={DOCUMENT_LABELS[type]}
                  hint={DOCUMENT_HINTS[type]}
                  fileName={existing?.name}
                  fileMeta={existing?.sizeLabel}
                  onFile={(file) => handleUpload(type, file)}
                  onClear={
                    existing
                      ? () => removeDocument(app.id, existing.id)
                      : undefined
                  }
                />
              )
            })}
          </div>
          <div className="flex justify-between gap-3">
            <Button
              size="lg"
              variant="outline"
              className="h-11"
              onClick={() => setStep(1)}
            >
              Back
            </Button>
            <Button
              size="lg"
              className="h-11 px-6"
              onClick={() => {
                if (!hasAllDocuments(app.documents)) {
                  toast.error("Upload all required documents to continue.")
                  return
                }
                setStep(3)
              }}
            >
              Continue to review
            </Button>
          </div>
        </section>
      ) : null}

      {step === 3 ? (
        <section className="flex flex-col gap-6">
          <div>
            <h2 className="font-heading text-xl font-semibold">
              4. Review and submit
            </h2>
            <p className="text-sm text-muted-foreground">
              Confirm everything looks correct before sending for selection
              review.
            </p>
          </div>
          <div className="flex flex-col gap-5 rounded-xl border bg-muted/30 p-5">
            <div>
              <p className="text-xs tracking-wide text-muted-foreground uppercase">
                Applicant
              </p>
              <p className="mt-1 font-medium">{app.personal.fullName}</p>
              <p className="text-sm text-muted-foreground">
                {app.personal.email} · {app.personal.phone}
              </p>
              <p className="text-sm text-muted-foreground">
                {app.personal.city}, {app.personal.country} ·{" "}
                {app.personal.roleTitle}
              </p>
            </div>
            <Separator />
            <div>
              <p className="text-xs tracking-wide text-muted-foreground uppercase">
                Business
              </p>
              <p className="mt-1 font-medium">
                {app.business.businessName || "—"}
              </p>
              <p className="text-sm text-muted-foreground">
                {app.business.sector} · {app.business.stage} ·{" "}
                {app.business.country}
              </p>
              <p className="mt-2 text-sm text-muted-foreground">
                Need: {app.business.primaryNeed || "—"}
              </p>
              <p className="text-sm text-muted-foreground">
                Markets: {app.business.targetMarkets || "—"}
              </p>
              <p className="text-sm text-muted-foreground">
                Funding ask: {app.business.fundingNeed || "—"}
              </p>
            </div>
            <Separator />
            <div>
              <p className="text-xs tracking-wide text-muted-foreground uppercase">
                Documents
              </p>
              <ul className="mt-2 flex flex-col gap-1 text-sm">
                {REQUIRED_DOCUMENTS.map((type) => {
                  const doc = app.documents.find((d) => d.type === type)
                  return (
                    <li key={type} className="flex justify-between gap-3">
                      <span>{DOCUMENT_LABELS[type]}</span>
                      <span className="text-muted-foreground">
                        {doc ? doc.name : "Missing"}
                      </span>
                    </li>
                  )
                })}
              </ul>
            </div>
          </div>
          <div className="flex justify-between gap-3">
            <Button
              size="lg"
              variant="outline"
              className="h-11"
              onClick={() => setStep(2)}
            >
              Back
            </Button>
            <Button
              size="lg"
              className="h-11 px-6"
              onClick={handleSubmit}
              disabled={app.status !== "draft"}
            >
              {app.status === "draft"
                ? "Submit application"
                : "Already submitted"}
            </Button>
          </div>
        </section>
      ) : null}
    </div>
  )
}
