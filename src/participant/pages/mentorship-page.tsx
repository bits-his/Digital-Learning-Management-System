import { CalendarDaysIcon } from "lucide-react"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useAuth } from "@/shared/auth/auth-context"
import {
  getAllocationsForParticipant,
  getSessionsForParticipant,
  mentorProfiles,
  participantQuestionPrompts,
} from "@/shared/data/mock-mentorship"
import { MentorshipChat } from "@/shared/components/mentorship-chat"
import { JourneyRail } from "@/shared/components/journey-rail"
import { NextMove } from "@/shared/components/next-move"
import { StatusLabel } from "@/shared/components/work-row"

function initials(name: string) {
  return name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase()
}

export function ParticipantMentorshipPage() {
  const { user } = useAuth()
  const participantId = user?.id ?? "participant-1"
  const allocations = getAllocationsForParticipant(participantId)
  const sessions = getSessionsForParticipant(participantId)
  const allocation = allocations[0]
  const mentor = allocation
    ? mentorProfiles.find((item) => item.id === allocation.mentorId)
    : undefined
  const upcoming = sessions.find((item) => item.status === "Scheduled")
  const completed = sessions.filter((item) => item.status === "Completed")
  const history = sessions.slice(0, 4)

  if (!mentor || !allocation) {
    return (
      <div className="flex flex-1 flex-col gap-4">
        <JourneyRail
          steps={[
            { id: "match", label: "Matched", state: "current" },
            { id: "ask", label: "Ask & learn", state: "upcoming" },
            { id: "meet", label: "Live session", state: "upcoming" },
            { id: "grow", label: "Improve", state: "upcoming" },
          ]}
        />
        <NextMove
          title="Nothing to discuss yet"
          detail="While you wait for a mentor, keep building evidence through assignments and quizzes."
          cta="Continue assessments"
          to="/participant/assignments"
        />
      </div>
    )
  }

  return (
    <div className="flex min-h-0 flex-1 flex-col gap-3">
      <JourneyRail
        className="shrink-0"
        steps={[
          {
            id: "match",
            label: "Matched",
            state: "done",
          },
          {
            id: "ask",
            label: "Ask & learn",
            state: "current",
          },
          {
            id: "meet",
            label: "Live session",
            state: upcoming ? "current" : "upcoming",
          },
          {
            id: "grow",
            label: "Improve",
            state: completed.length > 0 ? "done" : "upcoming",
          },
        ]}
      />

      <div className="grid min-h-0 flex-1 gap-3 xl:grid-cols-[minmax(0,1fr)_260px]">
        <MentorshipChat
          allocationId={allocation.id}
          currentAuthor="participant"
          currentAuthorName={user?.name ?? "Participant"}
          peerName={mentor.name}
          peerTitle={`${mentor.title} · Focus: ${allocation.focusArea}`}
          peerAvatar={mentor.avatar}
          promptChips={participantQuestionPrompts}
          placeholder="Ask your mentor a question…"
        />

        <aside className="flex min-h-0 flex-col overflow-hidden rounded-xl border border-foreground/10 bg-card/80">
          <div className="shrink-0 space-y-2.5 border-b border-foreground/8 p-3">
            <div className="flex items-center gap-2.5">
              <Avatar size="sm">
                <AvatarImage src={mentor.avatar} alt={mentor.name} />
                <AvatarFallback>{initials(mentor.name)}</AvatarFallback>
              </Avatar>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <p className="truncate font-heading text-sm font-semibold">
                    {mentor.name}
                  </p>
                  <StatusLabel tone="success">{allocation.status}</StatusLabel>
                </div>
                <p className="truncate text-xs text-muted-foreground">
                  {mentor.title}
                </p>
              </div>
            </div>

            <p className="line-clamp-2 text-xs leading-relaxed text-muted-foreground">
              {mentor.bio}
            </p>

            <div className="flex justify-between gap-2 text-xs">
              <span className="text-muted-foreground">Focus</span>
              <span className="truncate font-medium">{allocation.focusArea}</span>
            </div>
            <div className="flex flex-wrap gap-1">
              {mentor.expertise.slice(0, 3).map((item) => (
                <span
                  key={item}
                  className="rounded border border-foreground/10 bg-background/60 px-1.5 py-0.5 text-[0.65rem]"
                >
                  {item}
                </span>
              ))}
            </div>
          </div>

          {upcoming ? (
            <div className="shrink-0 border-b border-foreground/8 px-3 py-2.5">
              <div className="flex items-center gap-1.5 text-[0.65rem] tracking-[0.12em] text-muted-foreground uppercase">
                <CalendarDaysIcon className="size-3" />
                Next session
              </div>
              <p className="mt-1 truncate text-sm font-medium">{upcoming.focus}</p>
              <p className="text-xs text-muted-foreground">
                {upcoming.date} · {upcoming.time}
              </p>
            </div>
          ) : null}

          <div className="flex min-h-0 flex-1 flex-col p-3">
            <p className="shrink-0 text-[0.65rem] tracking-[0.12em] text-muted-foreground uppercase">
              Sessions
            </p>
            <ul className="mt-2 min-h-0 flex-1 space-y-2 overflow-y-auto overscroll-contain">
              {history.map((session) => (
                <li
                  key={session.id}
                  className="rounded-lg border border-foreground/8 bg-background/40 px-2.5 py-2"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <p className="truncate text-xs font-medium">
                        {session.focus}
                      </p>
                      <p className="text-[0.65rem] text-muted-foreground">
                        {session.date} · {session.time}
                      </p>
                    </div>
                    <StatusLabel
                      tone={
                        session.status === "Completed" ? "success" : "primary"
                      }
                    >
                      {session.status}
                    </StatusLabel>
                  </div>
                  {session.mentorFeedback ? (
                    <p className="mt-1 line-clamp-2 text-[0.65rem] leading-relaxed text-muted-foreground">
                      {session.mentorFeedback}
                    </p>
                  ) : null}
                </li>
              ))}
            </ul>
          </div>
        </aside>
      </div>
    </div>
  )
}
