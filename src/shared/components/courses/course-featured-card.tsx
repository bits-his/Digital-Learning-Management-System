import { ClockIcon, LayersIcon, SignalIcon } from "lucide-react"
import { toast } from "sonner"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { courseToneClass } from "@/shared/components/courses/course-tones"
import type { CourseItem } from "@/shared/data/mock-courses"

export function CourseFeaturedCard({ course }: { course: CourseItem }) {
  return (
    <Card className="overflow-hidden py-0">
      <div className="grid md:grid-cols-[1.2fr_0.8fr]">
        <div className="flex flex-col gap-4 p-6">
          <CardHeader className="p-0">
            <div className="flex flex-wrap items-center gap-2">
              <CardDescription className="text-xs tracking-wide uppercase">
                Bootcamp module
              </CardDescription>
              {course.badge ? <Badge>{course.badge}</Badge> : null}
            </div>
            <CardTitle className="font-heading text-2xl leading-tight">
              {course.title}
            </CardTitle>
            <CardDescription className="text-sm leading-relaxed">
              {course.summary}
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-4 p-0">
            <div className="flex flex-wrap gap-4 text-xs text-muted-foreground">
              <span className="inline-flex items-center gap-1.5">
                <ClockIcon className="size-3.5" />
                {course.duration}
              </span>
              <span className="inline-flex items-center gap-1.5">
                <LayersIcon className="size-3.5" />
                {course.modules} lessons
              </span>
              <span className="inline-flex items-center gap-1.5">
                <SignalIcon className="size-3.5" />
                {course.level}
              </span>
            </div>
            <div>
              <Button
                onClick={() => toast.message(`Opening ${course.title} (mock)`)}
              >
                Open module
              </Button>
            </div>
          </CardContent>
        </div>
        <div
          className={`relative min-h-48 md:min-h-full ${courseToneClass(course.tone)}`}
        >
          <div className="absolute inset-0 flex items-end p-6">
            <p className="max-w-[12rem] font-heading text-2xl font-semibold tracking-tight">
              {course.level} track
            </p>
          </div>
        </div>
      </div>
    </Card>
  )
}
