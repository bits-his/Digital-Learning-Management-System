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
    <SidebarHeader className="h-16 justify-center border-b border-sidebar-border p-2">
      <SidebarMenu>
        <SidebarMenuItem>
          <SidebarMenuButton size="lg" className="h-12" asChild>
            <NavLink to={to}>
              <div className="relative flex aspect-square size-9 items-center justify-center overflow-hidden rounded-md bg-sidebar-primary text-sm font-bold text-sidebar-primary-foreground">
                A
                <span
                  aria-hidden
                  className="absolute inset-x-0 bottom-0 h-1 bg-white/50"
                />
              </div>
              <div className="grid flex-1 text-left leading-tight">
                <span className="truncate font-heading text-base font-semibold">
                  AAIIRI
                </span>
                <span className="truncate text-[0.65rem] tracking-[0.14em] text-sidebar-foreground/65 uppercase">
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
