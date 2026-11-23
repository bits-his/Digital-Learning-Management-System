import {
  AwardIcon,
  BookOpenIcon,
  BriefcaseBusinessIcon,
  CalendarDaysIcon,
  ChartColumnIcon,
  ClipboardCheckIcon,
  FileQuestionIcon,
  GaugeIcon,
  HandshakeIcon,
  LayoutDashboardIcon,
  UserRoundIcon,
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
        title: "Live sessions",
        url: "/participant/sessions",
        icon: CalendarDaysIcon,
      },
    ],
  },
  {
    label: "Assessment",
    items: [
      {
        title: "Assignments",
        url: "/participant/assignments",
        icon: ClipboardCheckIcon,
      },
      {
        title: "Quizzes",
        url: "/participant/quizzes",
        icon: FileQuestionIcon,
      },
      {
        title: "Performance",
        url: "/participant/performance",
        icon: ChartColumnIcon,
      },
    ],
  },
  {
    label: "Growth",
    items: [
      {
        title: "Mentorship",
        url: "/participant/mentorship",
        icon: HandshakeIcon,
      },
      {
        title: "Readiness",
        url: "/participant/readiness",
        icon: GaugeIcon,
      },
      {
        title: "Opportunities",
        url: "/participant/opportunities",
        icon: BriefcaseBusinessIcon,
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
