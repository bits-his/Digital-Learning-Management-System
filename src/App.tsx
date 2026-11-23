import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom"

import { AdminLayout } from "@/admin/layouts/admin-layout"
import { AdminAnalyticsPage } from "@/admin/pages/analytics-page"
import { AdminApplicationsPage } from "@/admin/pages/applications-page"
import { AdminCohortsPage } from "@/admin/pages/cohorts-page"
import { AdminCourseDetailPage } from "@/admin/pages/course-detail-page"
import { AdminCoursesPage } from "@/admin/pages/courses-page"
import { AdminDashboardPage } from "@/admin/pages/dashboard-page"
import { AdminEnrolmentPage } from "@/admin/pages/enrolment-page"
import { AdminMatchmakingPage } from "@/admin/pages/matchmaking-page"
import { AdminSessionsPage } from "@/admin/pages/sessions-page"
import { ParticipantLayout } from "@/participant/layouts/participant-layout"
import { ParticipantAssignmentsPage } from "@/participant/pages/assignments-page"
import { ParticipantCertificatesPage } from "@/participant/pages/certificates-page"
import { ParticipantCourseDetailPage } from "@/participant/pages/course-detail-page"
import { ParticipantCoursesPage } from "@/participant/pages/courses-page"
import { ParticipantDashboardPage } from "@/participant/pages/dashboard-page"
import { ParticipantLessonPage } from "@/participant/pages/lesson-page"
import { ParticipantOnboardingPage } from "@/participant/pages/onboarding-page"
import { ParticipantProfilePage } from "@/participant/pages/profile-page"
import { ParticipantReadinessPage } from "@/participant/pages/readiness-page"
import { ParticipantSessionsPage } from "@/participant/pages/sessions-page"
import { ParticipantTimetablePage } from "@/participant/pages/timetable-page"
import { RequireAuth } from "@/shared/auth/require-auth"
import { EnrolmentProvider } from "@/shared/enrolment/enrolment-context"
import { LearningProvider } from "@/shared/learning/learning-context"
import { LoginPage } from "@/shared/pages/login-page"

export function App() {
  return (
    <BrowserRouter>
      <EnrolmentProvider>
        <LearningProvider>
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/" element={<Navigate to="/login" replace />} />

            <Route element={<RequireAuth role="admin" />}>
              <Route path="/admin" element={<AdminLayout />}>
                <Route index element={<AdminDashboardPage />} />
                <Route path="applications" element={<AdminApplicationsPage />} />
                <Route path="enrolment" element={<AdminEnrolmentPage />} />
                <Route path="cohorts" element={<AdminCohortsPage />} />
                <Route path="courses" element={<AdminCoursesPage />} />
                <Route
                  path="courses/:courseId"
                  element={<AdminCourseDetailPage />}
                />
                <Route path="sessions" element={<AdminSessionsPage />} />
                <Route path="matchmaking" element={<AdminMatchmakingPage />} />
                <Route path="analytics" element={<AdminAnalyticsPage />} />
              </Route>
            </Route>

            <Route element={<RequireAuth role="participant" />}>
              <Route path="/participant" element={<ParticipantLayout />}>
                <Route index element={<ParticipantDashboardPage />} />
                <Route path="onboarding" element={<ParticipantOnboardingPage />} />
                <Route path="courses" element={<ParticipantCoursesPage />} />
                <Route
                  path="courses/:courseId"
                  element={<ParticipantCourseDetailPage />}
                />
                <Route
                  path="courses/:courseId/lessons/:lessonId"
                  element={<ParticipantLessonPage />}
                />
                <Route path="timetable" element={<ParticipantTimetablePage />} />
                <Route path="sessions" element={<ParticipantSessionsPage />} />
                <Route
                  path="assignments"
                  element={<ParticipantAssignmentsPage />}
                />
                <Route path="readiness" element={<ParticipantReadinessPage />} />
                <Route
                  path="certificates"
                  element={<ParticipantCertificatesPage />}
                />
                <Route path="profile" element={<ParticipantProfilePage />} />
              </Route>
            </Route>

            <Route path="*" element={<Navigate to="/login" replace />} />
          </Routes>
        </LearningProvider>
      </EnrolmentProvider>
    </BrowserRouter>
  )
}

export default App
