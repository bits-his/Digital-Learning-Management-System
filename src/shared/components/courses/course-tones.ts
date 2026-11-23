import type { CourseItem } from "@/shared/data/mock-courses"
import { cn } from "@/lib/utils"

export function courseToneClass(tone: CourseItem["tone"]) {
  return cn(
    "bg-muted text-foreground",
    tone === "forest" && "bg-primary/15 text-foreground",
    tone === "ocean" && "bg-secondary text-foreground",
    tone === "sand" && "bg-accent text-foreground",
    tone === "slate" && "bg-muted text-foreground",
    tone === "ember" && "bg-destructive/10 text-foreground"
  )
}
