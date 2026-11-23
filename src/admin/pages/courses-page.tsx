import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

const courses = [
  "Business Strategy and Investment Readiness",
  "Export Readiness and International Trade",
  "AGOA and AfCFTA Opportunities",
  "North American Market Access",
  "Financial Management and Investment Preparation",
  "Off-Takers, Buyers, and Strategic Partnerships",
  "Investor Pitch Development",
  "Climate-Smart Agriculture and Sustainable Production",
  "Partnership Development and Business Networking",
  "Investor Matchmaking and Deal Preparation",
]

export function AdminCoursesPage() {
  return (
    <div className="flex flex-col gap-4">
      <div>
        <h1 className="font-heading text-2xl font-semibold">Courses</h1>
        <p className="text-sm text-muted-foreground">
          Bootcamp modules reusable across cohorts.
        </p>
      </div>
      <div className="grid gap-3 md:grid-cols-2">
        {courses.map((title, index) => (
          <Card key={title}>
            <CardHeader className="flex-row items-start justify-between gap-3 space-y-0">
              <div>
                <CardDescription>Module {index + 1}</CardDescription>
                <CardTitle className="text-base">{title}</CardTitle>
              </div>
              <Badge variant="outline">Published</Badge>
            </CardHeader>
          </Card>
        ))}
      </div>
    </div>
  )
}
