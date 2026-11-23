import type { ReactNode } from "react"

import { cn } from "@/lib/utils"

export function WorkList({
  children,
  className,
}: {
  children: ReactNode
  className?: string
}) {
  return (
    <div
      className={cn(
        "divide-y divide-foreground/10 overflow-hidden rounded-xl border border-foreground/10 bg-card/70 backdrop-blur-sm",
        className
      )}
    >
      {children}
    </div>
  )
}

export function WorkRow({
  title,
  meta,
  status,
  action,
  children,
  className,
}: {
  title: string
  meta?: string
  status?: ReactNode
  action?: ReactNode
  children?: ReactNode
  className?: string
}) {
  return (
    <article className={cn("flex flex-col gap-3 p-4 md:p-5", className)}>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0 space-y-1">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="font-heading text-lg font-medium">{title}</h3>
            {status}
          </div>
          {meta ? (
            <p className="text-sm text-muted-foreground">{meta}</p>
          ) : null}
        </div>
        {action ? <div className="shrink-0">{action}</div> : null}
      </div>
      {children}
    </article>
  )
}

export function StatusLabel({
  children,
  tone = "neutral",
}: {
  children: ReactNode
  tone?: "neutral" | "attention" | "success" | "primary"
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-md px-2 py-0.5 text-xs font-medium tracking-wide",
        tone === "neutral" && "bg-foreground/8 text-foreground",
        tone === "attention" && "bg-attention/20 text-attention-foreground",
        tone === "success" && "bg-success/15 text-success",
        tone === "primary" && "bg-primary/12 text-primary"
      )}
    >
      {children}
    </span>
  )
}

export function HonestProgress({
  label,
  value,
  max,
  percent,
}: {
  label: string
  value?: number
  max?: number
  percent?: number
}) {
  const width =
    percent ??
    (value !== undefined && max ? Math.round((value / max) * 100) : 0)

  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between gap-3 text-sm">
        <span className="text-muted-foreground">{label}</span>
        <span className="font-medium tabular-nums">
          {value !== undefined && max !== undefined
            ? `${value} of ${max}`
            : `${width}%`}
        </span>
      </div>
      <div className="progress-track">
        <div className="progress-fill" style={{ width: `${width}%` }} />
      </div>
    </div>
  )
}
