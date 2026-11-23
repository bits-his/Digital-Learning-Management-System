import { Outlet, useLocation } from "react-router-dom"

import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { AdminSidebar } from "@/admin/components/admin-sidebar"
import { SiteHeader } from "@/shared/components/site-header"

const titles: Record<string, string> = {
  "/admin": "Dashboard",
  "/admin/applications": "Applications",
  "/admin/selection/criteria": "Scoring criteria",
  "/admin/selection/deadlines": "Deadlines",
  "/admin/selection/decisions": "Decisions",
  "/admin/selection/audit": "Audit trail",
  "/admin/cohorts": "Cohorts",
  "/admin/courses": "Courses",
  "/admin/sessions": "Live sessions",
  "/admin/matchmaking": "Matchmaking",
  "/admin/analytics": "Analytics",
}

export function AdminLayout() {
  const { pathname } = useLocation()
  const title =
    titles[pathname] ??
    (pathname.startsWith("/admin/applications/")
      ? "Application review"
      : "Admin")

  return (
    <SidebarProvider>
      <AdminSidebar />
      <SidebarInset>
        <SiteHeader title={title} />
        <div className="flex flex-1 flex-col gap-4 p-4 md:p-6">
          <Outlet />
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
