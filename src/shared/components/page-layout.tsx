import type { ReactNode } from "react"
import { Link } from "react-router-dom"
import { ArrowLeftIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

/**
 * Page layout variants — pick one per screen:
 *
 * - `story`     Dashboards / narrative hubs. Eyebrow + larger title.
 * - `standard`  List / ops screens. Compact title + description + actions.
 * - `detail`    Record pages. Optional back link + meta row.
 * - `form`      Focused flows. Narrow column, calm title.
 * - `bare`      Content only (SiteHeader already carries the title).
 */
export type PageLayoutVariant =
  | "story"
  | "standard"
  | "detail"
  | "form"
  | "bare"

const shellGap: Record<PageLayoutVariant, string> = {
  story: "gap-8",
  standard: "gap-6",
  detail: "gap-6",
  form: "gap-8",
  bare: "gap-6",
}

const titleClass: Record<Exclude<PageLayoutVariant, "bare">, string> = {
  story: "font-heading text-2xl font-semibold tracking-tight text-balance md:text-3xl",
  standard:
    "font-heading text-xl font-semibold tracking-tight text-balance md:text-2xl",
  detail:
    "font-heading text-xl font-semibold tracking-tight text-balance md:text-2xl",
  form: "font-heading text-xl font-semibold tracking-tight text-balance md:text-2xl",
}

const descriptionClass: Record<Exclude<PageLayoutVariant, "bare">, string> = {
  story: "max-w-xl text-sm leading-relaxed text-muted-foreground md:text-base",
  standard: "max-w-2xl text-sm text-muted-foreground",
  detail: "text-sm text-muted-foreground",
  form: "max-w-xl text-sm text-muted-foreground",
}

export type PageHeaderProps = {
  variant?: Exclude<PageLayoutVariant, "bare">
  eyebrow?: string
  title: ReactNode
  description?: ReactNode
  /** Right-side actions (buttons, filters) */
  actions?: ReactNode
  /** Extra line under the description (badges, ids, status) */
  meta?: ReactNode
  /** Detail-only: back navigation */
  back?: { to: string; label?: string }
  className?: string
}

export function PageHeader({
  variant = "standard",
  eyebrow,
  title,
  description,
  actions,
  meta,
  back,
  className,
}: PageHeaderProps) {
  const isStory = variant === "story"

  return (
    <header
      className={cn(
        "story-enter flex flex-col gap-4",
        isStory && "border-b border-foreground/10 pb-6",
        (actions || variant === "detail") &&
          "md:flex-row md:items-end md:justify-between",
        className
      )}
    >
      <div className={cn("min-w-0", isStory ? "max-w-2xl space-y-2" : "space-y-1.5")}>
        {back ? (
          <Button
            variant="ghost"
            size="sm"
            className="-ml-2 mb-1 h-8 gap-1.5 px-2 text-muted-foreground"
            asChild
          >
            <Link to={back.to}>
              <ArrowLeftIcon className="size-3.5" />
              {back.label ?? "Back"}
            </Link>
          </Button>
        ) : null}

        {eyebrow ? (
          <p className="text-xs font-medium tracking-[0.16em] text-primary uppercase">
            {eyebrow}
          </p>
        ) : null}

        <h1 className={titleClass[variant]}>{title}</h1>

        {description ? (
          <div className={descriptionClass[variant]}>{description}</div>
        ) : null}

        {meta ? <div className="pt-0.5 text-sm text-muted-foreground">{meta}</div> : null}
      </div>

      {actions ? (
        <div className="flex shrink-0 flex-wrap items-center gap-2">{actions}</div>
      ) : null}
    </header>
  )
}

export type PageLayoutProps = {
  variant?: PageLayoutVariant
  /** Max width of the content column. Defaults: form → 3xl, others → full */
  width?: "full" | "3xl" | "4xl" | "5xl"
  eyebrow?: string
  title?: ReactNode
  description?: ReactNode
  actions?: ReactNode
  meta?: ReactNode
  back?: { to: string; label?: string }
  /** Optional custom header instead of the built-in PageHeader */
  header?: ReactNode
  className?: string
  children: ReactNode
}

const widthClass = {
  full: "w-full",
  "3xl": "mx-auto w-full max-w-3xl",
  "4xl": "mx-auto w-full max-w-4xl",
  "5xl": "mx-auto w-full max-w-5xl",
} as const

export function PageLayout({
  variant = "standard",
  width,
  eyebrow,
  title,
  description,
  actions,
  meta,
  back,
  header,
  className,
  children,
}: PageLayoutProps) {
  const resolvedWidth =
    width ?? (variant === "form" ? "3xl" : "full")

  const showHeader =
    header ??
    (variant !== "bare" && title != null ? (
      <PageHeader
        variant={variant}
        eyebrow={eyebrow}
        title={title}
        description={description}
        actions={actions}
        meta={meta}
        back={back}
      />
    ) : null)

  return (
    <div
      className={cn(
        "flex flex-col",
        shellGap[variant],
        widthClass[resolvedWidth],
        className
      )}
    >
      {showHeader}
      {children}
    </div>
  )
}
