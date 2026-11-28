import { Link } from "react-router-dom"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import {
  adminApplications,
  adminSessions,
  adminStats,
} from "@/shared/data/mock-admin"
import { getPendingGrading } from "@/shared/data/mock-assessment"
import { useAuth } from "@/shared/auth/auth-context"
import { NextMove, SectionLabel } from "@/shared/components/next-move"
import { PageLayout } from "@/shared/components/page-layout"
import {
  StatusLabel,
  WorkList,
  WorkRow,
} from "@/shared/components/work-row"

export function AdminDashboardPage() {
  const { user } = useAuth()
  const pendingGrades = getPendingGrading()
  const firstName = user?.name.split(" ")[0] ?? "Admin"

  return (
    <PageLayout variant="bare">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-muted-foreground">
          Welcome, {firstName} — applications, grading, and sessions.
        </p>
        <div className="flex flex-wrap gap-2">
          <Button asChild size="sm" variant="outline">
            <Link to="/admin/applications">Applications</Link>
          </Button>
          <Button asChild size="sm" variant="outline">
            <Link to="/admin/grading">Grading</Link>
          </Button>
        </div>
      </div>

      {pendingGrades[0] ? (
        <NextMove
          label="Facilitator attention"
          title={`${pendingGrades.length} submission${pendingGrades.length === 1 ? "" : "s"} waiting to be graded`}
          detail="Learners can’t see feedback until you score them."
          cta="Open grading inbox"
          to="/admin/grading"
          tone="attention"
        />
      ) : (
        <NextMove
          title="Grading inbox is clear"
          detail="Scan applications or check mentor allocations next."
          cta="Review applications"
          to="/admin/applications"
        />
      )}

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {adminStats.map((stat) => (
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
            <p className="mt-1 text-xs text-muted-foreground">{stat.hint}</p>
          </div>
        ))}
      </div>

      <div className="grid gap-5 lg:grid-cols-2">
        <div className="space-y-3">
          <div className="flex items-center justify-between gap-3">
            <SectionLabel>Applications needing review</SectionLabel>
            <Button asChild size="sm" variant="outline">
              <Link to="/admin/applications">All</Link>
            </Button>
          </div>
          <WorkList>
            {adminApplications.slice(0, 3).map((app) => (
              <WorkRow
                key={app.id}
                title={app.business}
                meta={`${app.id} · ${app.country} · ${app.sector}`}
                status={<StatusLabel tone="primary">{app.status}</StatusLabel>}
                action={
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => toast.message(`Opened ${app.id}`)}
                  >
                    Review
                  </Button>
                }
              />
            ))}
          </WorkList>
        </div>

        <div className="space-y-3">
          <SectionLabel>Upcoming live sessions</SectionLabel>
          <WorkList>
            {adminSessions.map((session) => (
              <WorkRow
                key={session.title}
                title={session.title}
                meta={`${session.date} · ${session.time} · ${session.platform}`}
                action={
                  <Button
                    size="sm"
                    onClick={() =>
                      toast.success(`Join link copied for ${session.title}`)
                    }
                  >
                    Copy link
                  </Button>
                }
              >
                <p className="text-sm text-muted-foreground">
                  {session.attendees} registered
                </p>
              </WorkRow>
            ))}
          </WorkList>
        </div>
      </div>
    </PageLayout>
  )
}
