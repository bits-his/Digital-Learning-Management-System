import { useAuth } from "@/shared/auth/auth-context"
import {
  getAllocationsForParticipant,
  getSessionsForParticipant,
  mentorProfiles,
  participantQuestionPrompts,
} from "@/shared/data/mock-mentorship"
import { MentorshipChat } from "@/shared/components/mentorship-chat"
import { JourneyRail } from "@/shared/components/journey-rail"
import { NextMove, SectionLabel } from "@/shared/components/next-move"
import { PageIntro } from "@/shared/components/page-intro"
import {
  StatusLabel,
  WorkList,
  WorkRow,
} from "@/shared/components/work-row"

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

  return (
    <div className="flex flex-col gap-8">
      <PageIntro
        eyebrow="Mentorship conversation"
        title={
          mentor
            ? `Talk with ${mentor.name}`
            : "Your mentor match is coming"
        }
        description={
          mentor
            ? "This is your coaching thread. Ask what you don’t understand. Your mentor guides what to improve before the next session."
            : "Programme staff allocate mentors after enrolment. Once matched, you’ll chat here."
        }
      />

      <JourneyRail
        steps={[
          {
            id: "match",
            label: "Matched",
            state: mentor ? "done" : "current",
          },
          {
            id: "ask",
            label: "Ask & learn",
            state: mentor ? "current" : "upcoming",
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

      {mentor && allocation ? (
        <div className="grid gap-6 xl:grid-cols-[1fr_280px]">
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

          <aside className="space-y-4">
            <div className="overflow-hidden rounded-xl border border-foreground/10">
              <div className="mesh-panel px-4 py-5 text-white">
                <p className="text-xs tracking-[0.16em] text-white/70 uppercase">
                  Your mentor
                </p>
                <p className="mt-2 font-heading text-2xl font-semibold">
                  {mentor.name}
                </p>
                <p className="mt-1 text-sm text-white/80">
                  {mentor.title} · {mentor.organization}
                </p>
              </div>
              <div className="space-y-3 bg-card/70 p-4 text-sm">
                <p className="text-muted-foreground">{mentor.bio}</p>
                <p>
                  <span className="text-muted-foreground">Focus: </span>
                  <span className="font-medium">{allocation.focusArea}</span>
                </p>
                <p className="text-muted-foreground">
                  Expertise: {mentor.expertise.join(" · ")}
                </p>
                <StatusLabel tone="success">{allocation.status}</StatusLabel>
              </div>
            </div>

            {upcoming ? (
              <NextMove
                label="Next live session"
                title={upcoming.focus}
                detail={`${upcoming.date} · ${upcoming.time}`}
                cta="Scroll to chat"
                onClick={() =>
                  document
                    .querySelector("textarea")
                    ?.scrollIntoView({ behavior: "smooth", block: "center" })
                }
              />
            ) : null}

            <div className="space-y-2">
              <SectionLabel>Session history</SectionLabel>
              {sessions.length === 0 ? (
                <p className="text-sm text-muted-foreground">None yet.</p>
              ) : (
                <WorkList>
                  {sessions.map((session) => (
                    <WorkRow
                      key={session.id}
                      title={session.focus}
                      meta={`${session.date} · ${session.time}`}
                      status={
                        <StatusLabel
                          tone={
                            session.status === "Completed"
                              ? "success"
                              : "primary"
                          }
                        >
                          {session.status}
                        </StatusLabel>
                      }
                    >
                      {session.mentorFeedback ? (
                        <p className="text-sm text-muted-foreground">
                          {session.mentorFeedback}
                        </p>
                      ) : null}
                    </WorkRow>
                  ))}
                </WorkList>
              )}
            </div>
          </aside>
        </div>
      ) : (
        <NextMove
          title="Nothing to discuss yet"
          detail="While you wait for a mentor, keep building evidence through assignments and quizzes."
          cta="Continue assessments"
          to="/participant/assignments"
        />
      )}
    </div>
  )
}
