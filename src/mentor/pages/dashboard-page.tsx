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
import { PageLayout } from "@/shared/components/page-layout"
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
  const firstName = user?.name.split(" ")[0] ?? "Mentor"

  return (
    <PageLayout variant="bare">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-muted-foreground">
          Welcome, {firstName} — next session, then unfinished reports.
        </p>
        <div className="flex flex-wrap gap-2">
          <Button asChild size="sm" variant="outline">
            <Link to="/mentor/mentees">Conversations</Link>
          </Button>
          <Button asChild size="sm" variant="outline">
            <Link to="/mentor/sessions">Sessions</Link>
          </Button>
        </div>
      </div>

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

      <div className="grid gap-3 sm:grid-cols-3">
        {[
          { label: "Active mentees", value: mentees.length },
          { label: "Upcoming sessions", value: upcoming.length },
          { label: "Draft reports", value: pendingReports.length },
        ].map((stat) => (
          <div
            key={stat.label}
            className="rounded-xl border border-foreground/10 bg-card/70 p-4"
          >
            <p className="text-[0.65rem] tracking-[0.12em] text-muted-foreground uppercase">
              {stat.label}
            </p>
            <p className="mt-1.5 font-heading text-2xl font-semibold">
              {stat.value}
            </p>
          </div>
        ))}
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
                status={
                  <StatusLabel tone="primary">{session.status}</StatusLabel>
                }
              />
            ))
          )}
        </WorkList>
      </div>
    </PageLayout>
  )
}
