export type UserRole = "admin" | "participant" | "applicant"

export type AuthUser = {
  id: string
  name: string
  email: string
  role: UserRole
  avatar?: string
  title?: string
  organization?: string
}
