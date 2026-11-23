export type LessonType = "video" | "document" | "resource" | "quiz"

export const lessonTypeLabels: Record<LessonType, string> = {
  video: "Video",
  document: "Document",
  resource: "Resource",
  quiz: "Quiz",
}

export function lessonTypeLabel(type: LessonType) {
  return lessonTypeLabels[type] ?? type
}

export type QuizOption = {
  id: string
  label: string
}

export type QuizQuestion = {
  id: string
  prompt: string
  options: QuizOption[]
  correctOptionId: string
}

export type LessonMedia = {
  fileName: string
  fileSize: number
  mimeType: string
  /** Object URL or remote URL for preview in the mock */
  url: string
  validated: boolean
  validationMessage?: string
}

export type Lesson = {
  id: string
  title: string
  type: LessonType
  duration: string
  completed: boolean
  description: string
  content?: string
  resourceUrl?: string
  media?: LessonMedia
  quiz?: {
    passingScore: number
    questions: QuizQuestion[]
  }
}

export type Module = {
  id: string
  title: string
  summary: string
  lessons: Lesson[]
}

export type CourseStatus =
  | "Not started"
  | "In progress"
  | "Completed"
  | "Published"
  | "Draft"

export type Course = {
  id: string
  title: string
  shortTitle: string
  description: string
  coverImage: string
  facilitator: string
  facilitatorTitle: string
  duration: string
  moduleCount: number
  lessonCount: number
  progress: number
  status: CourseStatus
  /** Cohort IDs with access to this course */
  cohortIds: string[]
  published: boolean
  modules: Module[]
}

export type EnrolmentCandidate = {
  id: string
  name: string
  business: string
  country: string
  sector: string
  email: string
  applicationId: string
  score: number
  accountStatus: "Pending activation" | "Activated" | "Invited"
  cohort: string | null
  onboarding: "Not started" | "In progress" | "Complete"
}

export type TimetableSlot = {
  id: string
  day: string
  date: string
  time: string
  title: string
  type: "Live session" | "Self-paced" | "Clinic" | "Office hours"
  courseId?: string
  facilitator: string
  location: string
}

export const enrolmentCandidates: EnrolmentCandidate[] = [
  {
    id: "enr-1",
    name: "Amara Diallo",
    business: "Sahel Textiles",
    country: "Ghana",
    sector: "Manufacturing",
    email: "amara@saheltextiles.gh",
    applicationId: "APP-2033",
    score: 86,
    accountStatus: "Pending activation",
    cohort: null,
    onboarding: "Not started",
  },
  {
    id: "enr-2",
    name: "Yusuf Bello",
    business: "Savanna Foods Ltd",
    country: "Nigeria",
    sector: "Agro-processing",
    email: "yusuf@savannafoods.ng",
    applicationId: "APP-2041",
    score: 82,
    accountStatus: "Invited",
    cohort: "2027 Cohort 2",
    onboarding: "Not started",
  },
  {
    id: "enr-3",
    name: "Fatima Sow",
    business: "Coastal Spices Co",
    country: "Senegal",
    sector: "Agriculture",
    email: "fatima@coastalspices.sn",
    applicationId: "APP-2029",
    score: 88,
    accountStatus: "Activated",
    cohort: "2027 Cohort 1",
    onboarding: "Complete",
  },
  {
    id: "enr-4",
    name: "Chidi Nwosu",
    business: "GreenHarvest Agro",
    country: "Nigeria",
    sector: "Agriculture",
    email: "participant@aaiiri.org",
    applicationId: "APP-2012",
    score: 91,
    accountStatus: "Activated",
    cohort: "2027 Cohort 1",
    onboarding: "Complete",
  },
  {
    id: "enr-5",
    name: "Amina Kone",
    business: "Lagos Trade Hub",
    country: "Nigeria",
    sector: "Export services",
    email: "amina@lagostradehub.ng",
    applicationId: "APP-2038",
    score: 91,
    accountStatus: "Activated",
    cohort: "2027 Cohort 1",
    onboarding: "In progress",
  },
  {
    id: "enr-6",
    name: "Kwame Mensah",
    business: "Accra Craft Exports",
    country: "Ghana",
    sector: "Manufacturing",
    email: "kwame@accraexports.gh",
    applicationId: "APP-2055",
    score: 79,
    accountStatus: "Pending activation",
    cohort: null,
    onboarding: "Not started",
  },
]

export const programmeTimetable: TimetableSlot[] = [
  {
    id: "tt-1",
    day: "Monday",
    date: "9 Feb 2027",
    time: "09:00 – 10:30 WAT",
    title: "Business Strategy kickoff",
    type: "Live session",
    courseId: "crs-1",
    facilitator: "Dr. Ngozi Adeyemi",
    location: "Zoom",
  },
  {
    id: "tt-2",
    day: "Monday",
    date: "9 Feb 2027",
    time: "11:00 – 12:30 WAT",
    title: "Module 1 self-paced lessons",
    type: "Self-paced",
    courseId: "crs-1",
    facilitator: "Self-directed",
    location: "Learning hub",
  },
  {
    id: "tt-3",
    day: "Wednesday",
    date: "11 Feb 2027",
    time: "09:30 – 11:00 WAT",
    title: "Financial Management Clinic",
    type: "Clinic",
    courseId: "crs-5",
    facilitator: "Tunde Bakare",
    location: "Microsoft Teams",
  },
  {
    id: "tt-4",
    day: "Thursday",
    date: "12 Feb 2027",
    time: "10:00 – 12:00 WAT",
    title: "Export Readiness Workshop",
    type: "Live session",
    courseId: "crs-2",
    facilitator: "Aisha Mohammed",
    location: "Zoom",
  },
  {
    id: "tt-5",
    day: "Friday",
    date: "13 Feb 2027",
    time: "16:00 – 17:00 WAT",
    title: "Facilitator office hours",
    type: "Office hours",
    facilitator: "Dr. Ngozi Adeyemi",
    location: "Google Meet",
  },
  {
    id: "tt-6",
    day: "Tuesday",
    date: "17 Feb 2027",
    time: "14:00 – 16:00 WAT",
    title: "AGOA & AfCFTA Briefing",
    type: "Live session",
    courseId: "crs-3",
    facilitator: "Aisha Mohammed",
    location: "Zoom",
  },
]

const lesson = (
  id: string,
  title: string,
  type: LessonType,
  duration: string,
  completed: boolean,
  description: string
): Lesson => ({
  id,
  title,
  type,
  duration,
  completed,
  description,
  content:
    type === "video"
      ? "Watch this session recording and note three takeaways for your business."
      : type === "document"
        ? "Download and review the reading pack. Highlight sections relevant to your market."
        : type === "quiz"
          ? "Complete the short knowledge check to unlock the next module."
          : "Use these templates and checklists as you prepare your submission.",
  resourceUrl: "#",
})

export const learningCourses: Course[] = [
  {
    id: "crs-1",
    title: "Business Strategy and Investment Readiness",
    shortTitle: "Business Strategy",
    description:
      "Define your growth thesis, competitive position, and investment narrative for institutional partners.",
    coverImage:
      "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=1200&h=800&fit=crop",
    facilitator: "Dr. Ngozi Adeyemi",
    facilitatorTitle: "Lead Facilitator · Strategy",
    duration: "4 weeks",
    moduleCount: 3,
    lessonCount: 8,
    progress: 100,
    status: "Completed",
    cohortIds: ["cohort-1", "cohort-2"],
    published: true,
    modules: [
      {
        id: "m1",
        title: "Foundations of strategy",
        summary: "Clarify vision, value proposition, and market position.",
        lessons: [
          lesson(
            "l1",
            "Welcome & programme orientation",
            "video",
            "12 min",
            true,
            "How the Bootcamp learning journey is structured."
          ),
          lesson(
            "l2",
            "Business model canvas walkthrough",
            "document",
            "25 min",
            true,
            "Map your current model and identify gaps."
          ),
          lesson(
            "l3",
            "Strategy knowledge check",
            "quiz",
            "10 min",
            true,
            "Confirm understanding of core strategy concepts."
          ),
        ],
      },
      {
        id: "m2",
        title: "Investment readiness narrative",
        summary: "Build a clear story for investors and strategic partners.",
        lessons: [
          lesson(
            "l4",
            "What investors look for",
            "video",
            "18 min",
            true,
            "Signals of readiness across West African SMEs."
          ),
          lesson(
            "l5",
            "Narrative template pack",
            "resource",
            "20 min",
            true,
            "Downloadable templates for your investment story."
          ),
          lesson(
            "l6",
            "Draft your growth thesis",
            "document",
            "40 min",
            true,
            "Write and refine a one-page growth thesis."
          ),
        ],
      },
      {
        id: "m3",
        title: "Capstone review",
        summary: "Peer feedback and facilitator sign-off.",
        lessons: [
          lesson(
            "l7",
            "Peer review clinic recording",
            "video",
            "32 min",
            true,
            "Watch selected peer reviews and facilitator notes."
          ),
          lesson(
            "l8",
            "Module completion checklist",
            "resource",
            "8 min",
            true,
            "Confirm all artefacts are uploaded."
          ),
        ],
      },
    ],
  },
  {
    id: "crs-2",
    title: "Export Readiness and International Trade",
    shortTitle: "Export Readiness",
    description:
      "Assess export capacity, documentation, logistics, and market-entry pathways.",
    coverImage:
      "https://images.unsplash.com/photo-1578574577315-3aaad07f1ee7?w=1200&h=800&fit=crop",
    facilitator: "Aisha Mohammed",
    facilitatorTitle: "Trade & Export Specialist",
    duration: "3 weeks",
    moduleCount: 3,
    lessonCount: 7,
    progress: 80,
    status: "In progress",
    cohortIds: ["cohort-1"],
    published: true,
    modules: [
      {
        id: "m1",
        title: "Export diagnostics",
        summary: "Score your current export readiness.",
        lessons: [
          lesson(
            "l1",
            "Export readiness overview",
            "video",
            "15 min",
            true,
            "Framework for diagnosing export capacity."
          ),
          lesson(
            "l2",
            "Diagnostics workbook",
            "document",
            "30 min",
            true,
            "Complete the readiness scorecard for your business."
          ),
          lesson(
            "l3",
            "Diagnostics quiz",
            "quiz",
            "8 min",
            true,
            "Short check on export diagnostics concepts."
          ),
        ],
      },
      {
        id: "m2",
        title: "Documentation & compliance",
        summary: "Certificates, standards, and trade paperwork.",
        lessons: [
          lesson(
            "l4",
            "Trade documentation essentials",
            "video",
            "22 min",
            true,
            "Core documents required for regional and US-bound trade."
          ),
          lesson(
            "l5",
            "Document checklist pack",
            "resource",
            "15 min",
            true,
            "Printable checklist for your compliance folder."
          ),
          lesson(
            "l6",
            "Case study: Coastal Spices",
            "document",
            "20 min",
            false,
            "How a spice exporter prepared for first shipment."
          ),
        ],
      },
      {
        id: "m3",
        title: "Market entry planning",
        summary: "Choose and plan your first export corridor.",
        lessons: [
          lesson(
            "l7",
            "Corridor selection workshop",
            "video",
            "28 min",
            false,
            "Facilitator-led selection of priority markets."
          ),
        ],
      },
    ],
  },
  {
    id: "crs-3",
    title: "AGOA and AfCFTA Opportunities",
    shortTitle: "AGOA & AfCFTA",
    description:
      "Unlock preferential trade frameworks and position your products for regional and US markets.",
    coverImage:
      "https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?w=1200&h=800&fit=crop",
    facilitator: "Aisha Mohammed",
    facilitatorTitle: "Trade & Export Specialist",
    duration: "2 weeks",
    moduleCount: 2,
    lessonCount: 5,
    progress: 55,
    status: "In progress",
    cohortIds: ["cohort-1", "cohort-2"],
    published: true,
    modules: [
      {
        id: "m1",
        title: "Understanding the frameworks",
        summary: "Rules, eligibility, and opportunity mapping.",
        lessons: [
          lesson(
            "l1",
            "AGOA explained",
            "video",
            "16 min",
            true,
            "Eligibility, product coverage, and practical steps."
          ),
          lesson(
            "l2",
            "AfCFTA opportunity brief",
            "document",
            "20 min",
            true,
            "How AfCFTA changes regional market access."
          ),
          lesson(
            "l3",
            "Framework quiz",
            "quiz",
            "10 min",
            false,
            "Test your understanding of both frameworks."
          ),
        ],
      },
      {
        id: "m2",
        title: "Applying the opportunity",
        summary: "Map products to preferential pathways.",
        lessons: [
          lesson(
            "l4",
            "Product–market mapping session",
            "video",
            "24 min",
            false,
            "Live mapping of participant products to corridors."
          ),
          lesson(
            "l5",
            "Opportunity worksheet",
            "resource",
            "18 min",
            false,
            "Template to capture your top three trade opportunities."
          ),
        ],
      },
    ],
  },
  {
    id: "crs-4",
    title: "Investor Pitch Development",
    shortTitle: "Investor Pitch",
    description:
      "Craft, refine, and rehearse a compelling investor pitch backed by evidence.",
    coverImage:
      "https://images.unsplash.com/photo-1556761175-b413da4baf72?w=1200&h=800&fit=crop",
    facilitator: "Tunde Bakare",
    facilitatorTitle: "Investment Readiness Coach",
    duration: "3 weeks",
    moduleCount: 2,
    lessonCount: 4,
    progress: 20,
    status: "In progress",
    cohortIds: ["cohort-1"],
    published: true,
    modules: [
      {
        id: "m1",
        title: "Pitch architecture",
        summary: "Structure a clear, evidence-led deck.",
        lessons: [
          lesson(
            "l1",
            "Anatomy of a strong pitch",
            "video",
            "19 min",
            true,
            "What separates fundable pitches from noise."
          ),
          lesson(
            "l2",
            "Deck outline template",
            "resource",
            "12 min",
            false,
            "Slide-by-slide outline for your first draft."
          ),
        ],
      },
      {
        id: "m2",
        title: "Rehearsal & feedback",
        summary: "Practice delivery with facilitator coaching.",
        lessons: [
          lesson(
            "l3",
            "Pitch clinic recording",
            "video",
            "35 min",
            false,
            "Watch clinic feedback from Cohort 1 peers."
          ),
          lesson(
            "l4",
            "Self-assessment rubric",
            "document",
            "15 min",
            false,
            "Score your draft against the investment rubric."
          ),
        ],
      },
    ],
  },
  {
    id: "crs-5",
    title: "Financial Management and Investment Preparation",
    shortTitle: "Financial Management",
    description:
      "Build credible financials, projections, and diligence packs for investors.",
    coverImage:
      "https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=1200&h=800&fit=crop",
    facilitator: "Tunde Bakare",
    facilitatorTitle: "Investment Readiness Coach",
    duration: "3 weeks",
    moduleCount: 2,
    lessonCount: 4,
    progress: 0,
    status: "Not started",
    cohortIds: ["cohort-1", "cohort-2"],
    published: false,
    modules: [
      {
        id: "m1",
        title: "Financial foundations",
        summary: "Statements, unit economics, and cash discipline.",
        lessons: [
          lesson(
            "l1",
            "Reading your financials",
            "video",
            "21 min",
            false,
            "P&L, balance sheet, and cash flow for SMEs."
          ),
          lesson(
            "l2",
            "Unit economics worksheet",
            "resource",
            "25 min",
            false,
            "Calculate contribution margin and runway."
          ),
        ],
      },
      {
        id: "m2",
        title: "Investment pack",
        summary: "Assemble diligence-ready projections.",
        lessons: [
          lesson(
            "l3",
            "Building three-year projections",
            "video",
            "27 min",
            false,
            "Assumptions, scenarios, and investor expectations."
          ),
          lesson(
            "l4",
            "Diligence checklist",
            "document",
            "12 min",
            false,
            "Documents investors typically request."
          ),
        ],
      },
    ],
  },
]

export function flattenLessons(course: Course) {
  return course.modules.flatMap((module) =>
    module.lessons.map((item) => ({ module, lesson: item }))
  )
}

export function computeCourseProgress(course: Course) {
  const lessons = flattenLessons(course)
  if (lessons.length === 0) return 0
  const done = lessons.filter((entry) => entry.lesson.completed).length
  return Math.round((done / lessons.length) * 100)
}

export function participantCourseStatus(
  progress: number
): Extract<CourseStatus, "Not started" | "In progress" | "Completed"> {
  if (progress <= 0) return "Not started"
  if (progress >= 100) return "Completed"
  return "In progress"
}

export function adminCourseStatus(course: Course): "Published" | "Draft" {
  return course.published ? "Published" : "Draft"
}

export function withCourseCounts(course: Course): Course {
  const lessons = flattenLessons(course)
  const progress = computeCourseProgress(course)
  return {
    ...course,
    moduleCount: course.modules.length,
    lessonCount: lessons.length,
    progress,
    status: course.published
      ? participantCourseStatus(progress)
      : "Draft",
  }
}

export const onboardingSteps = [
  {
    id: "step-1",
    title: "Confirm your account",
    description: "Verify email and set a secure password for your learning hub.",
  },
  {
    id: "step-2",
    title: "Complete your business profile",
    description:
      "Sector, products, markets, and funding goals help personalise your pathway.",
  },
  {
    id: "step-3",
    title: "Join your cohort",
    description: "See your allocated cohort, facilitators, and programme dates.",
  },
  {
    id: "step-4",
    title: "Review the timetable",
    description: "Add live sessions to your calendar and unlock self-paced modules.",
  },
]

export function getCourseById(
  id: string,
  courses: Course[] = learningCourses
) {
  return courses.find((course) => course.id === id)
}

export function getLessonContext(
  courseId: string,
  lessonId: string,
  courses: Course[] = learningCourses
) {
  const course = getCourseById(courseId, courses)
  if (!course) return null

  const flat = flattenLessons(course)
  const index = flat.findIndex((entry) => entry.lesson.id === lessonId)
  if (index < 0) return null

  return {
    course,
    module: flat[index].module,
    lesson: flat[index].lesson,
    previous: flat[index - 1]?.lesson ?? null,
    next: flat[index + 1]?.lesson ?? null,
    position: index + 1,
    total: flat.length,
  }
}

export const enrolmentStats = [
  { label: "Selected applicants", value: "48", hint: "Ready for enrolment" },
  { label: "Accounts activated", value: "31", hint: "65% of selected" },
  { label: "Allocated to cohorts", value: "29", hint: "2 awaiting placement" },
  { label: "Onboarding complete", value: "24", hint: "Access unlocked" },
]

export const learningHubStats = [
  { label: "Overall progress", value: "62%", hint: "7 of 10 modules underway" },
  { label: "Lessons completed", value: "18", hint: "Of 28 assigned" },
  { label: "This week", value: "4", hint: "Live + self-paced slots" },
  { label: "Next deadline", value: "14 Feb", hint: "Market access brief" },
]
