import { CheckIcon } from "lucide-react"

import { cn } from "@/lib/utils"

export type JourneyStep = {
  id: string
  label: string
  state: "done" | "current" | "upcoming"
}

export function JourneyRail({
  steps,
  className,
}: {
  steps: JourneyStep[]
  className?: string
}) {
  return (
    <ol
      className={cn(
        "story-enter-late grid gap-2 sm:grid-cols-4",
        className
      )}
      aria-label="Journey progress"
    >
      {steps.map((step, index) => (
        <li
          key={step.id}
          className={cn(
            "relative flex items-center gap-3 rounded-lg border px-3 py-2.5 text-sm",
            step.state === "current" &&
              "border-primary/40 bg-primary/8 text-foreground",
            step.state === "done" &&
              "border-success/25 bg-success/8 text-foreground",
            step.state === "upcoming" &&
              "border-transparent bg-foreground/[0.03] text-muted-foreground"
          )}
        >
          <span
            className={cn(
              "flex size-7 shrink-0 items-center justify-center rounded-md text-xs font-semibold",
              step.state === "current" && "bg-primary text-primary-foreground",
              step.state === "done" && "bg-success text-white",
              step.state === "upcoming" && "bg-foreground/10"
            )}
          >
            {step.state === "done" ? (
              <CheckIcon className="size-3.5" />
            ) : (
              index + 1
            )}
          </span>
          <span className="font-medium leading-tight">{step.label}</span>
        </li>
      ))}
    </ol>
  )
}
