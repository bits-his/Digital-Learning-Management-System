import { Link } from "react-router-dom"
import { motion } from "motion/react"
import { toast } from "sonner"
import { CalendarPlusIcon } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyTitle,
} from "@/components/ui/empty"
import { useParticipantAccess } from "@/shared/learning/use-participant-access"

const typeTone: Record<string, "default" | "secondary" | "outline"> = {
  "Live session": "default",
  "Self-paced": "secondary",
  Clinic: "outline",
  "Office hours": "outline",
}

export function ParticipantTimetablePage() {
  const { cohort, publishedSlots, hasCohort, onboarded } =
    useParticipantAccess()

  if (!hasCohort) {
    return (
      <Empty className="rounded-2xl border py-16">
        <EmptyHeader>
          <EmptyTitle>No cohort timetable yet</EmptyTitle>
          <EmptyDescription>
            Once you are allocated to a cohort, published sessions will appear
            here.
          </EmptyDescription>
        </EmptyHeader>
      </Empty>
    )
  }

  return (
    <div className="flex flex-col gap-6">
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between"
      >
        <div>
          <p className="text-xs font-medium tracking-[0.18em] text-primary uppercase">
            Programme access
          </p>
          <h1 className="mt-1 font-heading text-3xl font-semibold tracking-tight">
            Learning timetable
          </h1>
          <p className="mt-2 max-w-xl text-sm text-muted-foreground">
            Live sessions, clinics, and self-paced windows for{" "}
            {cohort?.name ?? "your cohort"}.
          </p>
        </div>
        <Button
          variant="outline"
          size="sm"
          disabled={publishedSlots.length === 0}
          onClick={() => toast.success("Calendar export queued (mock)")}
        >
          <CalendarPlusIcon data-icon="inline-start" />
          Add all to calendar
        </Button>
      </motion.div>

      {!onboarded ? (
        <Card className="shadow-none border-primary/20 bg-primary/5">
          <CardHeader>
            <CardTitle className="font-heading text-base">
              Finish onboarding
            </CardTitle>
            <CardDescription>
              You can preview the schedule, but course links unlock after
              onboarding is complete.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild size="sm">
              <Link to="/participant/onboarding">Continue onboarding</Link>
            </Button>
          </CardContent>
        </Card>
      ) : null}

      <Card className="shadow-none">
        <CardHeader>
          <CardTitle className="font-heading text-lg">Published schedule</CardTitle>
          <CardDescription>
            {cohort?.timetablePublished
              ? "Join live sessions from here or continue self-paced lessons in your courses."
              : "Your cohort timetable has not been published yet."}
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-3">
          {publishedSlots.length === 0 ? (
            <p className="rounded-xl border border-dashed px-4 py-10 text-center text-sm text-muted-foreground">
              No published sessions for {cohort?.name} yet.
            </p>
          ) : (
            publishedSlots.map((slot, index) => (
              <motion.div
                key={slot.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.04 * index }}
                className="grid gap-3 rounded-xl border border-border/70 p-4 md:grid-cols-[120px_1fr_auto] md:items-center"
              >
                <div>
                  <p className="text-sm font-medium">{slot.day}</p>
                  <p className="text-xs text-muted-foreground">{slot.time}</p>
                </div>
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="font-medium">{slot.title}</p>
                    <Badge variant={typeTone[slot.type] ?? "outline"}>
                      {slot.type}
                    </Badge>
                  </div>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {slot.facilitator} · {slot.location}
                  </p>
                </div>
                <div className="flex gap-2">
                  {slot.courseId && onboarded ? (
                    <Button asChild size="sm" variant="outline">
                      <Link
                        to={
                          slot.lessonId
                            ? `/participant/courses/${slot.courseId}/lessons/${slot.lessonId}`
                            : `/participant/courses/${slot.courseId}`
                        }
                      >
                        {slot.lessonId ? "Open lesson" : "Open course"}
                      </Link>
                    </Button>
                  ) : null}
                  <Button
                    size="sm"
                    onClick={() => toast.success(`Joined ${slot.title} (mock)`)}
                  >
                    {slot.type === "Self-paced" ? "Continue" : "Join"}
                  </Button>
                </div>
              </motion.div>
            ))
          )}
        </CardContent>
      </Card>
    </div>
  )
}
