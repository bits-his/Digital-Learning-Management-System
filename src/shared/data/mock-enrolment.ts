export type AccountStatus = "Pending activation" | "Invited" | "Activated"
export type OnboardingStatus = "Not started" | "In progress" | "Complete"
export type CohortStatus = "Planning" | "Onboarding" | "Active" | "Alumni"

export type EnrolmentCandidate = {
  id: string
  name: string
  business: string
  country: string
  sector: string
  email: string
  applicationId: string
  score: number
  accountStatus: AccountStatus
  cohortId: string | null
  onboarding: OnboardingStatus
  avatar?: string
  phone?: string
  notes?: string
}

export type Facilitator = {
  id: string
  name: string
  role: string
  email?: string
}

export type Cohort = {
  id: string
  name: string
  status: CohortStatus
  capacity: number
  startDate: string
  endDate: string
  programme: string
  facilitators: Facilitator[]
  progress: number
  description: string
  timetablePublished: boolean
}

/** Shared facilitator directory admins can assign to cohorts */
export const facilitatorDirectory: Facilitator[] = [
  {
    id: "fac-1",
    name: "Dr. Ngozi Adeyemi",
    role: "Lead Facilitator · Strategy",
    email: "ngozi@aaiiri.org",
  },
  {
    id: "fac-2",
    name: "Aisha Mohammed",
    role: "Trade & Export Specialist",
    email: "aisha@aaiiri.org",
  },
  {
    id: "fac-3",
    name: "Tunde Bakare",
    role: "Investment Readiness Coach",
    email: "tunde@aaiiri.org",
  },
  {
    id: "fac-4",
    name: "Ibrahim Sesay",
    role: "Facilitator · Financial Management",
    email: "ibrahim@aaiiri.org",
  },
  {
    id: "fac-5",
    name: "Ada Okonkwo",
    role: "Programme Manager",
    email: "admin@aaiiri.org",
  },
  {
    id: "fac-6",
    name: "Kofi Asante",
    role: "Facilitator · Market Access",
    email: "kofi@aaiiri.org",
  },
  {
    id: "fac-7",
    name: "Mariam Diallo",
    role: "Facilitator · Pitch Development",
    email: "mariam@aaiiri.org",
  },
]

export type TimetableSlot = {
  id: string
  cohortId: string
  day: string
  date: string
  time: string
  title: string
  type: "Live session" | "Self-paced" | "Clinic" | "Office hours"
  courseId?: string
  lessonId?: string
  facilitator: string
  location: string
}

export const initialCohorts: Cohort[] = [
  {
    id: "cohort-1",
    name: "2027 Cohort 1",
    status: "Active",
    capacity: 45,
    startDate: "9 Feb 2027",
    endDate: "27 Mar 2027",
    programme: "2027 Bootcamp",
    progress: 64,
    description: "",
    timetablePublished: true,
    facilitators: [
      {
        id: "fac-1",
        name: "Dr. Ngozi Adeyemi",
        role: "Lead Facilitator · Strategy",
      },
      {
        id: "fac-2",
        name: "Aisha Mohammed",
        role: "Trade & Export Specialist",
      },
      {
        id: "fac-3",
        name: "Tunde Bakare",
        role: "Investment Readiness Coach",
      },
    ],
  },
  {
    id: "cohort-2",
    name: "2027 Cohort 2",
    status: "Onboarding",
    capacity: 40,
    startDate: "2 Mar 2027",
    endDate: "17 Apr 2027",
    programme: "2027 Bootcamp",
    progress: 12,
    description: "",
    timetablePublished: false,
    facilitators: [
      {
        id: "fac-2",
        name: "Aisha Mohammed",
        role: "Trade & Export Specialist",
      },
      {
        id: "fac-4",
        name: "Ibrahim Sesay",
        role: "Facilitator · Financial Management",
      },
    ],
  },
  {
    id: "cohort-3",
    name: "2027 Cohort 3",
    status: "Planning",
    capacity: 40,
    startDate: "5 Apr 2027",
    endDate: "21 May 2027",
    programme: "2027 Bootcamp",
    progress: 0,
    description: "",
    timetablePublished: false,
    facilitators: [],
  },
  {
    id: "cohort-4",
    name: "2026 Autumn Intake",
    status: "Alumni",
    capacity: 36,
    startDate: "8 Sep 2026",
    endDate: "24 Oct 2026",
    programme: "2026 Bootcamp",
    progress: 100,
    description: "",
    timetablePublished: false,
    facilitators: [
      {
        id: "fac-1",
        name: "Dr. Ngozi Adeyemi",
        role: "Lead Facilitator · Strategy",
      },
    ],
  },
  {
    id: "cohort-5",
    name: "Export Accelerator — Pilot",
    status: "Active",
    capacity: 25,
    startDate: "12 Jan 2027",
    endDate: "6 Mar 2027",
    programme: "Export Accelerator",
    progress: 41,
    description: "",
    timetablePublished: true,
    facilitators: [
      {
        id: "fac-2",
        name: "Aisha Mohammed",
        role: "Trade & Export Specialist",
      },
      {
        id: "fac-6",
        name: "Kofi Asante",
        role: "Facilitator · Market Access",
      },
    ],
  },
  {
    id: "cohort-alumni",
    name: "Alumni Network",
    status: "Alumni",
    capacity: 200,
    startDate: "2025",
    endDate: "Ongoing",
    programme: "AAIIRI Alumni",
    progress: 100,
    description: "",
    timetablePublished: false,
    facilitators: [
      {
        id: "fac-5",
        name: "Ada Okonkwo",
        role: "Programme Manager",
      },
    ],
  },
]

export const initialCandidates: EnrolmentCandidate[] = [
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
    cohortId: null,
    onboarding: "Not started",
    phone: "+233 24 555 0192",
    notes: "Approved after document resubmission.",
    avatar:
      "https://images.unsplash.com/photo-1531123897727-8f129e1688ce?w=160&h=160&fit=crop&crop=face",
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
    cohortId: "cohort-2",
    onboarding: "Not started",
    phone: "+234 803 441 2201",
    notes: "Invite sent 20 Nov — awaiting activation.",
    avatar:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=160&h=160&fit=crop&crop=face",
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
    cohortId: "cohort-1",
    onboarding: "Complete",
    phone: "+221 77 512 8830",
    avatar:
      "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=160&h=160&fit=crop&crop=face",
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
    cohortId: "cohort-1",
    onboarding: "Complete",
    phone: "+234 809 112 7784",
    avatar:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=160&h=160&fit=crop&crop=face",
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
    cohortId: "cohort-1",
    onboarding: "In progress",
    phone: "+234 701 445 9902",
    notes: "Profile incomplete — markets not set.",
    avatar:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=160&h=160&fit=crop&crop=face",
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
    cohortId: null,
    onboarding: "Not started",
    phone: "+233 20 889 4411",
    avatar:
      "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=160&h=160&fit=crop&crop=face",
  },
  {
    id: "enr-7",
    name: "Zainab Musa",
    business: "Northern Grain Co-op",
    country: "Nigeria",
    sector: "Agriculture",
    email: "zainab@northerngrain.ng",
    applicationId: "APP-2061",
    score: 84,
    accountStatus: "Pending activation",
    cohortId: null,
    onboarding: "Not started",
    phone: "+234 806 221 1180",
    avatar:
      "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=160&h=160&fit=crop&crop=face",
  },
  {
    id: "enr-8",
    name: "Olivier Nkurunziza",
    business: "Kigali Fresh Logistics",
    country: "Rwanda",
    sector: "Export services",
    email: "olivier@kigalifresh.rw",
    applicationId: "APP-2068",
    score: 87,
    accountStatus: "Invited",
    cohortId: "cohort-2",
    onboarding: "Not started",
    phone: "+250 788 334 221",
    avatar:
      "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=160&h=160&fit=crop&crop=face",
  },
  {
    id: "enr-9",
    name: "Blessing Okeke",
    business: "Pearl Cassava Mills",
    country: "Nigeria",
    sector: "Agro-processing",
    email: "blessing@pearlcassava.ng",
    applicationId: "APP-2072",
    score: 83,
    accountStatus: "Pending activation",
    cohortId: null,
    onboarding: "Not started",
  },
  {
    id: "enr-10",
    name: "Ibrahim Touré",
    business: "Sahel Solar Kits",
    country: "Mali",
    sector: "Manufacturing",
    email: "ibrahim@sahelsolar.ml",
    applicationId: "APP-2075",
    score: 80,
    accountStatus: "Pending activation",
    cohortId: null,
    onboarding: "Not started",
  },
  {
    id: "enr-11",
    name: "Grace Wanjiku",
    business: "Nairobi Herb Co",
    country: "Kenya",
    sector: "Agriculture",
    email: "grace@nairobiherb.ke",
    applicationId: "APP-2079",
    score: 89,
    accountStatus: "Pending activation",
    cohortId: null,
    onboarding: "Not started",
  },
  {
    id: "enr-12",
    name: "Daniel Boateng",
    business: "Gold Coast Packaging",
    country: "Ghana",
    sector: "Manufacturing",
    email: "daniel@gcpkg.gh",
    applicationId: "APP-2081",
    score: 85,
    accountStatus: "Pending activation",
    cohortId: null,
    onboarding: "Not started",
  },
  {
    id: "enr-13",
    name: "Halima Abdi",
    business: "Horn Trade Services",
    country: "Ethiopia",
    sector: "Export services",
    email: "halima@horntrade.et",
    applicationId: "APP-2084",
    score: 81,
    accountStatus: "Pending activation",
    cohortId: null,
    onboarding: "Not started",
  },
  {
    id: "enr-14",
    name: "Samuel Adeyemi",
    business: "Lagos Cold Chain",
    country: "Nigeria",
    sector: "Export services",
    email: "samuel@lagoscold.ng",
    applicationId: "APP-2088",
    score: 78,
    accountStatus: "Pending activation",
    cohortId: null,
    onboarding: "Not started",
  },
]

export const initialTimetable: TimetableSlot[] = [
  {
    id: "tt-1",
    cohortId: "cohort-1",
    day: "Monday",
    date: "",
    time: "09:00 – 10:30 WAT",
    title: "Business Strategy kickoff",
    type: "Live session",
    courseId: "crs-1",
    lessonId: "l1",
    facilitator: "Dr. Ngozi Adeyemi",
    location: "Zoom",
  },
  {
    id: "tt-2",
    cohortId: "cohort-1",
    day: "Monday",
    date: "",
    time: "11:00 – 12:30 WAT",
    title: "Module 1 self-paced lessons",
    type: "Self-paced",
    courseId: "crs-1",
    lessonId: "l2",
    facilitator: "Self-directed",
    location: "Learning hub",
  },
  {
    id: "tt-3",
    cohortId: "cohort-1",
    day: "Wednesday",
    date: "",
    time: "09:30 – 11:00 WAT",
    title: "Financial Management Clinic",
    type: "Clinic",
    courseId: "crs-5",
    facilitator: "Tunde Bakare",
    location: "Microsoft Teams",
  },
  {
    id: "tt-4",
    cohortId: "cohort-1",
    day: "Thursday",
    date: "",
    time: "10:00 – 12:00 WAT",
    title: "Export Readiness Workshop",
    type: "Live session",
    courseId: "crs-2",
    lessonId: "l1",
    facilitator: "Aisha Mohammed",
    location: "Zoom",
  },
  {
    id: "tt-5",
    cohortId: "cohort-1",
    day: "Friday",
    date: "",
    time: "16:00 – 17:00 WAT",
    title: "Facilitator office hours",
    type: "Office hours",
    courseId: "crs-1",
    facilitator: "Dr. Ngozi Adeyemi",
    location: "Google Meet",
  },
  {
    id: "tt-6",
    cohortId: "cohort-1",
    day: "Tuesday",
    date: "",
    time: "14:00 – 16:00 WAT",
    title: "AGOA & AfCFTA Briefing",
    type: "Live session",
    courseId: "crs-3",
    lessonId: "l1",
    facilitator: "Aisha Mohammed",
    location: "Zoom",
  },
  {
    id: "tt-7",
    cohortId: "cohort-2",
    day: "Monday",
    date: "",
    time: "09:00 – 10:30 WAT",
    title: "Cohort 2 orientation",
    type: "Live session",
    courseId: "crs-1",
    lessonId: "l1",
    facilitator: "Aisha Mohammed",
    location: "Zoom",
  },
  {
    id: "tt-8",
    cohortId: "cohort-2",
    day: "Wednesday",
    date: "",
    time: "11:00 – 12:30 WAT",
    title: "Export diagnostics workshop",
    type: "Live session",
    courseId: "crs-2",
    lessonId: "l1",
    facilitator: "Aisha Mohammed",
    location: "Microsoft Teams",
  },
]

export function initials(name: string) {
  return name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase()
}

export function nextEnrolmentAction(candidate: EnrolmentCandidate) {
  if (!candidate.cohortId) return "allocate" as const
  if (candidate.accountStatus === "Pending activation") return "invite" as const
  if (candidate.accountStatus === "Invited") return "activate" as const
  if (candidate.onboarding !== "Complete") return "onboarding" as const
  return "ready" as const
}
