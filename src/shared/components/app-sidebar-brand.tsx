import { LeafIcon } from "lucide-react"
import { NavLink } from "react-router-dom"

import {
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"

export function AppSidebarBrand({
  to,
  subtitle,
}: {
  to: string
  subtitle: string
}) {
  return (
    <SidebarHeader className="h-16 justify-center border-b border-sidebar-border px-2 py-0">
      <SidebarMenu>
        <SidebarMenuItem>
          <SidebarMenuButton size="lg" className="h-12" asChild>
            <NavLink to={to}>
              <div className="flex aspect-square size-10 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                <LeafIcon className="size-5" />
              </div>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-heading text-base font-semibold">
                  AAIIRI
                </span>
                <span className="truncate text-xs text-muted-foreground">
                  {subtitle}
                </span>
              </div>
            </NavLink>
          </SidebarMenuButton>
        </SidebarMenuItem>
      </SidebarMenu>
    </SidebarHeader>
  )
}
