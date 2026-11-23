import {
  BookOpenIcon,
  CalendarDaysIcon,
  ChartColumnIcon,
  ClipboardListIcon,
  GavelIcon,
  HandshakeIcon,
  LayoutDashboardIcon,
  ListChecksIcon,
  ScaleIcon,
  TimerIcon,
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
      {
        title: "Criteria",
        url: "/admin/selection/criteria",
        icon: ListChecksIcon,
      },
      {
        title: "Deadlines",
        url: "/admin/selection/deadlines",
        icon: TimerIcon,
      },
      {
        title: "Decisions",
        url: "/admin/selection/decisions",
        icon: ScaleIcon,
      },
      {
        title: "Audit trail",
        url: "/admin/selection/audit",
        icon: GavelIcon,
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
    label: "Engagement",
    items: [
      {
        title: "Matchmaking",
        url: "/admin/matchmaking",
        icon: HandshakeIcon,
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
