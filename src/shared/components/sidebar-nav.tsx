import type { LucideIcon } from "lucide-react"
import { NavLink, useLocation } from "react-router-dom"

import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"

export type SidebarNavItem = {
  title: string
  url: string
  icon: LucideIcon
  end?: boolean
}

export type SidebarNavSection = {
  label: string
  items: SidebarNavItem[]
}

function isItemActive(pathname: string, item: SidebarNavItem) {
  if (item.end) return pathname === item.url
  return pathname === item.url || pathname.startsWith(`${item.url}/`)
}

export function SidebarNavSections({
  sections,
}: {
  sections: SidebarNavSection[]
}) {
  const location = useLocation()

  return (
    <>
      {sections.map((section) => (
        <SidebarGroup key={section.label}>
          <SidebarGroupLabel className="text-[11px] font-semibold tracking-[0.08em] text-sidebar-foreground/50 uppercase">
            {section.label}
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {section.items.map((item) => {
                const Icon = item.icon
                const active = isItemActive(location.pathname, item)

                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      asChild
                      isActive={active}
                      tooltip={item.title}
                    >
                      <NavLink to={item.url} end={item.end}>
                        <Icon />
                        <span>{item.title}</span>
                      </NavLink>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                )
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      ))}
    </>
  )
}
