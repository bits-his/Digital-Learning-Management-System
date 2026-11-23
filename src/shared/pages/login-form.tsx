import * as React from "react"
import { useNavigate } from "react-router-dom"
import { toast } from "sonner"
import { GraduationCapIcon, ShieldIcon, UserRoundIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import {
  ToggleGroup,
  ToggleGroupItem,
} from "@/components/ui/toggle-group"
import { cn } from "@/lib/utils"
import { useAuth } from "@/shared/auth/auth-context"
import { hubPathForRole, type UserRole } from "@/shared/auth/types"
import { MOCK_PASSWORD } from "@/shared/data/mock-users"

type PortalRole = Extract<UserRole, "admin" | "participant" | "mentor">

const DEMO_EMAILS: Record<PortalRole, string> = {
  admin: "admin@aaiiri.org",
  participant: "participant@aaiiri.org",
  mentor: "mentor@aaiiri.org",
}

const ROLE_LABELS: Record<PortalRole, string> = {
  admin: "Admin",
  participant: "Participant",
  mentor: "Mentor",
}

const ROLE_PROMISE: Record<PortalRole, string> = {
  admin: "Grade work, allocate mentors, keep the programme moving.",
  participant: "See what’s due, submit evidence, meet your mentor.",
  mentor: "Guide mentees, log sessions, submit development reports.",
}

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"form">) {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [role, setRole] = React.useState<PortalRole>("participant")
  const [email, setEmail] = React.useState(DEMO_EMAILS.participant)
  const [password, setPassword] = React.useState(MOCK_PASSWORD)
  const [error, setError] = React.useState<string | null>(null)

  function handleRoleChange(value: string) {
    if (value !== "admin" && value !== "participant" && value !== "mentor") {
      return
    }
    setRole(value)
    setEmail(DEMO_EMAILS[value])
    setError(null)
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const result = login({ email, password, role })
    if (!result.ok) {
      setError(result.message)
      toast.error(result.message)
      return
    }

    setError(null)
    toast.success(`Welcome — continuing as ${ROLE_LABELS[role]}`)
    navigate(hubPathForRole(role))
  }

  return (
    <form
      className={cn("flex flex-col gap-6", className)}
      onSubmit={handleSubmit}
      {...props}
    >
      <FieldGroup className="gap-6">
        <div className="flex flex-col gap-2">
          <h1 className="font-heading text-2xl font-semibold">Sign in</h1>
          <p className="text-sm leading-relaxed text-muted-foreground">
            {ROLE_PROMISE[role]}
          </p>
        </div>

        <Field>
          <FieldLabel>I am a…</FieldLabel>
          <ToggleGroup
            type="single"
            value={role}
            onValueChange={handleRoleChange}
            variant="outline"
            className="grid w-full grid-cols-3"
          >
            <ToggleGroupItem value="participant" className="gap-1.5 px-2">
              <UserRoundIcon className="size-3.5" />
              Learner
            </ToggleGroupItem>
            <ToggleGroupItem value="mentor" className="gap-1.5 px-2">
              <GraduationCapIcon className="size-3.5" />
              Mentor
            </ToggleGroupItem>
            <ToggleGroupItem value="admin" className="gap-1.5 px-2">
              <ShieldIcon className="size-3.5" />
              Admin
            </ToggleGroupItem>
          </ToggleGroup>
          <FieldDescription>
            Demo: {DEMO_EMAILS[role]} / {MOCK_PASSWORD}
          </FieldDescription>
        </Field>

        <Field data-invalid={error ? true : undefined}>
          <FieldLabel htmlFor="email" className="text-sm">
            Email
          </FieldLabel>
          <Input
            id="email"
            type="email"
            placeholder="m@example.com"
            className="h-11 px-3 text-base md:text-base"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            aria-invalid={error ? true : undefined}
            required
          />
        </Field>

        <Field data-invalid={error ? true : undefined}>
          <div className="flex items-center">
            <FieldLabel htmlFor="password" className="text-sm">
              Password
            </FieldLabel>
            <a
              href="#"
              className="ml-auto text-sm underline-offset-4 hover:underline"
              onClick={(event) => {
                event.preventDefault()
                toast.message("Password reset is mocked in this frontend.")
              }}
            >
              Forgot password?
            </a>
          </div>
          <Input
            id="password"
            type="password"
            className="h-11 px-3 text-base md:text-base"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            aria-invalid={error ? true : undefined}
            required
          />
          {error ? (
            <FieldDescription className="text-destructive">
              {error}
            </FieldDescription>
          ) : null}
        </Field>

        <Field>
          <Button type="submit" className="h-11 w-full text-base" size="lg">
            Continue as {ROLE_LABELS[role]}
          </Button>
        </Field>
      </FieldGroup>
    </form>
  )
}
