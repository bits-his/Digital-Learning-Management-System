import {
  AwardIcon,
  BookOpenIcon,
  BriefcaseBusinessIcon,
  Building2Icon,
  CalendarDaysIcon,
  ChartColumnIcon,
  ClipboardCheckIcon,
  ClipboardListIcon,
  FileSpreadsheetIcon,
  GraduationCapIcon,
  HandshakeIcon,
  LayoutDashboardIcon,
  MessagesSquareIcon,
  PenLineIcon,
  UserCheckIcon,
  UsersIcon,
} from "lucide-react"

import {
  Sidebar,
  SidebarContent,
  SidebarRail,
} from "@/components/ui/sidebar"
import { AppSidebarBrand } from "@/shared/components/app-sidebar-brand"
import {
  SidebarNavSections,
  type SidebarNavSection,
} from "@/shared/components/sidebar-nav"

const sections: SidebarNavSection[] = [
  {
    label: "Overview",
    items: [
      {
        title: "Dashboard",
        url: "/admin",
        icon: LayoutDashboardIcon,
        end: true,
      },
    ],
  },
  {
    label: "Selection",
    items: [
      {
        title: "Applications",
        url: "/admin/applications",
        icon: ClipboardListIcon,
      },
      { title: "Cohorts", url: "/admin/cohorts", icon: UsersIcon },
    ],
  },
  {
    label: "Learning",
    items: [
      { title: "Courses", url: "/admin/courses", icon: BookOpenIcon },
      {
        title: "Live sessions",
        url: "/admin/sessions",
        icon: CalendarDaysIcon,
      },
    ],
  },
  {
    label: "Assessment",
    items: [
      {
        title: "Assessments",
        url: "/admin/assessments",
        icon: FileSpreadsheetIcon,
      },
      {
        title: "Assignments",
        url: "/admin/assignments",
        icon: ClipboardCheckIcon,
      },
      { title: "Grading", url: "/admin/grading", icon: PenLineIcon },
      {
        title: "Performance",
        url: "/admin/performance",
        icon: ChartColumnIcon,
      },
    ],
  },
  {
    label: "Mentorship",
    items: [
      { title: "Mentors", url: "/admin/mentors", icon: GraduationCapIcon },
      {
        title: "Allocations",
        url: "/admin/allocations",
        icon: UserCheckIcon,
      },
      {
        title: "Sessions",
        url: "/admin/mentorship-sessions",
        icon: MessagesSquareIcon,
      },
      {
        title: "Reports",
        url: "/admin/mentor-reports",
        icon: ClipboardListIcon,
      },
    ],
  },
  {
    label: "Matchmaking",
    items: [
      {
        title: "Partners",
        url: "/admin/partners",
        icon: BriefcaseBusinessIcon,
      },
      {
        title: "Enterprises",
        url: "/admin/enterprises",
        icon: Building2Icon,
      },
      {
        title: "Pipeline",
        url: "/admin/matchmaking",
        icon: HandshakeIcon,
      },
      {
        title: "Meetings",
        url: "/admin/match-meetings",
        icon: CalendarDaysIcon,
      },
      {
        title: "Outcomes",
        url: "/admin/match-outcomes",
        icon: ClipboardCheckIcon,
      },
    ],
  },
  {
    label: "Recognition",
    items: [
      {
        title: "Certification",
        url: "/admin/certification",
        icon: AwardIcon,
      },
    ],
  },
  {
    label: "Insights",
    items: [
      { title: "Analytics", url: "/admin/analytics", icon: ChartColumnIcon },
    ],
  },
]

export function AdminSidebar(props: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <AppSidebarBrand to="/admin" subtitle="Admin console" />
      <SidebarContent className="gap-0">
        <SidebarNavSections sections={sections} />
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  )
}
