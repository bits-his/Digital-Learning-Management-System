import {
  ClipboardListIcon,
  LayoutDashboardIcon,
  MessagesSquareIcon,
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
        url: "/mentor",
        icon: LayoutDashboardIcon,
        end: true,
      },
    ],
  },
  {
    label: "Mentorship",
    items: [
      {
        title: "Conversations",
        url: "/mentor/mentees",
        icon: MessagesSquareIcon,
      },
      {
        title: "Sessions",
        url: "/mentor/sessions",
        icon: UsersIcon,
      },
      {
        title: "Reports",
        url: "/mentor/reports",
        icon: ClipboardListIcon,
      },
    ],
  },
]

export function MentorSidebar(props: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <AppSidebarBrand to="/mentor" subtitle="Mentor hub" />
      <SidebarContent className="gap-0">
        <SidebarNavSections sections={sections} />
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  )
}
