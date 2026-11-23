import { useState } from "react"
import { Link } from "react-router-dom"
import { motion, AnimatePresence } from "motion/react"
import { toast } from "sonner"
import { CheckIcon, ChevronRightIcon } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { onboardingSteps } from "@/shared/data/mock-learning"
import { useAuth } from "@/shared/auth/auth-context"
import { useEnrolment } from "@/shared/enrolment/enrolment-context"
import { useParticipantAccess } from "@/shared/learning/use-participant-access"

export function ParticipantOnboardingPage() {
  const { user } = useAuth()
  const { markOnboarding } = useEnrolment()
  const { candidate, cohort, publishedSlots, onboarded } =
    useParticipantAccess()
  const [step, setStep] = useState(0)
  const [done, setDone] = useState(onboarded)

  function next() {
    if (step < onboardingSteps.length - 1) {
      if (candidate && step === 0) {
        markOnboarding(candidate.id, "In progress")
      }
      setStep((value) => value + 1)
      return
    }
    if (candidate) {
      markOnboarding(candidate.id, "Complete")
    }
    setDone(true)
    toast.success("Onboarding complete — learning access unlocked")
  }

  return (
    <div className="mx-auto flex w-full max-w-3xl flex-col gap-6">
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-2xl border bg-[linear-gradient(135deg,oklch(0.97_0.03_150),oklch(0.99_0.01_90)_50%,oklch(0.96_0.02_180))] p-6 dark:bg-[linear-gradient(135deg,oklch(0.22_0.03_150),oklch(0.2_0.01_90)_50%,oklch(0.21_0.02_180))]"
      >
        <Badge variant="secondary">Participant onboarding</Badge>
        <h1 className="mt-3 font-heading text-3xl font-semibold tracking-tight">
          Welcome to the Bootcamp, {user?.name.split(" ")[0]}
        </h1>
        <p className="mt-2 max-w-xl text-sm text-muted-foreground">
          Complete these steps to activate your programme access, join your
          cohort, and open the learning hub.
        </p>
      </motion.div>

      <div className="flex flex-wrap gap-2">
        {onboardingSteps.map((item, index) => (
          <div
            key={item.id}
            className={`inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs ${
              index <= step || done
                ? "border-primary/30 bg-primary/10 text-primary"
                : "text-muted-foreground"
            }`}
          >
            {(index < step || done) && <CheckIcon className="size-3" />}
            Step {index + 1}
          </div>
        ))}
      </div>

      <AnimatePresence mode="wait">
        {done ? (
          <motion.div
            key="done"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
          >
            <Card className="shadow-none">
              <CardHeader>
                <CardTitle className="font-heading text-xl">
                  You&apos;re enrolled and ready
                </CardTitle>
                <CardDescription>
                  Your account is active
                  {cohort ? `, you're in ${cohort.name}` : ""}, and learning
                  modules are unlocked.
                </CardDescription>
              </CardHeader>
              <CardContent className="flex flex-wrap gap-2">
                <Button asChild>
                  <Link to="/participant/courses">Open my courses</Link>
                </Button>
                <Button asChild variant="outline">
                  <Link to="/participant/timetable">View timetable</Link>
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        ) : (
          <motion.div
            key={step}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
          >
            <Card className="shadow-none">
              <CardHeader>
                <CardDescription>
                  Step {step + 1} of {onboardingSteps.length}
                </CardDescription>
                <CardTitle className="font-heading text-xl">
                  {onboardingSteps[step].title}
                </CardTitle>
                <CardDescription>
                  {onboardingSteps[step].description}
                </CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col gap-4">
                {step === 0 && (
                  <div className="grid gap-3 sm:grid-cols-2">
                    <div className="grid gap-2">
                      <Label htmlFor="email">Email</Label>
                      <Input id="email" defaultValue={user?.email} readOnly />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="password">Set password</Label>
                      <Input
                        id="password"
                        type="password"
                        defaultValue="password"
                      />
                    </div>
                  </div>
                )}
                {step === 1 && (
                  <div className="grid gap-3 sm:grid-cols-2">
                    <div className="grid gap-2">
                      <Label htmlFor="org">Organisation</Label>
                      <Input
                        id="org"
                        defaultValue={user?.organization ?? "GreenHarvest Agro"}
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="sector">Sector</Label>
                      <Input id="sector" defaultValue="Agriculture" />
                    </div>
                    <div className="grid gap-2 sm:col-span-2">
                      <Label htmlFor="markets">Target markets</Label>
                      <Input
                        id="markets"
                        defaultValue="Nigeria, Ghana, United States"
                      />
                    </div>
                  </div>
                )}
                {step === 2 && (
                  <div className="rounded-xl border bg-muted/40 p-4">
                    <p className="text-sm font-medium">
                      {cohort?.name ?? "Awaiting cohort allocation"}
                    </p>
                    <p className="mt-1 text-sm text-muted-foreground">
                      {cohort
                        ? `${cohort.facilitators[0]?.name ?? "Facilitator TBC"} · ${cohort.startDate} → ${cohort.endDate}`
                        : "Programme staff will place you in a cohort shortly."}
                    </p>
                  </div>
                )}
                {step === 3 && (
                  <div className="rounded-xl border bg-muted/40 p-4 text-sm text-muted-foreground">
                    {publishedSlots[0] ? (
                      <>
                        Your next published session is{" "}
                        <span className="font-medium text-foreground">
                          {publishedSlots[0].title}
                        </span>{" "}
                        on {publishedSlots[0].day}, {publishedSlots[0].time}.
                        Self-paced modules unlock after onboarding.
                      </>
                    ) : (
                      "Your cohort timetable will appear here once programme staff publish it. Self-paced modules unlock after onboarding."
                    )}
                  </div>
                )}
                <div className="flex justify-between">
                  <Button
                    variant="ghost"
                    disabled={step === 0}
                    onClick={() => setStep((value) => Math.max(0, value - 1))}
                  >
                    Back
                  </Button>
                  <Button onClick={next}>
                    {step === onboardingSteps.length - 1
                      ? "Finish & unlock learning"
                      : "Continue"}
                    <ChevronRightIcon data-icon="inline-end" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
