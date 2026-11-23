import { SidebarTrigger } from "@/components/ui/sidebar"
import { HeaderUser } from "@/shared/components/header-user"
import { ThemeToggle } from "@/shared/components/theme-toggle"

export function SiteHeader({
  title,
  subtitle,
}: {
  title: string
  subtitle?: string
}) {
  return (
    <header className="sticky top-0 z-20 flex h-16 shrink-0 items-center gap-3 border-b border-foreground/8 bg-background/75 px-4 backdrop-blur-md md:px-6">
      <div className="flex min-w-0 flex-1 items-center gap-3">
        <SidebarTrigger className="-ml-1" />
        <div className="min-w-0">
          <p className="truncate font-heading text-lg font-medium leading-tight">
            {title}
          </p>
          {subtitle ? (
            <p className="truncate text-xs text-muted-foreground">{subtitle}</p>
          ) : null}
        </div>
      </div>
      <div className="flex shrink-0 items-center gap-1">
        <ThemeToggle />
        <HeaderUser />
      </div>
    </header>
  )
}
