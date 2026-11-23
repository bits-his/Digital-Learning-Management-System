export type UserRole = "admin" | "participant" | "mentor"

export type AuthUser = {
  id: string
  name: string
  email: string
  role: UserRole
  avatar?: string
  title?: string
  organization?: string
}

export function hubPathForRole(role: UserRole): string {
  switch (role) {
    case "admin":
      return "/admin"
    case "mentor":
      return "/mentor"
    case "participant":
      return "/participant"
  }
}
