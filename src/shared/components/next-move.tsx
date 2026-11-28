import type { ReactNode } from "react"
import { Link } from "react-router-dom"
import { ArrowRightIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

export function NextMove({
  label = "Your next move",
  title,
  detail,
  cta,
  onClick,
  to,
  tone = "default",
  className,
}: {
  label?: string
  title: string
  detail: string
  cta: string
  onClick?: () => void
  to?: string
  tone?: "default" | "attention"
  className?: string
}) {
  return (
    <section
      className={cn(
        "story-enter-delay relative overflow-hidden rounded-xl border border-foreground/10 bg-card/80 p-4 md:p-5",
        className
      )}
    >
      <div className="relative flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div className="space-y-1">
          <p className="text-[0.65rem] font-semibold tracking-[0.14em] text-primary uppercase">
            {label}
          </p>
          <h2 className="font-heading text-lg font-semibold text-balance md:text-xl">
            {title}
          </h2>
          <p className="max-w-xl text-sm text-muted-foreground">{detail}</p>
        </div>
        {to ? (
          <Button
            size="default"
            className={cn(
              "gap-2",
              tone === "attention" &&
                "bg-attention text-attention-foreground hover:bg-attention/90"
            )}
            asChild
          >
            <Link to={to}>
              {cta}
              <ArrowRightIcon className="size-4" />
            </Link>
          </Button>
        ) : (
          <Button
            size="default"
            className={cn(
              "gap-2",
              tone === "attention" &&
                "bg-attention text-attention-foreground hover:bg-attention/90"
            )}
            onClick={onClick}
          >
            {cta}
            <ArrowRightIcon className="size-4" />
          </Button>
        )}
      </div>
    </section>
  )
}

export function SectionLabel({
  children,
  className,
}: {
  children: ReactNode
  className?: string
}) {
  return (
    <h2
      className={cn(
        "font-heading text-lg font-medium tracking-tight text-foreground",
        className
      )}
    >
      {children}
    </h2>
  )
}
