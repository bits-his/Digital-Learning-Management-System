import { Link } from "react-router-dom"

import { cn } from "@/lib/utils"

export function BrandMark({
  className,
  to = "/",
  light = false,
}: {
  className?: string
  to?: string
  light?: boolean
}) {
  return (
    <Link
      to={to}
      className={cn(
        "group flex items-center gap-3 font-heading font-semibold tracking-tight",
        light ? "text-white" : "text-foreground",
        className
      )}
    >
      <span
        className={cn(
          "relative flex size-9 items-center justify-center overflow-hidden rounded-md text-sm font-bold",
          light
            ? "bg-white/15 text-white ring-1 ring-white/25"
            : "bg-primary text-primary-foreground"
        )}
      >
        <span className="relative z-10">A</span>
        <span
          aria-hidden
          className="absolute inset-x-0 bottom-0 h-1 bg-[var(--sidebar-primary)]"
        />
      </span>
      <span className="flex flex-col leading-none">
        <span className="text-lg">AAIIRI</span>
        <span
          className={cn(
            "text-[0.65rem] font-sans font-medium tracking-[0.18em] uppercase",
            light ? "text-white/70" : "text-muted-foreground"
          )}
        >
          Digital Learning
        </span>
      </span>
    </Link>
  )
}
