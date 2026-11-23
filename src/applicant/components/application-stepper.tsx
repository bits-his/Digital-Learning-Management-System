import { CheckIcon } from "lucide-react"

import { cn } from "@/lib/utils"

export type StepItem = {
  id: string
  label: string
  description?: string
}

export function ApplicationStepper({
  steps,
  current,
  completed,
  onStepClick,
}: {
  steps: StepItem[]
  current: number
  completed: boolean[]
  onStepClick?: (index: number) => void
}) {
  return (
    <nav aria-label="Application steps" className="w-full">
      <div className="flex items-center">
        {steps.map((step, index) => {
          const isCurrent = index === current
          const isDone = completed[index]
          const connectorDone = completed[index] || current > index

          return (
            <div key={step.id} className="flex min-w-0 flex-1 items-center">
              <div className="flex w-full flex-col items-center gap-2">
                <div className="flex w-full items-center">
                  <div
                    className={cn(
                      "h-0.5 flex-1",
                      index === 0
                        ? "bg-transparent"
                        : completed[index - 1] || current >= index
                          ? "bg-primary"
                          : "bg-border"
                    )}
                  />
                  <button
                    type="button"
                    aria-current={isCurrent ? "step" : undefined}
                    disabled={!onStepClick}
                    onClick={() => onStepClick?.(index)}
                    className={cn(
                      "relative z-10 flex size-9 shrink-0 items-center justify-center rounded-full border-2 text-sm font-semibold transition-colors",
                      onStepClick && "cursor-pointer",
                      (isCurrent || isDone) &&
                        "border-primary bg-primary text-primary-foreground",
                      !isCurrent &&
                        !isDone &&
                        "border-border bg-background text-muted-foreground"
                    )}
                  >
                    {isDone && !isCurrent ? (
                      <CheckIcon className="size-4" />
                    ) : (
                      index + 1
                    )}
                  </button>
                  <div
                    className={cn(
                      "h-0.5 flex-1",
                      index === steps.length - 1
                        ? "bg-transparent"
                        : connectorDone
                          ? "bg-primary"
                          : "bg-border"
                    )}
                  />
                </div>
                <div className="flex flex-col items-center px-1 text-center">
                  <span
                    className={cn(
                      "text-sm font-medium",
                      isCurrent ? "text-foreground" : "text-muted-foreground"
                    )}
                  >
                    {step.label}
                  </span>
                  {step.description ? (
                    <span className="mt-0.5 hidden text-xs text-muted-foreground sm:block">
                      {step.description}
                    </span>
                  ) : null}
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </nav>
  )
}
