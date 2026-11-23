export type ApplicationStatus =
  | "draft"
  | "submitted"
  | "under_review"
  | "shortlisted"
  | "rejected"
  | "waitlisted"
  | "approved"

export type BadgeId =
  | "starter"
  | "founder_profile"
  | "document_ready"
  | "submitted"
  | "selected"

export type DocumentType =
  | "business_registration"
  | "pitch_deck"
  | "financials"
  | "id_document"

export type ApplicationDocument = {
  id: string
  type: DocumentType
  name: string
  sizeLabel: string
  uploadedAt: string
}

export type PersonalDetails = {
  fullName: string
  email: string
  phone: string
  country: string
  city: string
  roleTitle: string
}

export type BusinessProfile = {
  businessName: string
  registrationStatus: string
  sector: string
  country: string
  yearFounded: string
  stage: string
  employees: string
  description: string
  exportExperience: string
  targetMarkets: string
  fundingNeed: string
  primaryNeed: string
}

export type CriterionScore = {
  criterionId: string
  score: number
  note?: string
}

export type ApplicantNotification = {
  id: string
  title: string
  body: string
  createdAt: string
  read: boolean
}

export type AuditEvent = {
  id: string
  applicationId: string
  actor: string
  action: string
  note?: string
  at: string
}

export type ScoringCriterion = {
  id: string
  label: string
  weight: number
  description: string
}

export type ApplicationRecord = {
  id: string
  applicantUserId: string
  status: ApplicationStatus
  personal: PersonalDetails
  business: BusinessProfile
  documents: ApplicationDocument[]
  scores: CriterionScore[]
  reviewerNote?: string
  xp: number
  badges: BadgeId[]
  notifications: ApplicantNotification[]
  createdAt: string
  updatedAt: string
  submittedAt?: string
}

export type DeadlineConfig = {
  openAt: string
  closeAt: string
  label: string
}

export type ApplicationsState = {
  applications: ApplicationRecord[]
  criteria: ScoringCriterion[]
  deadline: DeadlineConfig
  audit: AuditEvent[]
}

export const emptyPersonal = (): PersonalDetails => ({
  fullName: "",
  email: "",
  phone: "",
  country: "",
  city: "",
  roleTitle: "",
})

export const emptyBusiness = (): BusinessProfile => ({
  businessName: "",
  registrationStatus: "",
  sector: "",
  country: "",
  yearFounded: "",
  stage: "",
  employees: "",
  description: "",
  exportExperience: "",
  targetMarkets: "",
  fundingNeed: "",
  primaryNeed: "",
})

export const ROLE_OPTIONS = [
  "Founder",
  "Co-founder",
  "CEO / Managing Director",
  "Operations lead",
  "Other leadership",
] as const

export const SECTOR_OPTIONS = [
  "Agriculture",
  "Agro-processing",
  "Manufacturing",
  "Export services",
  "Climate / sustainability",
  "Technology",
  "Trade / logistics",
  "Other",
] as const

export const STAGE_OPTIONS = [
  "Idea",
  "Early stage",
  "Growth",
  "Scaling",
] as const

export const REGISTRATION_OPTIONS = [
  "Registered",
  "Registration in progress",
  "Not yet registered",
] as const

export const EMPLOYEE_OPTIONS = [
  "Just me",
  "2–5",
  "6–20",
  "21–50",
  "51+",
] as const

export const EXPORT_OPTIONS = [
  "No export experience yet",
  "Exploring export",
  "Currently exporting",
] as const

export const PRIMARY_NEED_OPTIONS = [
  "Investment readiness",
  "Export readiness",
  "Market access (AGOA / AfCFTA / North America)",
  "Mentorship & partnerships",
  "Pitch & deal preparation",
] as const
