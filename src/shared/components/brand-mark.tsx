import { LeafIcon } from "lucide-react"
import { Link } from "react-router-dom"

import { cn } from "@/lib/utils"

export function BrandMark({
  className,
  to = "/",
}: {
  className?: string
  to?: string
}) {
  return (
    <Link
      to={to}
      className={cn("flex items-center gap-2 font-heading font-semibold", className)}
    >
      <span className="flex size-7 items-center justify-center rounded-md bg-primary text-primary-foreground">
        <LeafIcon className="size-4" />
      </span>
      <span className="tracking-tight">AAIIRI</span>
    </Link>
  )
}
