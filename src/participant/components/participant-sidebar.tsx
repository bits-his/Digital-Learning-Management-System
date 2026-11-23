import {
  AwardIcon,
  BookOpenIcon,
  CalendarDaysIcon,
  ClipboardCheckIcon,
  GaugeIcon,
  LayoutDashboardIcon,
  RouteIcon,
  UserRoundIcon,
  CalendarRangeIcon,
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
        url: "/participant",
        icon: LayoutDashboardIcon,
        end: true,
      },
      {
        title: "Onboarding",
        url: "/participant/onboarding",
        icon: RouteIcon,
      },
    ],
  },
  {
    label: "Learning",
    items: [
      {
        title: "My courses",
        url: "/participant/courses",
        icon: BookOpenIcon,
      },
      {
        title: "Timetable",
        url: "/participant/timetable",
        icon: CalendarRangeIcon,
      },
      {
        title: "Live sessions",
        url: "/participant/sessions",
        icon: CalendarDaysIcon,
      },
      {
        title: "Assignments",
        url: "/participant/assignments",
        icon: ClipboardCheckIcon,
      },
    ],
  },
  {
    label: "Growth",
    items: [
      {
        title: "Readiness",
        url: "/participant/readiness",
        icon: GaugeIcon,
      },
      {
        title: "Certificates",
        url: "/participant/certificates",
        icon: AwardIcon,
      },
    ],
  },
  {
    label: "Account",
    items: [
      {
        title: "Profile",
        url: "/participant/profile",
        icon: UserRoundIcon,
      },
    ],
  },
]

export function ParticipantSidebar(
  props: React.ComponentProps<typeof Sidebar>
) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <AppSidebarBrand to="/participant" subtitle="Participant hub" />
      <SidebarContent className="gap-0">
        <SidebarNavSections sections={sections} />
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  )
}
