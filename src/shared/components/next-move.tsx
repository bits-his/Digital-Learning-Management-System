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
        "story-enter-delay relative overflow-hidden rounded-xl border border-foreground/10 bg-card/80 p-5 backdrop-blur-sm md:p-6",
        className
      )}
    >
      <div
        aria-hidden
        className="pointer-events-none absolute -right-8 -top-10 size-40 rounded-full bg-primary/10 blur-2xl"
      />
      <div className="relative flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="space-y-2">
          <p className="text-xs font-semibold tracking-[0.16em] text-primary uppercase">
            {label}
          </p>
          <h2 className="font-heading text-2xl font-semibold text-balance">
            {title}
          </h2>
          <p className="max-w-xl text-sm leading-relaxed text-muted-foreground">
            {detail}
          </p>
        </div>
        {to ? (
          <Button
            size="lg"
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
            size="lg"
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
