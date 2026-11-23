import { Link } from "react-router-dom"

import { Button } from "@/components/ui/button"
import { useAuth } from "@/shared/auth/auth-context"
import {
  getAllocationsForMentor,
  getMentorProfileByUserId,
  getReportsForMentor,
  getSessionsForMentor,
} from "@/shared/data/mock-mentorship"
import { JourneyRail } from "@/shared/components/journey-rail"
import { NextMove, SectionLabel } from "@/shared/components/next-move"
import { PageIntro } from "@/shared/components/page-intro"
import {
  StatusLabel,
  WorkList,
  WorkRow,
} from "@/shared/components/work-row"

export function MentorDashboardPage() {
  const { user } = useAuth()
  const profile = getMentorProfileByUserId(user?.id ?? "mentor-1")
  const mentorId = profile?.id ?? "mentor-profile-1"
  const mentees = getAllocationsForMentor(mentorId).filter(
    (item) => item.status === "Active"
  )
  const sessions = getSessionsForMentor(mentorId)
  const upcoming = sessions.filter((item) => item.status === "Scheduled")
  const nextSession = upcoming[0]
  const pendingReports = getReportsForMentor(mentorId).filter(
    (item) => item.status === "Draft"
  )

  return (
    <div className="flex flex-col gap-8">
      <PageIntro
        eyebrow={`Welcome, ${user?.name.split(" ")[0]}`}
        title="Who needs you in the next 48 hours?"
        description="Mentors don’t need another dashboard of vanity metrics. Lead with the next session, then unfinished reports."
      />

      <JourneyRail
        steps={[
          { id: "mentees", label: "Know mentees", state: "done" },
          {
            id: "session",
            label: "Run session",
            state: nextSession ? "current" : "upcoming",
          },
          {
            id: "feedback",
            label: "Leave feedback",
            state: "upcoming",
          },
          {
            id: "report",
            label: "Submit report",
            state: pendingReports.length ? "current" : "upcoming",
          },
        ]}
      />

      {nextSession ? (
        <NextMove
          label="Next mentee conversation"
          title={`${nextSession.participantName} · ${nextSession.focus}`}
          detail={`${nextSession.date} · ${nextSession.time}. Skim their latest performance before you meet.`}
          cta="Open sessions"
          to="/mentor/sessions"
          tone="attention"
        />
      ) : pendingReports[0] ? (
        <NextMove
          label="Report waiting"
          title={`Finish draft for ${pendingReports[0].participantName}`}
          detail="Programme staff can’t act on development notes stuck in draft."
          cta="Open reports"
          to="/mentor/reports"
        />
      ) : (
        <NextMove
          title="Calendar is clear"
          detail="Review mentee notes or wait for the next scheduled hour."
          cta="Open conversations"
          to="/mentor/mentees"
        />
      )}

      <div className="grid gap-4 md:grid-cols-3">
        <div className="rounded-xl border border-foreground/10 bg-card/70 p-5">
          <p className="text-xs tracking-[0.14em] text-muted-foreground uppercase">
            Active mentees
          </p>
          <p className="mt-2 font-heading text-4xl font-semibold">
            {mentees.length}
          </p>
        </div>
        <div className="rounded-xl border border-foreground/10 bg-card/70 p-5">
          <p className="text-xs tracking-[0.14em] text-muted-foreground uppercase">
            Upcoming sessions
          </p>
          <p className="mt-2 font-heading text-4xl font-semibold">
            {upcoming.length}
          </p>
        </div>
        <div className="rounded-xl border border-foreground/10 bg-card/70 p-5">
          <p className="text-xs tracking-[0.14em] text-muted-foreground uppercase">
            Draft reports
          </p>
          <p className="mt-2 font-heading text-4xl font-semibold">
            {pendingReports.length}
          </p>
        </div>
      </div>

      <div className="space-y-3">
        <div className="flex items-center justify-between gap-3">
          <SectionLabel>Coming up</SectionLabel>
          <Button asChild size="sm" variant="outline">
            <Link to="/mentor/sessions">All sessions</Link>
          </Button>
        </div>
        <WorkList>
          {upcoming.length === 0 ? (
            <WorkRow
              title="No scheduled sessions"
              meta="When admin books time, it will show here first."
            />
          ) : (
            upcoming.map((session) => (
              <WorkRow
                key={session.id}
                title={session.participantName}
                meta={`${session.focus} · ${session.date} · ${session.time}`}
                status={<StatusLabel tone="primary">{session.status}</StatusLabel>}
              />
            ))
          )}
        </WorkList>
      </div>
    </div>
  )
}
