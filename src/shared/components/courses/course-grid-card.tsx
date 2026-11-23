import { ClockIcon } from "lucide-react"
import { toast } from "sonner"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { courseToneClass } from "@/shared/components/courses/course-tones"
import type { CourseItem } from "@/shared/data/mock-courses"

export function CourseGridCard({ course }: { course: CourseItem }) {
  return (
    <Card className="overflow-hidden py-0">
      <div className={`relative aspect-[16/10] ${courseToneClass(course.tone)}`}>
        <div className="absolute inset-0 flex flex-col justify-between p-4">
          <div className="flex justify-end">
            <Badge variant="secondary">{course.duration}</Badge>
          </div>
          <p className="font-heading text-lg font-semibold leading-snug">
            {course.title}
          </p>
        </div>
      </div>
      <CardHeader className="gap-1">
        <CardDescription className="flex items-center gap-1.5 text-xs">
          <ClockIcon className="size-3.5" />
          {course.duration} · {course.level}
        </CardDescription>
        <CardTitle className="text-base leading-snug">{course.title}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="line-clamp-2 text-sm text-muted-foreground">
          {course.summary}
        </p>
      </CardContent>
      <CardFooter className="justify-between border-t py-3">
        <span className="text-xs text-muted-foreground">
          {course.modules} lessons
        </span>
        <Button
          size="sm"
          variant="secondary"
          onClick={() => toast.message(`Opening ${course.title} (mock)`)}
        >
          Open
        </Button>
      </CardFooter>
    </Card>
  )
}
