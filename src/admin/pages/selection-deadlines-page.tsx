import * as React from "react"

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
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
import { PageLayout } from "@/shared/components/page-layout"
import { useApplications } from "@/shared/data/applications/applications-context"

function toLocalInput(iso: string) {
  const date = new Date(iso)
  const offset = date.getTimezoneOffset()
  const local = new Date(date.getTime() - offset * 60_000)
  return local.toISOString().slice(0, 16)
}

export function AdminSelectionDeadlinesPage() {
  const { state, updateDeadline } = useApplications()
  const [label, setLabel] = React.useState(state.deadline.label)
  const [openAt, setOpenAt] = React.useState(toLocalInput(state.deadline.openAt))
  const [closeAt, setCloseAt] = React.useState(
    toLocalInput(state.deadline.closeAt)
  )

  React.useEffect(() => {
    setLabel(state.deadline.label)
    setOpenAt(toLocalInput(state.deadline.openAt))
    setCloseAt(toLocalInput(state.deadline.closeAt))
  }, [state.deadline])

  const open = Date.now() <= new Date(state.deadline.closeAt).getTime()

  return (
    <PageLayout variant="bare">

      <Alert>
        <AlertTitle>{open ? "Window open" : "Window closed"}</AlertTitle>
        <AlertDescription>
          Current close date:{" "}
          {new Date(state.deadline.closeAt).toLocaleString()}
        </AlertDescription>
      </Alert>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Deadline settings</CardTitle>
          <CardDescription>{state.deadline.label}</CardDescription>
        </CardHeader>
        <CardContent>
          <FieldGroup>
            <Field>
              <FieldLabel htmlFor="label">Intake label</FieldLabel>
              <Input
                id="label"
                value={label}
                onChange={(e) => setLabel(e.target.value)}
              />
            </Field>
            <Field>
              <FieldLabel htmlFor="openAt">Opens</FieldLabel>
              <Input
                id="openAt"
                type="datetime-local"
                value={openAt}
                onChange={(e) => setOpenAt(e.target.value)}
              />
            </Field>
            <Field>
              <FieldLabel htmlFor="closeAt">Closes</FieldLabel>
              <Input
                id="closeAt"
                type="datetime-local"
                value={closeAt}
                onChange={(e) => setCloseAt(e.target.value)}
              />
            </Field>
          </FieldGroup>
        </CardContent>
        <CardFooter>
          <Button
            onClick={() =>
              updateDeadline({
                label,
                openAt: new Date(openAt).toISOString(),
                closeAt: new Date(closeAt).toISOString(),
              })
            }
          >
            Save deadline
          </Button>
        </CardFooter>
      </Card>
    </PageLayout>
  )
}
