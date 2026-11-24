import type { ReactNode } from "react"

import { PageHeader } from "@/shared/components/page-layout"

/**
 * Narrative page header used on dashboards and hubs.
 * Prefer `PageLayout variant="story"` for new pages.
 */
export function PageIntro({
  eyebrow,
  title,
  description,
  action,
  className,
}: {
  eyebrow?: string
  title: string
  description: string
  action?: ReactNode
  className?: string
}) {
  return (
    <PageHeader
      variant="story"
      eyebrow={eyebrow}
      title={title}
      description={description}
      actions={action}
      className={className}
    />
  )
}
