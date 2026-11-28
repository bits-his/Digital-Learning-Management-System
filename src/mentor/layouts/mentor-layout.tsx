import { Outlet, useLocation } from "react-router-dom"

import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { MentorSidebar } from "@/mentor/components/mentor-sidebar"
import { SiteHeader } from "@/shared/components/site-header"

const titles: Record<string, { title: string; subtitle: string }> = {
  "/mentor": {
    title: "Mentor desk",
    subtitle: "Who needs you next",
  },
  "/mentor/mentees": {
    title: "Conversations",
    subtitle: "Guide mentees in the thread",
  },
  "/mentor/sessions": {
    title: "Sessions",
    subtitle: "Live meetings & records",
  },
  "/mentor/reports": {
    title: "Reports",
    subtitle: "Signal for the programme",
  },
}

export function MentorLayout() {
  const { pathname } = useLocation()
  const meta = titles[pathname] ?? {
    title: "Mentor",
    subtitle: "AAIIRI hub",
  }

  return (
    <SidebarProvider>
      <MentorSidebar />
      <SidebarInset className="flex min-h-svh flex-col overflow-hidden bg-transparent">
        <SiteHeader title={meta.title} subtitle={meta.subtitle} />
        <div
          data-slot="app-scroll"
          className="flex min-h-0 flex-1 flex-col gap-4 overflow-auto p-4 md:p-6"
        >
          <Outlet />
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
