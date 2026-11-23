import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { participantCourses } from "@/shared/data/mock-participant"

export function ParticipantCoursesPage() {
  return (
    <div className="flex flex-col gap-4">
      <div>
        <h1 className="font-heading text-2xl font-semibold">My courses</h1>
        <p className="text-sm text-muted-foreground">
          Module progress for your current cohort.
        </p>
      </div>
      <div className="flex flex-col gap-3">
        {participantCourses.map((course) => (
          <Card key={course.title}>
            <CardHeader className="flex-row items-start justify-between gap-4 space-y-0">
              <div>
                <CardTitle className="text-base">{course.title}</CardTitle>
                <CardDescription>{course.progress}% complete</CardDescription>
              </div>
              <Badge variant="secondary">{course.status}</Badge>
            </CardHeader>
            <CardContent>
              <div className="h-2 overflow-hidden rounded-full bg-muted">
                <div
                  className="h-full rounded-full bg-primary"
                  style={{ width: `${course.progress}%` }}
                />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
