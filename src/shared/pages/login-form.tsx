import * as React from "react"
import { useNavigate } from "react-router-dom"
import { toast } from "sonner"
import { ShieldIcon, UserRoundIcon } from "lucide-react"

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
import type { UserRole } from "@/shared/auth/types"
import { MOCK_PASSWORD } from "@/shared/data/mock-users"

type PortalRole = Extract<UserRole, "admin" | "participant">

const DEMO_EMAILS: Record<PortalRole, string> = {
  admin: "admin@aaiiri.org",
  participant: "participant@aaiiri.org",
}

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"form">) {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [role, setRole] = React.useState<PortalRole>("admin")
  const [email, setEmail] = React.useState(DEMO_EMAILS.admin)
  const [password, setPassword] = React.useState(MOCK_PASSWORD)
  const [error, setError] = React.useState<string | null>(null)

  function handleRoleChange(value: string) {
    if (value !== "admin" && value !== "participant") return
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
    toast.success(`Welcome back — signed in as ${role}`)
    navigate(role === "admin" ? "/admin" : "/participant")
  }

  return (
    <form
      className={cn("flex flex-col gap-6", className)}
      onSubmit={handleSubmit}
      {...props}
    >
      <FieldGroup className="gap-6">
        <div className="flex flex-col items-center gap-2 text-center">
          <h1 className="font-heading text-3xl font-bold tracking-tight">
            Login to your account
          </h1>
          <p className="text-base text-balance text-muted-foreground">
            Choose your role, then sign in to the AAIIRI platform
          </p>
        </div>

        <Field>
          <FieldLabel className="text-sm">Login as</FieldLabel>
          <ToggleGroup
            type="single"
            value={role}
            onValueChange={handleRoleChange}
            variant="outline"
            className="h-11 w-full"
          >
            <ToggleGroupItem value="admin" className="h-11 flex-1 gap-2 text-sm">
              <ShieldIcon />
              Admin
            </ToggleGroupItem>
            <ToggleGroupItem
              value="participant"
              className="h-11 flex-1 gap-2 text-sm"
            >
              <UserRoundIcon />
              Participant
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
              Forgot your password?
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
          <Button type="submit" size="lg" className="h-11 w-full text-base">
            Login as {role === "admin" ? "Admin" : "Participant"}
          </Button>
        </Field>
      </FieldGroup>
    </form>
  )
}
