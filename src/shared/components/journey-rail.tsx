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
        "story-enter-late grid gap-1.5 sm:grid-cols-4",
        className
      )}
      aria-label="Journey progress"
    >
      {steps.map((step, index) => (
        <li
          key={step.id}
          className={cn(
            "relative flex items-center gap-2 rounded-md border px-2.5 py-1.5 text-xs sm:text-sm",
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
              "flex size-5 shrink-0 items-center justify-center rounded text-[0.65rem] font-semibold sm:size-6",
              step.state === "current" && "bg-primary text-primary-foreground",
              step.state === "done" && "bg-success text-white",
              step.state === "upcoming" && "bg-foreground/10"
            )}
          >
            {step.state === "done" ? (
              <CheckIcon className="size-3" />
            ) : (
              index + 1
            )}
          </span>
          <span className="truncate font-medium leading-tight">{step.label}</span>
        </li>
      ))}
    </ol>
  )
}
