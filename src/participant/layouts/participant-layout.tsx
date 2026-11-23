import { Outlet, useLocation } from "react-router-dom"

import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { ParticipantSidebar } from "@/participant/components/participant-sidebar"
import { SiteHeader } from "@/shared/components/site-header"

const titles: Record<string, { title: string; subtitle: string }> = {
  "/participant": {
    title: "Your hub",
    subtitle: "One next step at a time",
  },
  "/participant/onboarding": {
    title: "Onboarding",
    subtitle: "Unlock programme access",
  },
  "/participant/courses": {
    title: "My courses",
    subtitle: "Curriculum progress",
  },
  "/participant/timetable": {
    title: "Timetable",
    subtitle: "Published cohort schedule",
  },
  "/participant/sessions": {
    title: "Live sessions",
    subtitle: "Programme timetable",
  },
  "/participant/assignments": {
    title: "Assignments",
    subtitle: "Submit evidence, get feedback",
  },
  "/participant/quizzes": {
    title: "Quizzes",
    subtitle: "Quick proof of learning",
  },
  "/participant/performance": {
    title: "Performance",
    subtitle: "Scores with denominators",
  },
  "/participant/mentorship": {
    title: "Mentorship",
    subtitle: "Relationship & sessions",
  },
  "/participant/readiness": {
    title: "Business readiness",
    subtitle: "Unlock commercial intros",
  },
  "/participant/opportunities": {
    title: "Opportunities",
    subtitle: "Investors, buyers & outcomes",
  },
  "/participant/certificates": {
    title: "Certificates",
    subtitle: "Eligibility & verification",
  },
  "/participant/profile": {
    title: "Business profile",
    subtitle: "Your enterprise story",
  },
}

function resolveMeta(pathname: string) {
  if (pathname.includes("/lessons/")) {
    return { title: "Lesson", subtitle: "Learn and mark complete" }
  }
  if (pathname.startsWith("/participant/courses/")) {
    return { title: "Course", subtitle: "Modules and progress" }
  }
  return (
    titles[pathname] ?? {
      title: "Participant",
      subtitle: "AAIIRI hub",
    }
  )
}

export function ParticipantLayout() {
  const { pathname } = useLocation()
  const meta = resolveMeta(pathname)

  return (
    <SidebarProvider>
      <ParticipantSidebar />
      <SidebarInset className="bg-transparent">
        <SiteHeader title={meta.title} subtitle={meta.subtitle} />
        <div className="flex flex-1 flex-col gap-4 p-4 md:p-8">
          <Outlet />
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
