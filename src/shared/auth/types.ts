export type UserRole = "admin" | "participant"

export type AuthUser = {
  id: string
  name: string
  email: string
  role: UserRole
  avatar?: string
  title?: string
  organization?: string
}
