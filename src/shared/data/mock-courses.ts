export type CourseItem = {
  id: string
  title: string
  summary: string
  duration: string
  level: string
  modules: number
  featured?: boolean
  badge?: string
  tone: "forest" | "slate" | "sand" | "ocean" | "ember"
}

export const mockCourses: CourseItem[] = [
  {
    id: "c1",
    title: "Business Strategy and Investment Readiness",
    summary:
      "Build a clear growth thesis, investor narrative, and readiness checklist for capital conversations.",
    duration: "3h 20m",
    level: "Core",
    modules: 6,
    featured: true,
    badge: "Featured",
    tone: "forest",
  },
  {
    id: "c2",
    title: "Export Readiness and International Trade",
    summary:
      "Map export pathways, compliance basics, and go-to-market steps for regional and global buyers.",
    duration: "2h 45m",
    level: "Core",
    modules: 5,
    tone: "ocean",
  },
  {
    id: "c3",
    title: "AGOA and AfCFTA Opportunities",
    summary:
      "Understand preferential trade frameworks and how SMEs can position for preferential access.",
    duration: "2h 10m",
    level: "Trade",
    modules: 4,
    badge: "New",
    tone: "sand",
  },
  {
    id: "c4",
    title: "North American Market Access",
    summary:
      "Buyer expectations, documentation, and market-entry tactics for North American channels.",
    duration: "2h 30m",
    level: "Trade",
    modules: 5,
    tone: "slate",
  },
  {
    id: "c5",
    title: "Financial Management and Investment Preparation",
    summary:
      "Strengthen books, projections, and investment packs that stand up to diligence.",
    duration: "3h 05m",
    level: "Finance",
    modules: 6,
    tone: "ember",
  },
  {
    id: "c6",
    title: "Off-Takers, Buyers, and Strategic Partnerships",
    summary:
      "Identify partners, structure deals, and prepare for commercial introductions.",
    duration: "2h 00m",
    level: "Growth",
    modules: 4,
    tone: "ocean",
  },
  {
    id: "c7",
    title: "Investor Pitch Development",
    summary:
      "Craft a compelling pitch deck, story arc, and Q&A readiness for investors.",
    duration: "2h 50m",
    level: "Core",
    modules: 5,
    tone: "forest",
  },
  {
    id: "c8",
    title: "Climate-Smart Agriculture and Sustainable Production",
    summary:
      "Adopt climate-smart practices that improve resilience and buyer confidence.",
    duration: "2h 25m",
    level: "Sector",
    modules: 4,
    tone: "sand",
  },
  {
    id: "c9",
    title: "Partnership Development and Business Networking",
    summary:
      "Build a network map and outreach plan for mentors, buyers, and allies.",
    duration: "1h 40m",
    level: "Growth",
    modules: 3,
    tone: "slate",
  },
  {
    id: "c10",
    title: "Investor Matchmaking and Deal Preparation",
    summary:
      "Prepare for introductions, data-room basics, and post-meeting follow-up.",
    duration: "2h 15m",
    level: "Finance",
    modules: 4,
    tone: "ember",
  },
]

export const featuredCourse =
  mockCourses.find((course) => course.featured) ?? mockCourses[0]

export const gridCourses = mockCourses.filter((course) => !course.featured)
