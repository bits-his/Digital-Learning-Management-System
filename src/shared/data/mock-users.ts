import type { AuthUser } from "@/shared/auth/types"

export const MOCK_PASSWORD = "password"

export const mockUsers: AuthUser[] = [
  {
    id: "admin-1",
    name: "Ada Okonkwo",
    email: "admin@aaiiri.org",
    role: "admin",
    title: "Programme Manager",
    organization: "AAIIRI",
    avatar:
      "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=160&h=160&fit=crop&crop=face",
  },
  {
    id: "participant-1",
    name: "Chidi Nwosu",
    email: "participant@aaiiri.org",
    role: "participant",
    title: "Founder",
    organization: "GreenHarvest Agro",
    avatar:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=160&h=160&fit=crop&crop=face",
  },
]

export function findMockUser(email: string, role: AuthUser["role"]) {
  return mockUsers.find(
    (user) =>
      user.email.toLowerCase() === email.trim().toLowerCase() &&
      user.role === role
  )
}
