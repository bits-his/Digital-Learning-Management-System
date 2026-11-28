import * as React from "react"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import { useAuth } from "@/shared/auth/auth-context"
import {
  getParticipantQuizAttempts,
  getQuizById,
  quizzes,
  type QuizAttempt,
} from "@/shared/data/mock-assessment"
import { JourneyRail } from "@/shared/components/journey-rail"
import { NextMove, SectionLabel } from "@/shared/components/next-move"
import { PageLayout } from "@/shared/components/page-layout"
import {
  StatusLabel,
  WorkList,
  WorkRow,
} from "@/shared/components/work-row"

export function ParticipantQuizzesPage() {
  const { user } = useAuth()
  const participantId = user?.id ?? "participant-1"
  const [attempts, setAttempts] = React.useState<QuizAttempt[]>(() =>
    getParticipantQuizAttempts(participantId)
  )
  const [activeQuizId, setActiveQuizId] = React.useState<string | null>(null)
  const [answers, setAnswers] = React.useState<Record<string, number>>({})

  const published = quizzes.filter((quiz) => quiz.status === "Published")
  const activeQuiz = activeQuizId ? getQuizById(activeQuizId) : null
  const nextQuiz = published.find((quiz) => {
    const attempt = attempts.find((item) => item.quizId === quiz.id)
    return !attempt || attempt.status !== "Graded"
  })

  function startQuiz(quizId: string) {
    setActiveQuizId(quizId)
    setAnswers({})
  }

  function submitQuiz() {
    if (!activeQuiz) return
    const unanswered = activeQuiz.questions.filter(
      (question) => answers[question.id] === undefined
    )
    if (unanswered.length > 0) {
      toast.error("Answer every question — then we’ll score you instantly")
      return
    }

    const correct = activeQuiz.questions.filter(
      (question) => answers[question.id] === question.correctIndex
    ).length
    const score = Math.round((correct / activeQuiz.questions.length) * 100)

    setAttempts((prev) => {
      const existing = prev.find((item) => item.quizId === activeQuiz.id)
      if (existing) {
        return prev.map((item) =>
          item.quizId === activeQuiz.id
            ? {
                ...item,
                status: "Graded",
                score,
                answeredAt: "Today",
              }
            : item
        )
      }
      return [
        ...prev,
        {
          id: `attempt-${Date.now()}`,
          quizId: activeQuiz.id,
          participantId,
          participantName: user?.name ?? "Participant",
          status: "Graded",
          score,
          answeredAt: "Today",
        },
      ]
    })

    toast.success(
      score >= activeQuiz.passingScore
        ? `Passed at ${score}% — solid evidence for your record`
        : `Scored ${score}% — below the ${activeQuiz.passingScore}% pass mark`
    )
    setActiveQuizId(null)
    setAnswers({})
  }

  if (activeQuiz) {
    return (
      <PageLayout
        variant="standard"
        eyebrow={`${activeQuiz.durationMinutes} min · pass ${activeQuiz.passingScore}%`}
        title={activeQuiz.title}
        description="Choose one answer per question, then submit once."
        actions={
          <Button variant="outline" size="sm" onClick={() => setActiveQuizId(null)}>
            Exit quiz
          </Button>
        }
      >
        <div className="space-y-4">
          {activeQuiz.questions.map((question, index) => (
            <div
              key={question.id}
              className="story-enter rounded-xl border border-foreground/10 bg-card/80 p-5 backdrop-blur-sm"
            >
              <p className="text-xs font-semibold tracking-[0.14em] text-primary uppercase">
                Question {index + 1}
              </p>
              <h2 className="mt-2 font-heading text-lg font-medium">
                {question.prompt}
              </h2>
              <div className="mt-4 grid gap-2">
                {question.options.map((option, optionIndex) => {
                  const selected = answers[question.id] === optionIndex
                  return (
                    <button
                      key={option}
                      type="button"
                      className={
                        selected
                          ? "rounded-lg border border-primary bg-primary/10 px-4 py-3 text-left text-sm font-medium"
                          : "rounded-lg border border-foreground/10 bg-background/60 px-4 py-3 text-left text-sm hover:border-primary/40"
                      }
                      onClick={() =>
                        setAnswers((prev) => ({
                          ...prev,
                          [question.id]: optionIndex,
                        }))
                      }
                    >
                      {option}
                    </button>
                  )
                })}
              </div>
            </div>
          ))}
        </div>
        <Button size="lg" className="w-fit" onClick={submitQuiz}>
          Submit answers
        </Button>
      </PageLayout>
    )
  }

  return (
    <PageLayout variant="bare">
      <JourneyRail
        steps={[
          { id: "open", label: "Open quiz", state: "current" },
          { id: "answer", label: "Answer", state: "upcoming" },
          { id: "score", label: "See score", state: "upcoming" },
          { id: "record", label: "On your record", state: "upcoming" },
        ]}
      />

      {nextQuiz ? (
        <NextMove
          title={nextQuiz.title}
          detail={`${nextQuiz.module} · ${nextQuiz.durationMinutes} minutes · pass at ${nextQuiz.passingScore}%`}
          cta="Take this quiz"
          onClick={() => startQuiz(nextQuiz.id)}
        />
      ) : (
        <NextMove
          label="All clear"
          title="You’ve completed the published quizzes"
          detail="Scores already feed into your performance record."
          cta="See my performance"
          to="/participant/performance"
        />
      )}

      <div className="space-y-3">
        <SectionLabel>Available quizzes</SectionLabel>
        <WorkList>
          {published.map((quiz) => {
            const attempt = attempts.find((item) => item.quizId === quiz.id)
            const done = attempt?.status === "Graded"
            return (
              <WorkRow
                key={quiz.id}
                title={quiz.title}
                meta={`${quiz.module} · ${quiz.durationMinutes} min · Pass ${quiz.passingScore}%`}
                status={
                  <StatusLabel tone={done ? "success" : "neutral"}>
                    {done ? `Score ${attempt?.score}%` : "Not started"}
                  </StatusLabel>
                }
                action={
                  <Button
                    size="sm"
                    disabled={done}
                    onClick={() => startQuiz(quiz.id)}
                  >
                    {done ? "Completed" : "Start"}
                  </Button>
                }
              />
            )
          })}
        </WorkList>
      </div>
    </PageLayout>
  )
}
