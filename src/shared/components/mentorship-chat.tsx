import * as React from "react"
import { SendIcon } from "lucide-react"
import { toast } from "sonner"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import {
  appendThreadMessage,
  getThreadMessages,
  type MentorshipMessage,
  type MentorshipMessageAuthor,
} from "@/shared/data/mock-mentorship"

function initials(name: string) {
  return name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase()
}

export function MentorshipChat({
  allocationId,
  currentAuthor,
  currentAuthorName,
  peerName,
  peerTitle,
  peerAvatar,
  promptChips = [],
  placeholder,
  composeText,
  onComposeTextConsumed,
  className,
}: {
  allocationId: string
  currentAuthor: MentorshipMessageAuthor
  currentAuthorName: string
  peerName: string
  peerTitle?: string
  peerAvatar?: string
  promptChips?: string[]
  placeholder: string
  composeText?: string | null
  onComposeTextConsumed?: () => void
  className?: string
}) {
  const [messages, setMessages] = React.useState<MentorshipMessage[]>(() =>
    getThreadMessages(allocationId)
  )
  const [draft, setDraft] = React.useState("")
  const listRef = React.useRef<HTMLDivElement | null>(null)
  const textareaRef = React.useRef<HTMLTextAreaElement | null>(null)

  React.useEffect(() => {
    setMessages(getThreadMessages(allocationId))
    setDraft("")
  }, [allocationId])

  React.useEffect(() => {
    if (!composeText) return
    setDraft(composeText)
    onComposeTextConsumed?.()
    requestAnimationFrame(() => textareaRef.current?.focus())
  }, [composeText, onComposeTextConsumed])

  React.useEffect(() => {
    const list = listRef.current
    if (!list) return
    list.scrollTop = list.scrollHeight
  }, [messages])

  function send(body: string) {
    const trimmed = body.trim()
    if (!trimmed) {
      toast.error("Write a message first")
      return
    }

    const next = appendThreadMessage({
      allocationId,
      author: currentAuthor,
      authorName: currentAuthorName,
      body: trimmed,
      kind: currentAuthor === "mentor" ? "guidance" : "question",
    })
    setMessages((prev) => [...prev, next])
    setDraft("")
    toast.success(
      currentAuthor === "mentor" ? "Guidance sent" : "Question sent to mentor"
    )
  }

  return (
    <div
      className={cn(
        "flex h-full min-h-0 flex-col overflow-hidden rounded-xl border border-foreground/10 bg-card/80",
        className
      )}
    >
      <div className="flex shrink-0 items-center gap-3 border-b border-foreground/8 px-4 py-2.5">
        <Avatar size="sm">
          <AvatarImage src={peerAvatar} alt={peerName} />
          <AvatarFallback>{initials(peerName)}</AvatarFallback>
        </Avatar>
        <div className="min-w-0">
          <p className="truncate font-heading text-sm font-medium">
            {peerName}
          </p>
          <p className="truncate text-xs text-muted-foreground">
            {peerTitle ?? "Mentorship conversation"}
          </p>
        </div>
      </div>

      <div
        ref={listRef}
        className="min-h-0 flex-1 space-y-3 overflow-y-auto overscroll-contain p-4"
      >
        {messages.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            No messages yet. Start the conversation below.
          </p>
        ) : (
          messages.map((message) => {
            const mine = message.author === currentAuthor
            return (
              <div
                key={message.id}
                className={cn(
                  "flex max-w-[90%] flex-col gap-1 sm:max-w-[75%]",
                  mine ? "ml-auto items-end" : "mr-auto items-start"
                )}
              >
                <div className="flex items-center gap-2 text-[0.7rem] text-muted-foreground">
                  <span className="font-medium text-foreground/80">
                    {mine ? "You" : message.authorName}
                  </span>
                  <span>{message.sentAt}</span>
                  {message.kind === "guidance" ? (
                    <span className="rounded bg-primary/10 px-1.5 py-0.5 text-primary">
                      Guidance
                    </span>
                  ) : null}
                  {message.kind === "question" ? (
                    <span className="rounded bg-attention/15 px-1.5 py-0.5 text-attention-foreground">
                      Question
                    </span>
                  ) : null}
                </div>
                <div
                  className={cn(
                    "rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed",
                    mine
                      ? "rounded-br-md bg-primary text-primary-foreground"
                      : "rounded-bl-md bg-foreground/[0.06] text-foreground"
                  )}
                >
                  {message.body}
                </div>
              </div>
            )
          })
        )}
      </div>

      {promptChips.length > 0 ? (
        <div className="shrink-0 border-t border-foreground/8 px-3 py-2">
          <div className="flex gap-2 overflow-x-auto pb-0.5 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {promptChips.map((chip) => (
              <button
                key={chip}
                type="button"
                className="shrink-0 rounded-full border border-foreground/10 bg-background/70 px-3 py-1 text-xs whitespace-nowrap text-muted-foreground hover:border-primary/40 hover:text-foreground"
                onClick={() => setDraft(chip + " ")}
              >
                {chip}
              </button>
            ))}
          </div>
        </div>
      ) : null}

      <form
        className="flex shrink-0 items-end gap-2 border-t border-foreground/8 p-3"
        onSubmit={(event) => {
          event.preventDefault()
          send(draft)
        }}
      >
        <textarea
          ref={textareaRef}
          value={draft}
          onChange={(event) => setDraft(event.target.value)}
          placeholder={placeholder}
          rows={2}
          className="max-h-24 min-h-12 flex-1 resize-none rounded-lg border border-input bg-transparent px-3 py-2 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
          onKeyDown={(event) => {
            if (event.key === "Enter" && !event.shiftKey) {
              event.preventDefault()
              send(draft)
            }
          }}
        />
        <Button type="submit" className="h-10 shrink-0 gap-2">
          <SendIcon className="size-4" />
          Send
        </Button>
      </form>
    </div>
  )
}
