import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom"

import { AdminLayout } from "@/admin/layouts/admin-layout"
import { AdminAllocationsPage } from "@/admin/pages/allocations-page"
import { AdminAnalyticsPage } from "@/admin/pages/analytics-page"
import { AdminApplicationDetailPage } from "@/admin/pages/application-detail-page"
import { AdminApplicationsPage } from "@/admin/pages/applications-page"
import { AdminAssessmentsPage } from "@/admin/pages/assessments-page"
import { AdminAssignmentsPage } from "@/admin/pages/admin-assignments-page"
import { AdminCertificationPage } from "@/admin/pages/certification-page"
import { AdminCohortsPage } from "@/admin/pages/cohorts-page"
import { AdminCourseDetailPage } from "@/admin/pages/course-detail-page"
import { AdminCoursesPage } from "@/admin/pages/courses-page"
import { AdminDashboardPage } from "@/admin/pages/dashboard-page"
import { AdminEnrolmentPage } from "@/admin/pages/enrolment-page"
import { AdminEnterprisesPage } from "@/admin/pages/enterprises-page"
import { AdminGradingPage } from "@/admin/pages/grading-page"
import { AdminMatchMeetingsPage } from "@/admin/pages/match-meetings-page"
import { AdminMatchOutcomesPage } from "@/admin/pages/match-outcomes-page"
import { AdminMatchmakingPage } from "@/admin/pages/matchmaking-page"
import { AdminMentorReportsPage } from "@/admin/pages/mentor-reports-page"
import { AdminMentorsPage } from "@/admin/pages/mentors-page"
import { AdminMentorshipSessionsPage } from "@/admin/pages/mentorship-sessions-page"
import { AdminPartnersPage } from "@/admin/pages/partners-page"
import { AdminPerformancePage } from "@/admin/pages/performance-page"
import { AdminSelectionAuditPage } from "@/admin/pages/selection-audit-page"
import { AdminSelectionCriteriaPage } from "@/admin/pages/selection-criteria-page"
import { AdminSelectionDeadlinesPage } from "@/admin/pages/selection-deadlines-page"
import { AdminSelectionDecisionsPage } from "@/admin/pages/selection-decisions-page"
import { AdminSessionsPage } from "@/admin/pages/sessions-page"
import { ApplicantShell } from "@/applicant/layouts/applicant-shell"
import { ApplicantDocumentsPage } from "@/applicant/pages/documents-page"
import { ApplicantFormPage } from "@/applicant/pages/form-page"
import { ApplicantGatePage } from "@/applicant/pages/gate-page"
import { ApplicantLoginPage } from "@/applicant/pages/login-page"
import { ApplicantRegisterPage } from "@/applicant/pages/register-page"
import { ApplicantStatusPage } from "@/applicant/pages/status-page"
import { MentorLayout } from "@/mentor/layouts/mentor-layout"
import { MentorDashboardPage } from "@/mentor/pages/dashboard-page"
import { MentorMenteesPage } from "@/mentor/pages/mentees-page"
import { MentorReportsPage } from "@/mentor/pages/reports-page"
import { MentorSessionsPage } from "@/mentor/pages/sessions-page"
import { ParticipantLayout } from "@/participant/layouts/participant-layout"
import { ParticipantAssignmentsPage } from "@/participant/pages/assignments-page"
import { ParticipantCertificatesPage } from "@/participant/pages/certificates-page"
import { ParticipantCourseDetailPage } from "@/participant/pages/course-detail-page"
import { ParticipantCoursesPage } from "@/participant/pages/courses-page"
import { ParticipantDashboardPage } from "@/participant/pages/dashboard-page"
import { ParticipantLessonPage } from "@/participant/pages/lesson-page"
import { ParticipantMentorshipPage } from "@/participant/pages/mentorship-page"
import { ParticipantOnboardingPage } from "@/participant/pages/onboarding-page"
import { ParticipantOpportunitiesPage } from "@/participant/pages/opportunities-page"
import { ParticipantPerformancePage } from "@/participant/pages/performance-page"
import { ParticipantProfilePage } from "@/participant/pages/profile-page"
import { ParticipantQuizzesPage } from "@/participant/pages/quizzes-page"
import { ParticipantReadinessPage } from "@/participant/pages/readiness-page"
import { ParticipantSessionsPage } from "@/participant/pages/sessions-page"
import { ParticipantTimetablePage } from "@/participant/pages/timetable-page"
import { RequireAuth } from "@/shared/auth/require-auth"
import { ScrollToTop } from "@/shared/components/scroll-to-top"
import { EnrolmentProvider } from "@/shared/enrolment/enrolment-context"
import { LearningProvider } from "@/shared/learning/learning-context"
import { LoginPage } from "@/shared/pages/login-page"
import { VerifyCertificatePage } from "@/shared/pages/verify-certificate-page"

export function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <EnrolmentProvider>
        <LearningProvider>
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/verify" element={<VerifyCertificatePage />} />
            <Route path="/" element={<Navigate to="/login" replace />} />

            <Route path="/apply" element={<ApplicantShell />}>
              <Route index element={<ApplicantGatePage />} />
              <Route path="register" element={<ApplicantRegisterPage />} />
              <Route path="login" element={<ApplicantLoginPage />} />
              <Route path="status" element={<ApplicantStatusPage />} />
              <Route element={<RequireAuth role="applicant" />}>
                <Route path="form" element={<ApplicantFormPage />} />
                <Route path="documents" element={<ApplicantDocumentsPage />} />
              </Route>
            </Route>

            <Route element={<RequireAuth role="admin" />}>
              <Route path="/admin" element={<AdminLayout />}>
                <Route index element={<AdminDashboardPage />} />
                <Route path="applications" element={<AdminApplicationsPage />} />
                <Route
                  path="applications/:id"
                  element={<AdminApplicationDetailPage />}
                />
                <Route
                  path="selection/criteria"
                  element={<AdminSelectionCriteriaPage />}
                />
                <Route
                  path="selection/deadlines"
                  element={<AdminSelectionDeadlinesPage />}
                />
                <Route
                  path="selection/decisions"
                  element={<AdminSelectionDecisionsPage />}
                />
                <Route
                  path="selection/audit"
                  element={<AdminSelectionAuditPage />}
                />
                <Route path="enrolment" element={<AdminEnrolmentPage />} />
                <Route path="cohorts" element={<AdminCohortsPage />} />
                <Route path="courses" element={<AdminCoursesPage />} />
                <Route
                  path="courses/:courseId"
                  element={<AdminCourseDetailPage />}
                />
                <Route path="sessions" element={<AdminSessionsPage />} />
                <Route path="assessments" element={<AdminAssessmentsPage />} />
                <Route path="assignments" element={<AdminAssignmentsPage />} />
                <Route path="grading" element={<AdminGradingPage />} />
                <Route path="performance" element={<AdminPerformancePage />} />
                <Route path="mentors" element={<AdminMentorsPage />} />
                <Route path="allocations" element={<AdminAllocationsPage />} />
                <Route
                  path="mentorship-sessions"
                  element={<AdminMentorshipSessionsPage />}
                />
                <Route
                  path="mentor-reports"
                  element={<AdminMentorReportsPage />}
                />
                <Route path="partners" element={<AdminPartnersPage />} />
                <Route path="enterprises" element={<AdminEnterprisesPage />} />
                <Route path="matchmaking" element={<AdminMatchmakingPage />} />
                <Route
                  path="match-meetings"
                  element={<AdminMatchMeetingsPage />}
                />
                <Route
                  path="match-outcomes"
                  element={<AdminMatchOutcomesPage />}
                />
                <Route
                  path="certification"
                  element={<AdminCertificationPage />}
                />
                <Route path="analytics" element={<AdminAnalyticsPage />} />
              </Route>
            </Route>

            <Route element={<RequireAuth role="participant" />}>
              <Route path="/participant" element={<ParticipantLayout />}>
                <Route index element={<ParticipantDashboardPage />} />
                <Route
                  path="onboarding"
                  element={<ParticipantOnboardingPage />}
                />
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
                <Route path="quizzes" element={<ParticipantQuizzesPage />} />
                <Route
                  path="performance"
                  element={<ParticipantPerformancePage />}
                />
                <Route
                  path="mentorship"
                  element={<ParticipantMentorshipPage />}
                />
                <Route path="readiness" element={<ParticipantReadinessPage />} />
                <Route
                  path="opportunities"
                  element={<ParticipantOpportunitiesPage />}
                />
                <Route
                  path="certificates"
                  element={<ParticipantCertificatesPage />}
                />
                <Route path="profile" element={<ParticipantProfilePage />} />
              </Route>
            </Route>

            <Route element={<RequireAuth role="mentor" />}>
              <Route path="/mentor" element={<MentorLayout />}>
                <Route index element={<MentorDashboardPage />} />
                <Route path="mentees" element={<MentorMenteesPage />} />
                <Route path="sessions" element={<MentorSessionsPage />} />
                <Route path="reports" element={<MentorReportsPage />} />
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
