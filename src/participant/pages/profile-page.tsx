import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { useAuth } from "@/shared/auth/auth-context"

export function ParticipantProfilePage() {
  const { user } = useAuth()

  return (
    <div className="flex flex-col gap-4">
      <div>
        <h1 className="font-heading text-2xl font-semibold">Business profile</h1>
        <p className="text-sm text-muted-foreground">
          Shared with mentors and partners only after you consent.
        </p>
      </div>
      <Card className="max-w-xl">
        <CardHeader>
          <CardTitle>{user?.organization ?? "Your business"}</CardTitle>
          <CardDescription>
            Mock profile fields for matchmaking prep.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <FieldGroup>
            <Field>
              <FieldLabel htmlFor="founder">Founder name</FieldLabel>
              <Input id="founder" defaultValue={user?.name} />
            </Field>
            <Field>
              <FieldLabel htmlFor="business">Business name</FieldLabel>
              <Input
                id="business"
                defaultValue={user?.organization ?? ""}
              />
            </Field>
            <Field>
              <FieldLabel htmlFor="sector">Sector</FieldLabel>
              <Input id="sector" defaultValue="Climate-smart agriculture" />
            </Field>
            <Field>
              <FieldLabel htmlFor="markets">Target markets</FieldLabel>
              <Input id="markets" defaultValue="Nigeria, USA (AGOA)" />
            </Field>
          </FieldGroup>
        </CardContent>
        <CardFooter>
          <Button
            onClick={() => toast.success("Profile saved (mock)")}
          >
            Save profile
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}
