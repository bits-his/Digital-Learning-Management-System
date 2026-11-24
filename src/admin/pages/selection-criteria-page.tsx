import * as React from "react"

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
import { Textarea } from "@/components/ui/textarea"
import { PageLayout } from "@/shared/components/page-layout"
import { useApplications } from "@/shared/data/applications/applications-context"
import type { ScoringCriterion } from "@/shared/data/applications/types"

export function AdminSelectionCriteriaPage() {
  const { state, updateCriteria } = useApplications()
  const [criteria, setCriteria] = React.useState<ScoringCriterion[]>(
    state.criteria
  )

  React.useEffect(() => {
    setCriteria(state.criteria)
  }, [state.criteria])

  const totalWeight = criteria.reduce((sum, item) => sum + item.weight, 0)

  return (
    <PageLayout
      variant="standard"
      title="Scoring criteria"
      description="Configure weighted assessment criteria for selection."
    >
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Rubric weights</CardTitle>
          <CardDescription>Total weight: {totalWeight}%</CardDescription>
        </CardHeader>
        <CardContent>
          <FieldGroup>
            {criteria.map((criterion, index) => (
              <div key={criterion.id} className="rounded-lg border p-3">
                <FieldGroup>
                  <Field>
                    <FieldLabel>Label</FieldLabel>
                    <Input
                      value={criterion.label}
                      onChange={(e) =>
                        setCriteria((prev) =>
                          prev.map((item, i) =>
                            i === index
                              ? { ...item, label: e.target.value }
                              : item
                          )
                        )
                      }
                    />
                  </Field>
                  <Field>
                    <FieldLabel>Weight (%)</FieldLabel>
                    <Input
                      type="number"
                      min={0}
                      max={100}
                      value={criterion.weight}
                      onChange={(e) =>
                        setCriteria((prev) =>
                          prev.map((item, i) =>
                            i === index
                              ? { ...item, weight: Number(e.target.value) }
                              : item
                          )
                        )
                      }
                    />
                  </Field>
                  <Field>
                    <FieldLabel>Description</FieldLabel>
                    <Textarea
                      value={criterion.description}
                      onChange={(e) =>
                        setCriteria((prev) =>
                          prev.map((item, i) =>
                            i === index
                              ? { ...item, description: e.target.value }
                              : item
                          )
                        )
                      }
                    />
                  </Field>
                </FieldGroup>
              </div>
            ))}
          </FieldGroup>
        </CardContent>
        <CardFooter>
          <Button onClick={() => updateCriteria(criteria)}>Save criteria</Button>
        </CardFooter>
      </Card>
    </PageLayout>
  )
}
