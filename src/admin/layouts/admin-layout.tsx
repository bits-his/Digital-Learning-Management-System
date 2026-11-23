import { Outlet, useLocation } from "react-router-dom"

import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { AdminSidebar } from "@/admin/components/admin-sidebar"
import { SiteHeader } from "@/shared/components/site-header"

const titles: Record<string, { title: string; subtitle: string }> = {
  "/admin": {
    title: "Programme overview",
    subtitle: "What needs attention across the bootcamp",
  },
  "/admin/applications": {
    title: "Applications",
    subtitle: "Selection pipeline",
  },
  "/admin/enrolment": {
    title: "Enrolment",
    subtitle: "Allocate cohorts and activate accounts",
  },
  "/admin/cohorts": { title: "Cohorts", subtitle: "Group delivery" },
  "/admin/courses": { title: "Courses", subtitle: "Learning catalogue" },
  "/admin/sessions": { title: "Live sessions", subtitle: "Programme timetable" },
  "/admin/assessments": {
    title: "Assessments",
    subtitle: "Quizzes & exams",
  },
  "/admin/assignments": {
    title: "Assignments",
    subtitle: "Evidence briefs",
  },
  "/admin/grading": {
    title: "Grading",
    subtitle: "Who needs your score next",
  },
  "/admin/performance": {
    title: "Performance",
    subtitle: "Competency evidence",
  },
  "/admin/mentors": { title: "Mentors", subtitle: "Network & capacity" },
  "/admin/allocations": {
    title: "Allocations",
    subtitle: "Mentor matching",
  },
  "/admin/mentorship-sessions": {
    title: "Mentorship sessions",
    subtitle: "Schedule & attendance",
  },
  "/admin/mentor-reports": {
    title: "Mentor reports",
    subtitle: "Development signal",
  },
  "/admin/partners": {
    title: "Partners",
    subtitle: "Investors & buyers",
  },
  "/admin/enterprises": {
    title: "Enterprises",
    subtitle: "Startup profiles & readiness",
  },
  "/admin/matchmaking": {
    title: "Match pipeline",
    subtitle: "Recommendations & requests",
  },
  "/admin/match-meetings": {
    title: "Match meetings",
    subtitle: "Scheduling & records",
  },
  "/admin/match-outcomes": {
    title: "Outcomes",
    subtitle: "Follow-ups & results",
  },
  "/admin/certification": {
    title: "Certification",
    subtitle: "Rules, issue & verify",
  },
  "/admin/analytics": { title: "Analytics", subtitle: "Programme insights" },
}

function resolveMeta(pathname: string) {
  if (pathname.startsWith("/admin/courses/")) {
    return {
      title: "Course curriculum",
      subtitle: "Modules, lessons & cohort access",
    }
  }
  return (
    titles[pathname] ?? {
      title: "Admin",
      subtitle: "AAIIRI console",
    }
  )
}

export function AdminLayout() {
  const { pathname } = useLocation()
  const meta = resolveMeta(pathname)

  return (
    <SidebarProvider>
      <AdminSidebar />
      <SidebarInset className="bg-transparent">
        <SiteHeader title={meta.title} subtitle={meta.subtitle} />
        <div className="flex flex-1 flex-col gap-4 p-4 md:p-8">
          <Outlet />
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
