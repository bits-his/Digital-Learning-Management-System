import type {
  ApplicationRecord,
  BadgeId,
  DocumentType,
} from "@/shared/data/applications/types"

export const REQUIRED_DOCUMENTS: DocumentType[] = [
  "business_registration",
  "pitch_deck",
  "financials",
  "id_document",
]

export const DOCUMENT_LABELS: Record<DocumentType, string> = {
  business_registration: "Business registration certificate",
  pitch_deck: "Pitch deck or business overview",
  financials: "Financial statements or projections",
  id_document: "Founder government ID",
}

export const DOCUMENT_HINTS: Record<DocumentType, string> = {
  business_registration: "CAC or equivalent registration document",
  pitch_deck: "PDF preferred · clear overview of the venture",
  financials: "Recent statements or simple projections",
  id_document: "National ID, passport, or driver’s licence",
}

export const BADGE_META: Record<
  BadgeId,
  { label: string; description: string }
> = {
  starter: {
    label: "Starter",
    description: "Account created for the Bootcamp application.",
  },
  founder_profile: {
    label: "Founder profile",
    description: "Business profile completed.",
  },
  document_ready: {
    label: "Document ready",
    description: "All required documents uploaded.",
  },
  submitted: {
    label: "Submitted",
    description: "Application submitted for review.",
  },
  selected: {
    label: "Selected",
    description: "Shortlisted or approved for the Bootcamp.",
  },
}

export const XP_REWARDS = {
  starter: 20,
  personal: 30,
  founder_profile: 50,
  document_ready: 40,
  submitted: 100,
  selected: 80,
} as const

export function levelFromXp(xp: number) {
  return Math.max(1, Math.floor(xp / 100) + 1)
}

export function isPersonalComplete(personal: ApplicationRecord["personal"]) {
  return Boolean(
    personal.fullName.trim() &&
      personal.email.trim() &&
      personal.phone.trim() &&
      personal.country.trim() &&
      personal.city.trim() &&
      personal.roleTitle.trim()
  )
}

export function isBusinessComplete(business: ApplicationRecord["business"]) {
  return Boolean(
    business.businessName.trim() &&
      business.registrationStatus.trim() &&
      business.sector.trim() &&
      business.country.trim() &&
      business.yearFounded.trim() &&
      business.stage.trim() &&
      business.employees.trim() &&
      business.description.trim() &&
      business.exportExperience.trim() &&
      business.targetMarkets.trim() &&
      business.fundingNeed.trim() &&
      business.primaryNeed.trim()
  )
}

export function hasAllDocuments(docs: ApplicationRecord["documents"]) {
  return REQUIRED_DOCUMENTS.every((type) =>
    docs.some((doc) => doc.type === type)
  )
}

export function readinessScore(app: ApplicationRecord) {
  let score = 0
  if (isPersonalComplete(app.personal)) score += 25
  if (isBusinessComplete(app.business)) score += 35
  const uploaded = REQUIRED_DOCUMENTS.filter((type) =>
    app.documents.some((doc) => doc.type === type)
  ).length
  score += Math.round((uploaded / REQUIRED_DOCUMENTS.length) * 30)
  if (app.status !== "draft") score += 10
  return Math.min(100, score)
}

export function stepProgress(app: ApplicationRecord) {
  const steps = [
    isPersonalComplete(app.personal),
    isBusinessComplete(app.business),
    hasAllDocuments(app.documents),
    app.status !== "draft",
  ]
  const done = steps.filter(Boolean).length
  return Math.round((done / steps.length) * 100)
}
