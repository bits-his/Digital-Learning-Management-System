export type MentorProfile = {
  id: string
  userId: string
  name: string
  email: string
  title: string
  organization: string
  expertise: string[]
  capacity: number
  allocated: number
  bio: string
  status: "Active" | "Inactive"
  avatar?: string
}

export type MentorshipAllocation = {
  id: string
  mentorId: string
  mentorName: string
  participantId: string
  participantName: string
  organization: string
  focusArea: string
  startDate: string
  status: "Active" | "Paused" | "Completed"
}

export type MentorshipSessionStatus =
  | "Scheduled"
  | "Completed"
  | "Cancelled"
  | "No show"

export type MentorshipSession = {
  id: string
  mentorId: string
  mentorName: string
  participantId: string
  participantName: string
  date: string
  time: string
  focus: string
  status: MentorshipSessionStatus
  notes?: string
  mentorFeedback?: string
  participantFeedback?: string
}

export type MentorReportStatus = "Draft" | "Submitted" | "Reviewed"

export type MentorReport = {
  id: string
  mentorId: string
  mentorName: string
  participantId: string
  participantName: string
  period: string
  summary: string
  developmentNotes: string
  recommendations: string
  status: MentorReportStatus
  submittedAt?: string
}

export const mentorProfiles: MentorProfile[] = [
  {
    id: "mentor-profile-1",
    userId: "mentor-1",
    name: "Amina Diallo",
    email: "mentor@aaiiri.org",
    title: "Investment Advisor",
    organization: "WestBridge Advisory",
    expertise: ["Investment readiness", "Pitch coaching", "Financial models"],
    capacity: 4,
    allocated: 2,
    bio: "Supports early-stage agribusiness founders preparing for investor conversations across West Africa.",
    status: "Active",
    avatar:
      "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=160&h=160&fit=crop&crop=face",
  },
  {
    id: "mentor-profile-2",
    userId: "mentor-2",
    name: "Kwame Mensah",
    email: "kwame.mensah@aaiiri.org",
    title: "Trade Specialist",
    organization: "AfTrade Partners",
    expertise: ["Export compliance", "AGOA", "Buyer negotiations"],
    capacity: 3,
    allocated: 1,
    bio: "Former export compliance lead helping SMEs enter US and EU markets.",
    status: "Active",
  },
  {
    id: "mentor-profile-3",
    userId: "mentor-3",
    name: "Ngozi Eze",
    email: "ngozi.eze@aaiiri.org",
    title: "Operations Mentor",
    organization: "ScaleOps Africa",
    expertise: ["Operations", "Supply chain", "Team building"],
    capacity: 5,
    allocated: 0,
    bio: "Guides founders on operational systems as they scale production.",
    status: "Inactive",
  },
]

export const mentorshipAllocations: MentorshipAllocation[] = [
  {
    id: "alloc-1",
    mentorId: "mentor-profile-1",
    mentorName: "Amina Diallo",
    participantId: "participant-1",
    participantName: "Chidi Nwosu",
    organization: "GreenHarvest Agro",
    focusArea: "Investment readiness",
    startDate: "1 Feb 2027",
    status: "Active",
  },
  {
    id: "alloc-2",
    mentorId: "mentor-profile-1",
    mentorName: "Amina Diallo",
    participantId: "participant-2",
    participantName: "Fatima Bello",
    organization: "Savanna Foods Ltd",
    focusArea: "Pitch coaching",
    startDate: "3 Feb 2027",
    status: "Active",
  },
  {
    id: "alloc-3",
    mentorId: "mentor-profile-2",
    mentorName: "Kwame Mensah",
    participantId: "participant-3",
    participantName: "Ibrahim Yusuf",
    organization: "Coastal Spices Co",
    focusArea: "Export compliance",
    startDate: "5 Feb 2027",
    status: "Active",
  },
]

export const mentorshipSessions: MentorshipSession[] = [
  {
    id: "ms-1",
    mentorId: "mentor-profile-1",
    mentorName: "Amina Diallo",
    participantId: "participant-1",
    participantName: "Chidi Nwosu",
    date: "13 Feb 2027",
    time: "16:00 WAT",
    focus: "Pitch narrative and ask sizing",
    status: "Scheduled",
  },
  {
    id: "ms-2",
    mentorId: "mentor-profile-1",
    mentorName: "Amina Diallo",
    participantId: "participant-1",
    participantName: "Chidi Nwosu",
    date: "6 Feb 2027",
    time: "15:00 WAT",
    focus: "Financial projections review",
    status: "Completed",
    notes: "Reviewed draft P&L assumptions and unit economics.",
    mentorFeedback:
      "Chidi is improving narrative clarity. Next: tighten CAC and payback assumptions.",
    participantFeedback:
      "Very practical session — clearer on what investors expect in the model.",
  },
  {
    id: "ms-3",
    mentorId: "mentor-profile-1",
    mentorName: "Amina Diallo",
    participantId: "participant-2",
    participantName: "Fatima Bello",
    date: "14 Feb 2027",
    time: "11:00 WAT",
    focus: "Deck structure and traction slides",
    status: "Scheduled",
  },
  {
    id: "ms-4",
    mentorId: "mentor-profile-2",
    mentorName: "Kwame Mensah",
    participantId: "participant-3",
    participantName: "Ibrahim Yusuf",
    date: "8 Feb 2027",
    time: "10:00 WAT",
    focus: "AGOA documentation walkthrough",
    status: "Completed",
    notes: "Walked through certificate of origin process.",
    mentorFeedback: "Strong operational grasp; needs a documented SOP.",
  },
]

export const mentorReports: MentorReport[] = [
  {
    id: "report-1",
    mentorId: "mentor-profile-1",
    mentorName: "Amina Diallo",
    participantId: "participant-1",
    participantName: "Chidi Nwosu",
    period: "Feb 2027 — Week 1",
    summary:
      "GreenHarvest is progressing on investment readiness with clearer problem framing.",
    developmentNotes:
      "Pitch story improved after session 1. Financial model still understates logistics costs.",
    recommendations:
      "Complete revised projections before next session; rehearse 3-minute pitch.",
    status: "Submitted",
    submittedAt: "7 Feb 2027",
  },
  {
    id: "report-2",
    mentorId: "mentor-profile-1",
    mentorName: "Amina Diallo",
    participantId: "participant-2",
    participantName: "Fatima Bello",
    period: "Feb 2027 — Week 1",
    summary: "Early engagement; deck structure still forming.",
    developmentNotes: "Needs stronger traction narrative and clearer ICP.",
    recommendations: "Bring customer evidence pack to next session.",
    status: "Draft",
  },
  {
    id: "report-3",
    mentorId: "mentor-profile-2",
    mentorName: "Kwame Mensah",
    participantId: "participant-3",
    participantName: "Ibrahim Yusuf",
    period: "Feb 2027 — Week 1",
    summary: "Export compliance foundations covered successfully.",
    developmentNotes: "Participant ready for documentation checklist.",
    recommendations: "Schedule buyer intro only after SOP draft is ready.",
    status: "Reviewed",
    submittedAt: "9 Feb 2027",
  },
]

export function getMentorProfileByUserId(userId: string) {
  return mentorProfiles.find((item) => item.userId === userId)
}

export function getAllocationsForMentor(mentorId: string) {
  return mentorshipAllocations.filter((item) => item.mentorId === mentorId)
}

export function getAllocationsForParticipant(participantId: string) {
  return mentorshipAllocations.filter(
    (item) => item.participantId === participantId
  )
}

export function getSessionsForMentor(mentorId: string) {
  return mentorshipSessions.filter((item) => item.mentorId === mentorId)
}

export function getSessionsForParticipant(participantId: string) {
  return mentorshipSessions.filter(
    (item) => item.participantId === participantId
  )
}

export function getReportsForMentor(mentorId: string) {
  return mentorReports.filter((item) => item.mentorId === mentorId)
}

export type MentorshipMessageAuthor = "mentor" | "participant"

export type MentorshipMessage = {
  id: string
  allocationId: string
  author: MentorshipMessageAuthor
  authorName: string
  body: string
  sentAt: string
  kind?: "guidance" | "question" | "reply"
}

const THREAD_STORAGE_KEY = "aaiiri-mentorship-threads"

export const seedMentorshipMessages: MentorshipMessage[] = [
  {
    id: "msg-1",
    allocationId: "alloc-1",
    author: "mentor",
    authorName: "Amina Diallo",
    body: "Chidi, I reviewed your export checklist score (86). Strong compliance section. Where you lost marks is logistics lead times — investors will ask how long from order to port.",
    sentAt: "6 Feb 2027 · 15:20 WAT",
    kind: "guidance",
  },
  {
    id: "msg-2",
    allocationId: "alloc-1",
    author: "participant",
    authorName: "Chidi Nwosu",
    body: "Thanks Amina. I still don’t fully get how to present unit economics without oversharing our margins. Can you show me a simple framing?",
    sentAt: "6 Feb 2027 · 16:05 WAT",
    kind: "question",
  },
  {
    id: "msg-3",
    allocationId: "alloc-1",
    author: "mentor",
    authorName: "Amina Diallo",
    body: "Keep it to three lines: (1) revenue per unit, (2) direct cost per unit, (3) contribution after logistics. You don’t need full P&L in the pitch — just prove the unit can fund growth. Bring a draft to our session on 13 Feb.",
    sentAt: "6 Feb 2027 · 16:22 WAT",
    kind: "guidance",
  },
  {
    id: "msg-4",
    allocationId: "alloc-1",
    author: "participant",
    authorName: "Chidi Nwosu",
    body: "Got it. I’ll draft that and also ask about my pitch narrative — I feel the problem slide is still weak.",
    sentAt: "7 Feb 2027 · 09:10 WAT",
    kind: "question",
  },
  {
    id: "msg-5",
    allocationId: "alloc-1",
    author: "mentor",
    authorName: "Amina Diallo",
    body: "Good instinct. For the problem slide: one farmer story + one market number. No jargon. We’ll tighten it live in the next conversation.",
    sentAt: "7 Feb 2027 · 09:40 WAT",
    kind: "guidance",
  },
  {
    id: "msg-6",
    allocationId: "alloc-2",
    author: "mentor",
    authorName: "Amina Diallo",
    body: "Fatima — before our deck session, send me your current traction slide. I want to see customer evidence, not just projections.",
    sentAt: "8 Feb 2027 · 11:00 WAT",
    kind: "guidance",
  },
  {
    id: "msg-7",
    allocationId: "alloc-2",
    author: "participant",
    authorName: "Fatima Bello",
    body: "Will do. I’m unclear whether repeat orders count as traction if they’re still informal. Can you clarify?",
    sentAt: "8 Feb 2027 · 12:15 WAT",
    kind: "question",
  },
]

function readStoredThreads(): MentorshipMessage[] {
  try {
    const raw = localStorage.getItem(THREAD_STORAGE_KEY)
    if (!raw) return []
    return JSON.parse(raw) as MentorshipMessage[]
  } catch {
    return []
  }
}

function writeStoredThreads(messages: MentorshipMessage[]) {
  localStorage.setItem(THREAD_STORAGE_KEY, JSON.stringify(messages))
}

export function getThreadMessages(allocationId: string): MentorshipMessage[] {
  const stored = readStoredThreads().filter(
    (item) => item.allocationId === allocationId
  )
  const seed = seedMentorshipMessages.filter(
    (item) => item.allocationId === allocationId
  )
  const seedIds = new Set(seed.map((item) => item.id))
  const extras = stored.filter((item) => !seedIds.has(item.id))
  return [...seed, ...extras].sort((a, b) => a.sentAt.localeCompare(b.sentAt))
}

export function appendThreadMessage(
  message: Omit<MentorshipMessage, "id" | "sentAt"> & {
    id?: string
    sentAt?: string
  }
): MentorshipMessage {
  const next: MentorshipMessage = {
    id: message.id ?? `msg-${Date.now()}`,
    allocationId: message.allocationId,
    author: message.author,
    authorName: message.authorName,
    body: message.body,
    kind: message.kind,
    sentAt:
      message.sentAt ??
      new Intl.DateTimeFormat("en-GB", {
        day: "numeric",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
      }).format(new Date()) + " WAT",
  }

  const stored = readStoredThreads()
  writeStoredThreads([...stored, next])
  return next
}

export const mentorGuidancePrompts = [
  "Here’s what to improve before our next session:",
  "You didn’t quite get this part — let’s unpack it:",
  "Strong progress here. Double down on:",
  "Bring this draft to our next call so we can review it together:",
]

export const participantQuestionPrompts = [
  "I don’t understand my latest feedback — can you explain?",
  "What should I prioritise this week?",
  "Can you review this part of my work?",
  "I’m stuck on unit economics — where should I start?",
]
