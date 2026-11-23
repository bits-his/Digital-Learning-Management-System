import * as React from "react"

import {
  adminCourseStatus,
  flattenLessons,
  getLessonContext as buildLessonContext,
  learningCourses,
  participantCourseStatus,
  withCourseCounts,
  type Course,
  type Lesson,
  type LessonMedia,
  type LessonType,
  type Module,
  type QuizQuestion,
} from "@/shared/data/mock-learning"

export type AddLessonInput = {
  title: string
  type: LessonType
  duration: string
  description: string
  media?: LessonMedia
  quiz?: {
    passingScore: number
    questions: QuizQuestion[]
  }
}

type LearningContextValue = {
  courses: Course[]
  getCourseById: (id: string) => Course | undefined
  getLessonContext: (
    courseId: string,
    lessonId: string
  ) => ReturnType<typeof buildLessonContext>
  coursesForCohort: (cohortId: string | null | undefined) => Course[]
  createCourse: (input: {
    title: string
    shortTitle: string
    description: string
    facilitator: string
    facilitatorTitle: string
    duration: string
    cohortIds: string[]
  }) => Course
  updateCourse: (
    courseId: string,
    patch: Partial<
      Pick<
        Course,
        | "title"
        | "shortTitle"
        | "description"
        | "facilitator"
        | "facilitatorTitle"
        | "duration"
        | "published"
        | "cohortIds"
        | "coverImage"
      >
    >
  ) => void
  setCoursePublished: (courseId: string, published: boolean) => void
  setCourseCohorts: (courseId: string, cohortIds: string[]) => void
  addModule: (
    courseId: string,
    input: { title: string; summary: string }
  ) => Module | null
  addLesson: (
    courseId: string,
    moduleId: string,
    input: AddLessonInput
  ) => Lesson | null
  markLessonComplete: (
    courseId: string,
    lessonId: string,
    completed?: boolean
  ) => void
  stats: {
    total: number
    published: number
    drafts: number
    assigned: number
  }
}

const LearningContext = React.createContext<LearningContextValue | null>(null)

const DEFAULT_COVER =
  "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=1200&h=800&fit=crop"

function refreshCourse(course: Course): Course {
  return withCourseCounts(course)
}

export function LearningProvider({ children }: { children: React.ReactNode }) {
  const [courses, setCourses] = React.useState<Course[]>(() =>
    learningCourses.map(refreshCourse)
  )

  const getCourseById = React.useCallback(
    (id: string) => courses.find((course) => course.id === id),
    [courses]
  )

  const getLessonContext = React.useCallback(
    (courseId: string, lessonId: string) =>
      buildLessonContext(courseId, lessonId, courses),
    [courses]
  )

  const coursesForCohort = React.useCallback(
    (cohortId: string | null | undefined) => {
      if (!cohortId) return []
      return courses.filter(
        (course) =>
          course.published && course.cohortIds.includes(cohortId)
      )
    },
    [courses]
  )

  const createCourse = React.useCallback(
    (input: {
      title: string
      shortTitle: string
      description: string
      facilitator: string
      facilitatorTitle: string
      duration: string
      cohortIds: string[]
    }) => {
      const course = refreshCourse({
        id: `crs-${crypto.randomUUID().slice(0, 8)}`,
        title: input.title.trim(),
        shortTitle: input.shortTitle.trim() || input.title.trim().slice(0, 24),
        description: input.description.trim(),
        coverImage: DEFAULT_COVER,
        facilitator: input.facilitator.trim() || "Unassigned",
        facilitatorTitle: input.facilitatorTitle.trim() || "Facilitator",
        duration: input.duration.trim() || "2 weeks",
        moduleCount: 0,
        lessonCount: 0,
        progress: 0,
        status: "Draft",
        cohortIds: input.cohortIds,
        published: false,
        modules: [],
      })
      setCourses((prev) => [course, ...prev])
      return course
    },
    []
  )

  const updateCourse = React.useCallback(
    (
      courseId: string,
      patch: Partial<
        Pick<
          Course,
          | "title"
          | "shortTitle"
          | "description"
          | "facilitator"
          | "facilitatorTitle"
          | "duration"
          | "published"
          | "cohortIds"
          | "coverImage"
        >
      >
    ) => {
      setCourses((prev) =>
        prev.map((course) =>
          course.id === courseId
            ? refreshCourse({ ...course, ...patch })
            : course
        )
      )
    },
    []
  )

  const setCoursePublished = React.useCallback(
    (courseId: string, published: boolean) => {
      updateCourse(courseId, { published })
    },
    [updateCourse]
  )

  const setCourseCohorts = React.useCallback(
    (courseId: string, cohortIds: string[]) => {
      updateCourse(courseId, { cohortIds })
    },
    [updateCourse]
  )

  const addModule = React.useCallback(
    (courseId: string, input: { title: string; summary: string }) => {
      const module: Module = {
        id: `m-${crypto.randomUUID().slice(0, 8)}`,
        title: input.title.trim(),
        summary: input.summary.trim(),
        lessons: [],
      }
      let created: Module | null = null
      setCourses((prev) =>
        prev.map((course) => {
          if (course.id !== courseId) return course
          created = module
          return refreshCourse({
            ...course,
            modules: [...course.modules, module],
          })
        })
      )
      return created
    },
    []
  )

  const addLesson = React.useCallback(
    (courseId: string, moduleId: string, input: AddLessonInput) => {
      const lesson: Lesson = {
        id: `l-${crypto.randomUUID().slice(0, 8)}`,
        title: input.title.trim(),
        type: input.type,
        duration: input.duration.trim() || "15 min",
        completed: false,
        description: input.description.trim(),
        content:
          input.type === "video"
            ? "Watch this session recording and note three takeaways for your business."
            : input.type === "document"
              ? "Download and review the reading pack. Highlight sections relevant to your market."
              : input.type === "quiz"
                ? "Complete the short knowledge check to unlock the next module."
                : "Use these templates and checklists as you prepare your submission.",
        resourceUrl: input.media?.url ?? "#",
        media: input.media,
        quiz: input.quiz,
      }
      let created: Lesson | null = null
      setCourses((prev) =>
        prev.map((course) => {
          if (course.id !== courseId) return course
          return refreshCourse({
            ...course,
            modules: course.modules.map((module) => {
              if (module.id !== moduleId) return module
              created = lesson
              return { ...module, lessons: [...module.lessons, lesson] }
            }),
          })
        })
      )
      return created
    },
    []
  )

  const markLessonComplete = React.useCallback(
    (courseId: string, lessonId: string, completed = true) => {
      setCourses((prev) =>
        prev.map((course) => {
          if (course.id !== courseId) return course
          return refreshCourse({
            ...course,
            modules: course.modules.map((module) => ({
              ...module,
              lessons: module.lessons.map((lesson) =>
                lesson.id === lessonId ? { ...lesson, completed } : lesson
              ),
            })),
          })
        })
      )
    },
    []
  )

  const stats = React.useMemo(() => {
    const published = courses.filter((course) => course.published).length
    return {
      total: courses.length,
      published,
      drafts: courses.length - published,
      assigned: courses.filter((course) => course.cohortIds.length > 0).length,
    }
  }, [courses])

  const value = React.useMemo(
    () => ({
      courses,
      getCourseById,
      getLessonContext,
      coursesForCohort,
      createCourse,
      updateCourse,
      setCoursePublished,
      setCourseCohorts,
      addModule,
      addLesson,
      markLessonComplete,
      stats,
    }),
    [
      courses,
      getCourseById,
      getLessonContext,
      coursesForCohort,
      createCourse,
      updateCourse,
      setCoursePublished,
      setCourseCohorts,
      addModule,
      addLesson,
      markLessonComplete,
      stats,
    ]
  )

  return (
    <LearningContext.Provider value={value}>
      {children}
    </LearningContext.Provider>
  )
}

export function useLearning() {
  const context = React.useContext(LearningContext)
  if (!context) {
    throw new Error("useLearning must be used within LearningProvider")
  }
  return context
}

export function useCourseDisplayStatus(course: Course) {
  return course.published
    ? participantCourseStatus(course.progress)
    : adminCourseStatus(course)
}

export function useLessonOutline(course: Course) {
  return flattenLessons(course)
}
