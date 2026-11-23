export type PartnerType = "Investor" | "Buyer"

export type PartnerProfile = {
  id: string
  type: PartnerType
  name: string
  organization: string
  focus: string[]
  geographies: string[]
  ticketOrVolume: string
  thesis: string
  contactName: string
  email: string
  status: "Active" | "Paused"
}

export type EnterpriseProfile = {
  id: string
  participantId: string
  businessName: string
  founderName: string
  sector: string
  country: string
  stage: string
  offering: string
  traction: string
  ask: string
  readinessScore: number
  exportReady: boolean
  investmentReady: boolean
  matchEligible: boolean
}

export type ReadinessItem = {
  id: string
  area: string
  status: "Completed" | "In progress" | "Pending"
  weight: number
  detail: string
}

export type MatchStage =
  | "Recommended"
  | "Requested"
  | "Under review"
  | "Approved"
  | "Meeting scheduled"
  | "Completed"
  | "Declined"
  | "Follow-up"

export type MatchRequest = {
  id: string
  enterpriseId: string
  enterpriseName: string
  partnerId: string
  partnerName: string
  partnerType: PartnerType
  stage: MatchStage
  fitScore: number
  reason: string
  requestedBy: "system" | "participant" | "admin"
  requestedAt: string
  notes?: string
}

export type MatchMeeting = {
  id: string
  matchId: string
  enterpriseName: string
  partnerName: string
  partnerType: PartnerType
  date: string
  time: string
  mode: "Virtual" | "In person"
  status: "Scheduled" | "Completed" | "Cancelled" | "No show"
  agenda: string
  notes?: string
}

export type MatchOutcome = {
  id: string
  matchId: string
  enterpriseName: string
  partnerName: string
  partnerType: PartnerType
  result:
    | "Intro completed"
    | "Due diligence"
    | "Pilot agreed"
    | "Investment interest"
    | "No fit"
    | "Follow-up needed"
  summary: string
  nextStep: string
  followUpDate?: string
  updatedAt: string
}

export const partnerProfiles: PartnerProfile[] = [
  {
    id: "partner-1",
    type: "Investor",
    name: "WestBridge Capital",
    organization: "WestBridge Capital",
    focus: ["Agribusiness", "Climate", "Series Seed–A"],
    geographies: ["West Africa", "Nigeria", "Ghana"],
    ticketOrVolume: "$100k–$500k cheques",
    thesis: "Backs climate-smart food systems with clear unit economics.",
    contactName: "Tunde Adebayo",
    email: "tunde@westbridge.example",
    status: "Active",
  },
  {
    id: "partner-2",
    type: "Investor",
    name: "Sahel Ventures",
    organization: "Sahel Ventures",
    focus: ["Trade tech", "Logistics", "SME growth"],
    geographies: ["ECOWAS"],
    ticketOrVolume: "$50k–$250k cheques",
    thesis: "Invests where export corridors unlock SME scale.",
    contactName: "Mariama Sow",
    email: "mariama@sahel.example",
    status: "Active",
  },
  {
    id: "partner-3",
    type: "Buyer",
    name: "NorthStar Buyers",
    organization: "NorthStar Specialty Foods",
    focus: ["Spices", "Processed foods", "AGOA-eligible"],
    geographies: ["USA", "Canada"],
    ticketOrVolume: "Container pilots → recurring POs",
    thesis: "Sources compliant African specialty foods for North American retail.",
    contactName: "Elena Brooks",
    email: "elena@northstar.example",
    status: "Active",
  },
  {
    id: "partner-4",
    type: "Buyer",
    name: "Lagos Trade Desk",
    organization: "Lagos Trade Desk",
    focus: ["AfCFTA", "Regional wholesale", "FMCG"],
    geographies: ["Nigeria", "Benin", "Togo"],
    ticketOrVolume: "Weekly wholesale offtake",
    thesis: "Connects ready SMEs into regional wholesale channels.",
    contactName: "Ifeanyi Okeke",
    email: "ifeanyi@ltd.example",
    status: "Active",
  },
  {
    id: "partner-5",
    type: "Buyer",
    name: "Gulf Pantry Co",
    organization: "Gulf Pantry Co",
    focus: ["Halal packaged foods", "Shelf-stable"],
    geographies: ["UAE", "Saudi Arabia"],
    ticketOrVolume: "Trial SKUs then annual contracts",
    thesis: "Imports African shelf-stable brands into GCC retail.",
    contactName: "Omar Al-Hassan",
    email: "omar@gulfpantry.example",
    status: "Paused",
  },
]

export const enterpriseProfiles: EnterpriseProfile[] = [
  {
    id: "ent-1",
    participantId: "participant-1",
    businessName: "GreenHarvest Agro",
    founderName: "Chidi Nwosu",
    sector: "Agribusiness",
    country: "Nigeria",
    stage: "Growth",
    offering: "Climate-smart dried produce and spice blends for export.",
    traction: "3 institutional buyers · $48k trailing 6-month revenue",
    ask: "$180k seed for cold-chain + AGOA documentation",
    readinessScore: 71,
    exportReady: true,
    investmentReady: false,
    matchEligible: false,
  },
  {
    id: "ent-2",
    participantId: "participant-2",
    businessName: "Savanna Foods Ltd",
    founderName: "Fatima Bello",
    sector: "Processed foods",
    country: "Ghana",
    stage: "Early growth",
    offering: "Ready-to-cook regional sauces for retail.",
    traction: "12 retail doors · repeat order rate 34%",
    ask: "Buyer intros into ECOWAS wholesale",
    readinessScore: 64,
    exportReady: false,
    investmentReady: false,
    matchEligible: false,
  },
  {
    id: "ent-3",
    participantId: "participant-3",
    businessName: "Coastal Spices Co",
    founderName: "Ibrahim Yusuf",
    sector: "Spices",
    country: "Nigeria",
    stage: "Export pilot",
    offering: "AGOA-eligible spice packs with origin documentation.",
    traction: "1 US distributor trial · 2 containers planned",
    ask: "US specialty buyer partnership",
    readinessScore: 78,
    exportReady: true,
    investmentReady: true,
    matchEligible: true,
  },
]

export const readinessItemsForParticipant: ReadinessItem[] = [
  {
    id: "ready-1",
    area: "Business registration",
    status: "Completed",
    weight: 10,
    detail: "CAC documents verified.",
  },
  {
    id: "ready-2",
    area: "Business plan",
    status: "Completed",
    weight: 15,
    detail: "Plan reviewed in mentorship.",
  },
  {
    id: "ready-3",
    area: "Financial projections",
    status: "In progress",
    weight: 20,
    detail: "Need logistics costs in unit economics.",
  },
  {
    id: "ready-4",
    area: "Pitch deck",
    status: "Completed",
    weight: 20,
    detail: "Deck structure approved; polish remaining.",
  },
  {
    id: "ready-5",
    area: "Market validation",
    status: "In progress",
    weight: 15,
    detail: "Two LOIs pending signatures.",
  },
  {
    id: "ready-6",
    area: "Investment / buyer proposal",
    status: "Pending",
    weight: 20,
    detail: "Required before investor intros unlock fully.",
  },
]

const READINESS_STORAGE_KEY = "aaiiri-readiness-items"

export function loadReadinessItems(participantId: string): ReadinessItem[] {
  try {
    const raw = localStorage.getItem(`${READINESS_STORAGE_KEY}:${participantId}`)
    if (!raw) return readinessItemsForParticipant.map((item) => ({ ...item }))
    return JSON.parse(raw) as ReadinessItem[]
  } catch {
    return readinessItemsForParticipant.map((item) => ({ ...item }))
  }
}

export function saveReadinessItems(
  participantId: string,
  items: ReadinessItem[]
) {
  localStorage.setItem(
    `${READINESS_STORAGE_KEY}:${participantId}`,
    JSON.stringify(items)
  )
}

export function isMatchUnlocked(participantId: string) {
  const enterprise = getEnterpriseByParticipant(participantId)
  if (enterprise?.matchEligible) return true
  return computeReadinessScore(loadReadinessItems(participantId)) >= 75
}

export const matchRequests: MatchRequest[] = [
  {
    id: "match-1",
    enterpriseId: "ent-1",
    enterpriseName: "GreenHarvest Agro",
    partnerId: "partner-1",
    partnerName: "WestBridge Capital",
    partnerType: "Investor",
    stage: "Under review",
    fitScore: 86,
    reason:
      "Agribusiness + climate thesis fit. Readiness 71; financials pending polish.",
    requestedBy: "system",
    requestedAt: "8 Feb 2027",
  },
  {
    id: "match-2",
    enterpriseId: "ent-3",
    enterpriseName: "Coastal Spices Co",
    partnerId: "partner-3",
    partnerName: "NorthStar Buyers",
    partnerType: "Buyer",
    stage: "Meeting scheduled",
    fitScore: 92,
    reason: "AGOA-ready spices align with NorthStar specialty import list.",
    requestedBy: "participant",
    requestedAt: "5 Feb 2027",
  },
  {
    id: "match-3",
    enterpriseId: "ent-1",
    enterpriseName: "GreenHarvest Agro",
    partnerId: "partner-4",
    partnerName: "Lagos Trade Desk",
    partnerType: "Buyer",
    stage: "Recommended",
    fitScore: 74,
    reason: "Regional wholesale path while investment readiness catches up.",
    requestedBy: "system",
    requestedAt: "9 Feb 2027",
  },
  {
    id: "match-4",
    enterpriseId: "ent-3",
    enterpriseName: "Coastal Spices Co",
    partnerId: "partner-2",
    partnerName: "Sahel Ventures",
    partnerType: "Investor",
    stage: "Approved",
    fitScore: 81,
    reason: "Export corridor story matches Sahel thesis.",
    requestedBy: "admin",
    requestedAt: "7 Feb 2027",
  },
  {
    id: "match-5",
    enterpriseId: "ent-2",
    enterpriseName: "Savanna Foods Ltd",
    partnerId: "partner-4",
    partnerName: "Lagos Trade Desk",
    partnerType: "Buyer",
    stage: "Declined",
    fitScore: 55,
    reason: "Readiness below threshold for buyer intro.",
    requestedBy: "participant",
    requestedAt: "4 Feb 2027",
    notes: "Revisit after market validation completes.",
  },
]

export const matchMeetings: MatchMeeting[] = [
  {
    id: "mm-1",
    matchId: "match-2",
    enterpriseName: "Coastal Spices Co",
    partnerName: "NorthStar Buyers",
    partnerType: "Buyer",
    date: "18 Feb 2027",
    time: "14:00 WAT",
    mode: "Virtual",
    status: "Scheduled",
    agenda: "Product samples, compliance pack, pilot PO terms",
  },
  {
    id: "mm-2",
    matchId: "match-4",
    enterpriseName: "Coastal Spices Co",
    partnerName: "Sahel Ventures",
    partnerType: "Investor",
    date: "12 Feb 2027",
    time: "11:00 WAT",
    mode: "Virtual",
    status: "Completed",
    agenda: "Investment thesis fit and use of funds",
    notes: "Partner requested updated 12-month cash plan.",
  },
  {
    id: "mm-3",
    matchId: "match-1",
    enterpriseName: "GreenHarvest Agro",
    partnerName: "WestBridge Capital",
    partnerType: "Investor",
    date: "21 Feb 2027",
    time: "10:30 WAT",
    mode: "Virtual",
    status: "Scheduled",
    agenda: "Intro call pending admin approval of match",
  },
]

export const matchOutcomes: MatchOutcome[] = [
  {
    id: "out-1",
    matchId: "match-4",
    enterpriseName: "Coastal Spices Co",
    partnerName: "Sahel Ventures",
    partnerType: "Investor",
    result: "Due diligence",
    summary: "Positive first meeting. Moving to light diligence on margins.",
    nextStep: "Share cash plan and customer cohort data by 20 Feb.",
    followUpDate: "20 Feb 2027",
    updatedAt: "12 Feb 2027",
  },
  {
    id: "out-2",
    matchId: "match-5",
    enterpriseName: "Savanna Foods Ltd",
    partnerName: "Lagos Trade Desk",
    partnerType: "Buyer",
    result: "No fit",
    summary: "Declined due to incomplete readiness evidence.",
    nextStep: "Complete market validation, then re-request.",
    updatedAt: "6 Feb 2027",
  },
]

export function getEnterpriseByParticipant(participantId: string) {
  return enterpriseProfiles.find((item) => item.participantId === participantId)
}

export function getMatchesForEnterprise(enterpriseId: string) {
  return matchRequests.filter((item) => item.enterpriseId === enterpriseId)
}

export function getPartnerById(id: string) {
  return partnerProfiles.find((item) => item.id === id)
}

export function getRecommendedMatches() {
  return matchRequests.filter(
    (item) => item.stage === "Recommended" || item.stage === "Requested"
  )
}

export function getMeetingsForEnterprise(enterpriseName: string) {
  return matchMeetings.filter((item) => item.enterpriseName === enterpriseName)
}

export function computeReadinessScore(items: ReadinessItem[]) {
  const totalWeight = items.reduce((sum, item) => sum + item.weight, 0)
  const earned = items.reduce((sum, item) => {
    if (item.status === "Completed") return sum + item.weight
    if (item.status === "In progress") return sum + item.weight * 0.5
    return sum
  }, 0)
  return Math.round((earned / totalWeight) * 100)
}
