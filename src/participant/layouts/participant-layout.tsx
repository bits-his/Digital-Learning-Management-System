import { Outlet, useLocation } from "react-router-dom"

import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { ParticipantSidebar } from "@/participant/components/participant-sidebar"
import { SiteHeader } from "@/shared/components/site-header"

const titles: Record<string, string> = {
  "/participant": "Dashboard",
  "/participant/onboarding": "Onboarding",
  "/participant/courses": "My courses",
  "/participant/timetable": "Timetable",
  "/participant/sessions": "Live sessions",
  "/participant/assignments": "Assignments",
  "/participant/readiness": "Investment readiness",
  "/participant/certificates": "Certificates",
  "/participant/profile": "Business profile",
}

function resolveTitle(pathname: string) {
  if (pathname.includes("/lessons/")) return "Lesson"
  if (pathname.startsWith("/participant/courses/")) return "Course"
  return titles[pathname] ?? "Participant"
}

export function ParticipantLayout() {
  const { pathname } = useLocation()
  const title = resolveTitle(pathname)

  return (
    <SidebarProvider>
      <ParticipantSidebar />
      <SidebarInset>
        <SiteHeader title={title} />
        <div className="flex flex-1 flex-col gap-4 p-4 md:p-6">
          <Outlet />
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
