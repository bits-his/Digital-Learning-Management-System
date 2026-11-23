export type EligibilityRule = {
  id: string
  label: string
  description: string
  thresholdLabel: string
  required: boolean
}

export type EligibilityCheck = {
  ruleId: string
  label: string
  met: boolean
  actual: string
  required: string
}

export type CertificateRecord = {
  id: string
  code: string
  verificationCode: string
  participantId: string
  recipientName: string
  businessName: string
  programme: string
  cohort: string
  issuedAt: string
  issuedBy: string
  status: "Draft" | "Issued" | "Revoked"
  eligibilitySnapshot: EligibilityCheck[]
}

export const certificationRules: EligibilityRule[] = [
  {
    id: "rule-1",
    label: "Course completion",
    description: "Complete the majority of bootcamp learning modules.",
    thresholdLabel: "≥ 80% modules",
    required: true,
  },
  {
    id: "rule-2",
    label: "Assessment performance",
    description: "Maintain a solid overall assessment score.",
    thresholdLabel: "Overall ≥ 70",
    required: true,
  },
  {
    id: "rule-3",
    label: "Business readiness",
    description: "Reach investment/buyer readiness checklist threshold.",
    thresholdLabel: "Readiness ≥ 75",
    required: true,
  },
  {
    id: "rule-4",
    label: "Final pitch approval",
    description: "Mentor or facilitator marks final pitch as approved.",
    thresholdLabel: "Approved",
    required: true,
  },
  {
    id: "rule-5",
    label: "Mentorship engagement",
    description: "Complete at least one recorded mentorship session.",
    thresholdLabel: "≥ 1 completed session",
    required: false,
  },
]

export const issuedCertificates: CertificateRecord[] = [
  {
    id: "cert-1",
    code: "AAIIRI-2027-CS-10482",
    verificationCode: "VERIFY-CS-10482-KX9",
    participantId: "participant-3",
    recipientName: "Ibrahim Yusuf",
    businessName: "Coastal Spices Co",
    programme: "AAIIRI Bootcamp 2027 — Export & Investment Track",
    cohort: "Cohort 2027-A",
    issuedAt: "10 Feb 2027",
    issuedBy: "Ada Okonkwo",
    status: "Issued",
    eligibilitySnapshot: [
      {
        ruleId: "rule-1",
        label: "Course completion",
        met: true,
        actual: "88%",
        required: "≥ 80%",
      },
      {
        ruleId: "rule-2",
        label: "Assessment performance",
        met: true,
        actual: "78",
        required: "≥ 70",
      },
      {
        ruleId: "rule-3",
        label: "Business readiness",
        met: true,
        actual: "78",
        required: "≥ 75",
      },
      {
        ruleId: "rule-4",
        label: "Final pitch approval",
        met: true,
        actual: "Approved",
        required: "Approved",
      },
      {
        ruleId: "rule-5",
        label: "Mentorship engagement",
        met: true,
        actual: "1 session",
        required: "≥ 1",
      },
    ],
  },
]

/** Live eligibility view for the logged-in demo participant (Chidi). */
export function getParticipantEligibility(participantId: string): {
  checks: EligibilityCheck[]
  eligible: boolean
  progressLabel: string
} {
  if (participantId === "participant-3") {
    const checks = issuedCertificates[0].eligibilitySnapshot
    return {
      checks,
      eligible: true,
      progressLabel: "All required rules met — certificate issued",
    }
  }

  const checks: EligibilityCheck[] = [
    {
      ruleId: "rule-1",
      label: "Course completion",
      met: false,
      actual: "62%",
      required: "≥ 80%",
    },
    {
      ruleId: "rule-2",
      label: "Assessment performance",
      met: true,
      actual: "78",
      required: "≥ 70",
    },
    {
      ruleId: "rule-3",
      label: "Business readiness",
      met: false,
      actual: "71",
      required: "≥ 75",
    },
    {
      ruleId: "rule-4",
      label: "Final pitch approval",
      met: false,
      actual: "In review",
      required: "Approved",
    },
    {
      ruleId: "rule-5",
      label: "Mentorship engagement",
      met: true,
      actual: "1 session",
      required: "≥ 1",
    },
  ]

  const requiredMet = checks
    .filter((item) => item.ruleId !== "rule-5")
    .every((item) => item.met)
  const metCount = checks.filter((item) => item.met).length

  return {
    checks,
    eligible: requiredMet,
    progressLabel: `${metCount} of ${checks.length} criteria met`,
  }
}

export function getCertificatesForParticipant(participantId: string) {
  return issuedCertificates.filter(
    (item) => item.participantId === participantId && item.status === "Issued"
  )
}

export function findCertificateByVerification(input: string) {
  const needle = input.trim().toUpperCase()
  return issuedCertificates.find(
    (item) =>
      item.status === "Issued" &&
      (item.verificationCode.toUpperCase() === needle ||
        item.code.toUpperCase() === needle)
  )
}

export function generateCertificateCodes(businessSlug: string) {
  const serial = Math.floor(10000 + Math.random() * 90000)
  const slug = businessSlug
    .replace(/[^a-zA-Z]/g, "")
    .slice(0, 2)
    .toUpperCase()
    .padEnd(2, "X")
  const code = `AAIIRI-2027-${slug}-${serial}`
  const verificationCode = `VERIFY-${slug}-${serial}-${Math.random()
    .toString(36)
    .slice(2, 5)
    .toUpperCase()}`
  return { code, verificationCode }
}
