export type AssessmentStatus = "Draft" | "Published" | "Closed"

export type SubmissionStatus =
  | "Not started"
  | "In progress"
  | "Submitted"
  | "Graded"
  | "Overdue"

export type QuizQuestion = {
  id: string
  prompt: string
  options: string[]
  correctIndex: number
}

export type Quiz = {
  id: string
  title: string
  module: string
  cohort: string
  status: AssessmentStatus
  durationMinutes: number
  passingScore: number
  questions: QuizQuestion[]
}

export type Assignment = {
  id: string
  title: string
  brief: string
  module: string
  cohort: string
  due: string
  maxScore: number
  status: AssessmentStatus
}

export type AssignmentSubmission = {
  id: string
  assignmentId: string
  participantId: string
  participantName: string
  organization: string
  status: SubmissionStatus
  submittedAt?: string
  fileName?: string
  score?: number
  feedback?: string
}

export type QuizAttempt = {
  id: string
  quizId: string
  participantId: string
  participantName: string
  status: SubmissionStatus
  score?: number
  answeredAt?: string
}

export type CompetencyScore = {
  area: string
  score: number
  target: number
}

export type ParticipantPerformance = {
  participantId: string
  participantName: string
  organization: string
  cohort: string
  overallScore: number
  assignmentsCompleted: number
  assignmentsTotal: number
  quizzesCompleted: number
  quizzesTotal: number
  competencies: CompetencyScore[]
}

export const quizzes: Quiz[] = [
  {
    id: "quiz-1",
    title: "Export readiness fundamentals",
    module: "Export Readiness and International Trade",
    cohort: "Cohort 2027-A",
    status: "Published",
    durationMinutes: 20,
    passingScore: 70,
    questions: [
      {
        id: "q1",
        prompt: "Which document proves a product’s country of origin for AGOA?",
        options: [
          "Commercial invoice only",
          "Certificate of origin",
          "Business registration",
          "Pitch deck",
        ],
        correctIndex: 1,
      },
      {
        id: "q2",
        prompt: "AfCFTA primarily aims to:",
        options: [
          "Replace national currencies",
          "Reduce barriers to intra-African trade",
          "Fund every startup equally",
          "Replace WTO rules",
        ],
        correctIndex: 1,
      },
      {
        id: "q3",
        prompt: "A strong export readiness checklist should include:",
        options: [
          "Only branding assets",
          "Compliance, logistics, and market fit",
          "Social media followers only",
          "Office furniture inventory",
        ],
        correctIndex: 1,
      },
    ],
  },
  {
    id: "quiz-2",
    title: "Investor pitch basics",
    module: "Investor Pitch Development",
    cohort: "Cohort 2027-A",
    status: "Published",
    durationMinutes: 15,
    passingScore: 75,
    questions: [
      {
        id: "q1",
        prompt: "An investor pitch should lead with:",
        options: [
          "Team hobbies",
          "Problem, solution, and traction",
          "Office lease terms",
          "Competitor logos only",
        ],
        correctIndex: 1,
      },
      {
        id: "q2",
        prompt: "Unit economics help investors understand:",
        options: [
          "Office Wi-Fi speed",
          "Profitability per customer or unit",
          "Brand colour palette",
          "Conference attendance",
        ],
        correctIndex: 1,
      },
    ],
  },
  {
    id: "quiz-3",
    title: "Financial projections check",
    module: "Business Strategy and Investment Readiness",
    cohort: "Cohort 2027-B",
    status: "Draft",
    durationMinutes: 25,
    passingScore: 70,
    questions: [
      {
        id: "q1",
        prompt: "A 3-statement model typically includes:",
        options: [
          "P&L, balance sheet, cash flow",
          "Twitter analytics only",
          "HR policies only",
          "Supplier menus",
        ],
        correctIndex: 0,
      },
    ],
  },
]

export const assignments: Assignment[] = [
  {
    id: "assign-1",
    title: "Export readiness checklist",
    brief:
      "Complete the export readiness checklist for your primary product line, including compliance, packaging, and logistics notes.",
    module: "Export Readiness and International Trade",
    cohort: "Cohort 2027-A",
    due: "10 Feb 2027",
    maxScore: 100,
    status: "Published",
  },
  {
    id: "assign-2",
    title: "Market access brief — North America",
    brief:
      "Prepare a 2–3 page market access brief covering demand signals, channels, and regulatory considerations for North America.",
    module: "AGOA and AfCFTA Opportunities",
    cohort: "Cohort 2027-A",
    due: "14 Feb 2027",
    maxScore: 100,
    status: "Published",
  },
  {
    id: "assign-3",
    title: "Draft investor pitch deck",
    brief:
      "Submit a 10–12 slide investor pitch deck covering problem, solution, market, traction, and ask.",
    module: "Investor Pitch Development",
    cohort: "Cohort 2027-A",
    due: "21 Feb 2027",
    maxScore: 100,
    status: "Published",
  },
]

export const assignmentSubmissions: AssignmentSubmission[] = [
  {
    id: "sub-1",
    assignmentId: "assign-1",
    participantId: "participant-1",
    participantName: "Chidi Nwosu",
    organization: "GreenHarvest Agro",
    status: "Graded",
    submittedAt: "8 Feb 2027",
    fileName: "greenharvest-export-checklist.pdf",
    score: 86,
    feedback:
      "Strong compliance section. Add clearer logistics lead times before the next review.",
  },
  {
    id: "sub-2",
    assignmentId: "assign-2",
    participantId: "participant-1",
    participantName: "Chidi Nwosu",
    organization: "GreenHarvest Agro",
    status: "In progress",
  },
  {
    id: "sub-3",
    assignmentId: "assign-3",
    participantId: "participant-1",
    participantName: "Chidi Nwosu",
    organization: "GreenHarvest Agro",
    status: "Not started",
  },
  {
    id: "sub-4",
    assignmentId: "assign-1",
    participantId: "participant-2",
    participantName: "Fatima Bello",
    organization: "Savanna Foods Ltd",
    status: "Submitted",
    submittedAt: "9 Feb 2027",
    fileName: "savanna-export-checklist.docx",
  },
  {
    id: "sub-5",
    assignmentId: "assign-2",
    participantId: "participant-2",
    participantName: "Fatima Bello",
    organization: "Savanna Foods Ltd",
    status: "Submitted",
    submittedAt: "11 Feb 2027",
    fileName: "savanna-na-market-brief.pdf",
  },
]

export const quizAttempts: QuizAttempt[] = [
  {
    id: "attempt-1",
    quizId: "quiz-1",
    participantId: "participant-1",
    participantName: "Chidi Nwosu",
    status: "Graded",
    score: 100,
    answeredAt: "5 Feb 2027",
  },
  {
    id: "attempt-2",
    quizId: "quiz-2",
    participantId: "participant-1",
    participantName: "Chidi Nwosu",
    status: "Not started",
  },
  {
    id: "attempt-3",
    quizId: "quiz-1",
    participantId: "participant-2",
    participantName: "Fatima Bello",
    status: "Graded",
    score: 67,
    answeredAt: "6 Feb 2027",
  },
]

export const participantPerformance: ParticipantPerformance[] = [
  {
    participantId: "participant-1",
    participantName: "Chidi Nwosu",
    organization: "GreenHarvest Agro",
    cohort: "Cohort 2027-A",
    overallScore: 78,
    assignmentsCompleted: 1,
    assignmentsTotal: 3,
    quizzesCompleted: 1,
    quizzesTotal: 2,
    competencies: [
      { area: "Export readiness", score: 82, target: 80 },
      { area: "Financial literacy", score: 70, target: 75 },
      { area: "Pitch quality", score: 65, target: 80 },
      { area: "Market research", score: 74, target: 75 },
      { area: "Investment readiness", score: 71, target: 80 },
    ],
  },
  {
    participantId: "participant-2",
    participantName: "Fatima Bello",
    organization: "Savanna Foods Ltd",
    cohort: "Cohort 2027-A",
    overallScore: 72,
    assignmentsCompleted: 0,
    assignmentsTotal: 3,
    quizzesCompleted: 1,
    quizzesTotal: 2,
    competencies: [
      { area: "Export readiness", score: 68, target: 80 },
      { area: "Financial literacy", score: 75, target: 75 },
      { area: "Pitch quality", score: 60, target: 80 },
      { area: "Market research", score: 78, target: 75 },
      { area: "Investment readiness", score: 66, target: 80 },
    ],
  },
]

export function getAssignmentById(id: string) {
  return assignments.find((item) => item.id === id)
}

export function getQuizById(id: string) {
  return quizzes.find((item) => item.id === id)
}

export function getParticipantSubmissions(participantId: string) {
  return assignmentSubmissions.filter(
    (item) => item.participantId === participantId
  )
}

export function getParticipantQuizAttempts(participantId: string) {
  return quizAttempts.filter((item) => item.participantId === participantId)
}

export function getParticipantPerformance(participantId: string) {
  return participantPerformance.find(
    (item) => item.participantId === participantId
  )
}

export function getPendingGrading() {
  return assignmentSubmissions.filter((item) => item.status === "Submitted")
}
