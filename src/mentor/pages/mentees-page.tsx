import * as React from "react"

import { Button } from "@/components/ui/button"
import { useAuth } from "@/shared/auth/auth-context"
import { getParticipantPerformance } from "@/shared/data/mock-assessment"
import {
  getAllocationsForMentor,
  getMentorProfileByUserId,
  mentorGuidancePrompts,
} from "@/shared/data/mock-mentorship"
import { MentorshipChat } from "@/shared/components/mentorship-chat"
import { NextMove, SectionLabel } from "@/shared/components/next-move"
import { PageIntro } from "@/shared/components/page-intro"
import {
  HonestProgress,
  StatusLabel,
} from "@/shared/components/work-row"
import { cn } from "@/lib/utils"

export function MentorMenteesPage() {
  const { user } = useAuth()
  const profile = getMentorProfileByUserId(user?.id ?? "mentor-1")
  const mentorId = profile?.id ?? "mentor-profile-1"
  const mentees = getAllocationsForMentor(mentorId)
  const [selectedId, setSelectedId] = React.useState<string>(
    mentees[0]?.id ?? ""
  )
  const [composeText, setComposeText] = React.useState<string | null>(null)

  const selected = mentees.find((item) => item.id === selectedId) ?? mentees[0]
  const performance = selected
    ? getParticipantPerformance(selected.participantId)
    : undefined
  const weakAreas =
    performance?.competencies
      .filter((item) => item.score < item.target)
      .sort((a, b) => a.score - b.score)
      .slice(0, 3) ?? []

  return (
    <div className="flex flex-col gap-8">
      <PageIntro
        eyebrow="Coaching conversations"
        title="Open a participant. Guide them. Answer their questions."
        description="Mentorship is a dialogue — not a form. Pick a mentee, see where they’re weak, then coach in the thread."
      />

      {selected ? (
        <NextMove
          label="Active conversation"
          title={`${selected.participantName} · ${selected.focusArea}`}
          detail={
            weakAreas[0]
              ? `Biggest gap right now: ${weakAreas[0].area} (${weakAreas[0].score} vs target ${weakAreas[0].target}). Tell them what to improve.`
              : "No major competency gaps flagged — keep reinforcing strengths."
          }
          cta="Write guidance"
          onClick={() =>
            setComposeText(
              weakAreas[0]
                ? `On ${weakAreas[0].area}: you scored ${weakAreas[0].score} against a target of ${weakAreas[0].target}. Here’s what to improve: `
                : "Here’s what I’d like you to focus on this week: "
            )
          }
        />
      ) : null}

      <div className="grid gap-4 lg:grid-cols-[260px_1fr] xl:grid-cols-[280px_1fr_260px]">
        <aside className="space-y-2">
          <SectionLabel>Your mentees</SectionLabel>
          <div className="overflow-hidden rounded-xl border border-foreground/10 bg-card/70">
            {mentees.map((mentee) => {
              const active = mentee.id === selected?.id
              return (
                <button
                  key={mentee.id}
                  type="button"
                  onClick={() => setSelectedId(mentee.id)}
                  className={cn(
                    "flex w-full flex-col gap-1 border-b border-foreground/8 px-4 py-3 text-left last:border-b-0",
                    active
                      ? "bg-primary/10"
                      : "hover:bg-foreground/[0.03]"
                  )}
                >
                  <span className="font-heading text-base font-medium">
                    {mentee.participantName}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {mentee.organization}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    Focus: {mentee.focusArea}
                  </span>
                  <StatusLabel tone={active ? "primary" : "neutral"}>
                    {mentee.status}
                  </StatusLabel>
                </button>
              )
            })}
          </div>
        </aside>

        {selected ? (
          <MentorshipChat
            allocationId={selected.id}
            currentAuthor="mentor"
            currentAuthorName={user?.name ?? profile?.name ?? "Mentor"}
            peerName={selected.participantName}
            peerTitle={`${selected.organization} · ${selected.focusArea}`}
            promptChips={mentorGuidancePrompts}
            placeholder="Guide them — what to improve, clarify, or prepare…"
            composeText={composeText}
            onComposeTextConsumed={() => setComposeText(null)}
            className="min-h-[32rem]"
          />
        ) : (
          <div className="rounded-xl border border-foreground/10 bg-card/70 p-6 text-sm text-muted-foreground">
            No mentees allocated yet.
          </div>
        )}

        {selected ? (
          <aside className="space-y-4">
            <div className="rounded-xl border border-foreground/10 bg-card/70 p-4">
              <SectionLabel>What to coach on</SectionLabel>
              {performance ? (
                <div className="mt-3 space-y-3">
                  <HonestProgress
                    label="Overall performance"
                    percent={performance.overallScore}
                  />
                  {weakAreas.length > 0 ? (
                    <ul className="space-y-2 text-sm">
                      {weakAreas.map((area) => (
                        <li
                          key={area.area}
                          className="rounded-lg bg-attention/10 px-3 py-2"
                        >
                          <p className="font-medium">{area.area}</p>
                          <p className="text-xs text-muted-foreground">
                            {area.score} / target {area.target} — explain what
                            they missed
                          </p>
                          <Button
                            size="sm"
                            variant="outline"
                            className="mt-2"
                            onClick={() =>
                              setComposeText(
                                `On ${area.area}: you scored ${area.score} against a target of ${area.target}. Here’s what to improve: `
                              )
                            }
                          >
                            Guide on this
                          </Button>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-sm text-muted-foreground">
                      Competencies look on track. Reinforce and stretch them.
                    </p>
                  )}
                </div>
              ) : (
                <p className="mt-3 text-sm text-muted-foreground">
                  No scored performance linked yet — coach from conversation.
                </p>
              )}
            </div>
            <p className="text-xs text-muted-foreground">
              Tip: answer their questions in the thread, then capture themes in
              Sessions / Reports for programme staff.
            </p>
          </aside>
        ) : null}
      </div>
    </div>
  )
}
