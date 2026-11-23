import { CourseFeaturedCard } from "@/shared/components/courses/course-featured-card"
import { CourseGridCard } from "@/shared/components/courses/course-grid-card"
import {
  featuredCourse,
  gridCourses,
} from "@/shared/data/mock-courses"

export function CoursesCatalog({
  title = "Courses",
  description = "Bootcamp modules reusable across cohorts.",
}: {
  title?: string
  description?: string
}) {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="font-heading text-2xl font-semibold tracking-tight">
            {title}
          </h1>
          <p className="text-sm text-muted-foreground">{description}</p>
        </div>
        <p className="text-sm text-muted-foreground">
          {gridCourses.length + 1} modules
        </p>
      </div>

      <CourseFeaturedCard course={featuredCourse} />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {gridCourses.map((course) => (
          <CourseGridCard key={course.id} course={course} />
        ))}
      </div>
    </div>
  )
}
