import * as React from "react"
import { toast } from "sonner"

import {
  DOCUMENT_LABELS,
  XP_REWARDS,
  hasAllDocuments,
  isBusinessComplete,
  isPersonalComplete,
} from "@/shared/data/applications/gamification"
import { seedState } from "@/shared/data/applications/seed"
import type {
  ApplicationDocument,
  ApplicationRecord,
  ApplicationStatus,
  ApplicationsState,
  AuditEvent,
  BadgeId,
  BusinessProfile,
  CriterionScore,
  DeadlineConfig,
  DocumentType,
  PersonalDetails,
  ScoringCriterion,
} from "@/shared/data/applications/types"
import {
  emptyBusiness,
  emptyPersonal,
} from "@/shared/data/applications/types"

const STORAGE_KEY = "aaiiri-applications-state"

export const STATUS_LOOKUP_KEY = "aaiiri-status-lookup-id"

type ApplicationsContextValue = {
  state: ApplicationsState
  isApplicationsOpen: boolean
  getApplication: (id: string) => ApplicationRecord | undefined
  getByApplicant: (userId: string) => ApplicationRecord | undefined
  findByEmailOrId: (query: string) => ApplicationRecord | undefined
  ensureDraftForApplicant: (input: {
    userId: string
    personal: PersonalDetails
  }) => ApplicationRecord
  updatePersonal: (id: string, personal: PersonalDetails) => void
  updateBusiness: (id: string, business: BusinessProfile) => void
  uploadDocument: (
    id: string,
    type: DocumentType,
    fileName: string,
    sizeLabel: string
  ) => void
  removeDocument: (id: string, documentId: string) => void
  submitApplication: (id: string) => { ok: true } | { ok: false; message: string }
  setScores: (id: string, scores: CriterionScore[], note?: string) => void
  setStatus: (
    id: string,
    status: ApplicationStatus,
    actor: string,
    note?: string
  ) => void
  updateCriteria: (criteria: ScoringCriterion[]) => void
  updateDeadline: (deadline: DeadlineConfig) => void
  weightedScore: (app: ApplicationRecord) => number | null
  markNotificationRead: (applicationId: string, notificationId: string) => void
}

const ApplicationsContext =
  React.createContext<ApplicationsContextValue | null>(null)

function normalizeApplication(app: ApplicationRecord): ApplicationRecord {
  return {
    ...app,
    personal: { ...emptyPersonal(), ...app.personal },
    business: { ...emptyBusiness(), ...app.business },
  }
}

function readState(): ApplicationsState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return structuredClone(seedState)
    const parsed = JSON.parse(raw) as ApplicationsState
    return {
      ...parsed,
      applications: parsed.applications.map(normalizeApplication),
    }
  } catch {
    return structuredClone(seedState)
  }
}

function nowIso() {
  return new Date().toISOString()
}

function awardBadge(
  app: ApplicationRecord,
  badge: BadgeId,
  xp: number
): ApplicationRecord {
  if (app.badges.includes(badge)) return app
  return {
    ...app,
    badges: [...app.badges, badge],
    xp: app.xp + xp,
  }
}

function maybeAwardProgress(app: ApplicationRecord): ApplicationRecord {
  let next = app
  if (isBusinessComplete(next.business)) {
    next = awardBadge(next, "founder_profile", XP_REWARDS.founder_profile)
  }
  if (hasAllDocuments(next.documents)) {
    next = awardBadge(next, "document_ready", XP_REWARDS.document_ready)
  }
  return next
}

function awardPersonalXp(app: ApplicationRecord): ApplicationRecord {
  if (!isPersonalComplete(app.personal)) return app
  // Use a synthetic marker: if xp already includes personal via badge starter only,
  // track with a soft check — if business not started and xp is exactly starter, add personal
  // Simpler: store personalComplete in badges? Use notification or check xp thresholds.
  // Clean approach: if personal complete and xp < starter+personal and no founder yet, add personal once.
  const minAfterPersonal = XP_REWARDS.starter + XP_REWARDS.personal
  if (app.xp < minAfterPersonal && app.badges.includes("starter")) {
    return { ...app, xp: app.xp + XP_REWARDS.personal }
  }
  return app
}

export function ApplicationsProvider({
  children,
}: {
  children: React.ReactNode
}) {
  const [state, setState] = React.useState<ApplicationsState>(() => readState())

  React.useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
  }, [state])

  const patchApplication = React.useCallback(
    (id: string, updater: (app: ApplicationRecord) => ApplicationRecord) => {
      setState((prev) => ({
        ...prev,
        applications: prev.applications.map((app) =>
          app.id === id ? updater(app) : app
        ),
      }))
    },
    []
  )

  const appendAudit = React.useCallback((event: Omit<AuditEvent, "id">) => {
    setState((prev) => ({
      ...prev,
      audit: [
        {
          ...event,
          id: `audit-${crypto.randomUUID().slice(0, 8)}`,
        },
        ...prev.audit,
      ],
    }))
  }, [])

  const getApplication = React.useCallback(
    (id: string) => state.applications.find((app) => app.id === id),
    [state.applications]
  )

  const getByApplicant = React.useCallback(
    (userId: string) =>
      state.applications.find((app) => app.applicantUserId === userId),
    [state.applications]
  )

  const findByEmailOrId = React.useCallback(
    (query: string) => {
      const q = query.trim().toLowerCase()
      if (!q) return undefined
      return state.applications.find(
        (app) =>
          app.id.toLowerCase() === q ||
          app.personal.email.toLowerCase() === q
      )
    },
    [state.applications]
  )

  const isApplicationsOpen = React.useMemo(() => {
    const now = Date.now()
    const openAt = new Date(state.deadline.openAt).getTime()
    const closeAt = new Date(state.deadline.closeAt).getTime()
    return now >= openAt && now <= closeAt
  }, [state.deadline.closeAt, state.deadline.openAt])

  const ensureDraftForApplicant = React.useCallback(
    ({
      userId,
      personal,
    }: {
      userId: string
      personal: PersonalDetails
    }) => {
      const existingByUser = state.applications.find(
        (app) => app.applicantUserId === userId
      )
      if (existingByUser) return existingByUser

      // One application per email / intake
      const existingByEmail = state.applications.find(
        (app) =>
          app.personal.email.toLowerCase() === personal.email.toLowerCase()
      )
      if (existingByEmail) return existingByEmail

      const created: ApplicationRecord = {
        id: `APP-${Math.floor(2000 + Math.random() * 8000)}`,
        applicantUserId: userId,
        status: "draft",
        personal: { ...emptyPersonal(), ...personal },
        business: emptyBusiness(),
        documents: [],
        scores: [],
        xp: XP_REWARDS.starter,
        badges: ["starter"],
        notifications: [
          {
            id: `n-${crypto.randomUUID().slice(0, 6)}`,
            title: "Welcome",
            body: "Complete your application to unlock Bootcamp selection.",
            createdAt: nowIso(),
            read: false,
          },
        ],
        createdAt: nowIso(),
        updatedAt: nowIso(),
      }

      setState((prev) => ({
        ...prev,
        applications: [created, ...prev.applications],
      }))
      return created
    },
    [state.applications]
  )

  const updatePersonal = React.useCallback(
    (id: string, personal: PersonalDetails) => {
      patchApplication(id, (app) => {
        let next = {
          ...app,
          personal,
          updatedAt: nowIso(),
        }
        next = awardPersonalXp(next)
        return maybeAwardProgress(next)
      })
    },
    [patchApplication]
  )

  const updateBusiness = React.useCallback(
    (id: string, business: BusinessProfile) => {
      patchApplication(id, (app) =>
        maybeAwardProgress({
          ...app,
          business,
          updatedAt: nowIso(),
        })
      )
    },
    [patchApplication]
  )

  const uploadDocument = React.useCallback(
    (id: string, type: DocumentType, fileName: string, sizeLabel: string) => {
      patchApplication(id, (app) => {
        const withoutType = app.documents.filter((doc) => doc.type !== type)
        const doc: ApplicationDocument = {
          id: `doc-${crypto.randomUUID().slice(0, 8)}`,
          type,
          name: fileName,
          sizeLabel,
          uploadedAt: nowIso(),
        }
        const next = maybeAwardProgress({
          ...app,
          documents: [...withoutType, doc],
          updatedAt: nowIso(),
        })
        toast.message(`${DOCUMENT_LABELS[type]} uploaded`)
        return next
      })
    },
    [patchApplication]
  )

  const removeDocument = React.useCallback(
    (id: string, documentId: string) => {
      patchApplication(id, (app) => ({
        ...app,
        documents: app.documents.filter((doc) => doc.id !== documentId),
        updatedAt: nowIso(),
      }))
    },
    [patchApplication]
  )

  const submitApplication = React.useCallback(
    (id: string) => {
      const app = state.applications.find((item) => item.id === id)
      if (!app) return { ok: false as const, message: "Application not found." }
      if (!isPersonalComplete(app.personal)) {
        return { ok: false as const, message: "Complete personal details first." }
      }
      if (!isBusinessComplete(app.business)) {
        return { ok: false as const, message: "Complete business profile first." }
      }
      if (!hasAllDocuments(app.documents)) {
        return {
          ok: false as const,
          message: "Upload all required documents first.",
        }
      }

      const closeAt = new Date(state.deadline.closeAt).getTime()
      if (Date.now() > closeAt) {
        return { ok: false as const, message: "Application deadline has passed." }
      }

      patchApplication(id, (current) => {
        let next: ApplicationRecord = {
          ...current,
          status: "submitted",
          submittedAt: nowIso(),
          updatedAt: nowIso(),
          notifications: [
            {
              id: `n-${crypto.randomUUID().slice(0, 6)}`,
              title: "Application submitted",
              body: "Your application was received and is awaiting review.",
              createdAt: nowIso(),
              read: false,
            },
            ...current.notifications,
          ],
        }
        next = awardBadge(next, "submitted", XP_REWARDS.submitted)
        return next
      })

      appendAudit({
        applicationId: id,
        actor: app.personal.fullName,
        action: "submitted",
        note: "Applicant submitted application",
        at: nowIso(),
      })

      toast.success("Application submitted")
      return { ok: true as const }
    },
    [appendAudit, patchApplication, state.applications, state.deadline.closeAt]
  )

  const setScores = React.useCallback(
    (id: string, scores: CriterionScore[], note?: string) => {
      patchApplication(id, (app) => ({
        ...app,
        scores,
        reviewerNote: note ?? app.reviewerNote,
        status: app.status === "submitted" ? "under_review" : app.status,
        updatedAt: nowIso(),
      }))
      appendAudit({
        applicationId: id,
        actor: "Programme reviewer",
        action: "scored",
        note,
        at: nowIso(),
      })
      toast.success("Scores saved")
    },
    [appendAudit, patchApplication]
  )

  const setStatus = React.useCallback(
    (
      id: string,
      status: ApplicationStatus,
      actor: string,
      note?: string
    ) => {
      patchApplication(id, (app) => {
        let next: ApplicationRecord = {
          ...app,
          status,
          reviewerNote: note ?? app.reviewerNote,
          updatedAt: nowIso(),
          notifications: [
            {
              id: `n-${crypto.randomUUID().slice(0, 6)}`,
              title: `Status: ${status.replaceAll("_", " ")}`,
              body:
                note ||
                `Your application status is now ${status.replaceAll("_", " ")}.`,
              createdAt: nowIso(),
              read: false,
            },
            ...app.notifications,
          ],
        }
        if (status === "shortlisted" || status === "approved") {
          next = awardBadge(next, "selected", XP_REWARDS.selected)
        }
        return next
      })
      appendAudit({
        applicationId: id,
        actor,
        action: status,
        note,
        at: nowIso(),
      })
      toast.success(`Marked as ${status.replaceAll("_", " ")}`)
    },
    [appendAudit, patchApplication]
  )

  const updateCriteria = React.useCallback((criteria: ScoringCriterion[]) => {
    setState((prev) => ({ ...prev, criteria }))
    toast.success("Criteria updated")
  }, [])

  const updateDeadline = React.useCallback((deadline: DeadlineConfig) => {
    setState((prev) => ({ ...prev, deadline }))
    toast.success("Deadline updated")
  }, [])

  const weightedScore = React.useCallback(
    (app: ApplicationRecord) => {
      if (!app.scores.length) return null
      const totalWeight = state.criteria.reduce((sum, c) => sum + c.weight, 0)
      if (!totalWeight) return null
      const weighted = state.criteria.reduce((sum, criterion) => {
        const score =
          app.scores.find((item) => item.criterionId === criterion.id)?.score ??
          0
        return sum + (score / 10) * criterion.weight
      }, 0)
      return Math.round(weighted)
    },
    [state.criteria]
  )

  const markNotificationRead = React.useCallback(
    (applicationId: string, notificationId: string) => {
      patchApplication(applicationId, (app) => ({
        ...app,
        notifications: app.notifications.map((item) =>
          item.id === notificationId ? { ...item, read: true } : item
        ),
      }))
    },
    [patchApplication]
  )

  const value = React.useMemo(
    () => ({
      state,
      isApplicationsOpen,
      getApplication,
      getByApplicant,
      findByEmailOrId,
      ensureDraftForApplicant,
      updatePersonal,
      updateBusiness,
      uploadDocument,
      removeDocument,
      submitApplication,
      setScores,
      setStatus,
      updateCriteria,
      updateDeadline,
      weightedScore,
      markNotificationRead,
    }),
    [
      state,
      isApplicationsOpen,
      getApplication,
      getByApplicant,
      findByEmailOrId,
      ensureDraftForApplicant,
      updatePersonal,
      updateBusiness,
      uploadDocument,
      removeDocument,
      submitApplication,
      setScores,
      setStatus,
      updateCriteria,
      updateDeadline,
      weightedScore,
      markNotificationRead,
    ]
  )

  return (
    <ApplicationsContext.Provider value={value}>
      {children}
    </ApplicationsContext.Provider>
  )
}

export function useApplications() {
  const context = React.useContext(ApplicationsContext)
  if (!context) {
    throw new Error("useApplications must be used within ApplicationsProvider")
  }
  return context
}
