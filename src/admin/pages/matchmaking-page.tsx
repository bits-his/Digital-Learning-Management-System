import { toast } from "sonner"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

const matches = [
  {
    participant: "GreenHarvest Agro",
    partner: "WestBridge Capital",
    type: "Investor",
    stage: "Admin approval",
  },
  {
    participant: "Savanna Foods Ltd",
    partner: "Amina Diallo (Mentor)",
    type: "Mentor",
    stage: "Meeting scheduled",
  },
  {
    participant: "Coastal Spices Co",
    partner: "NorthStar Buyers",
    type: "Buyer",
    stage: "Introduction initiated",
  },
]

export function AdminMatchmakingPage() {
  return (
    <div className="flex flex-col gap-4">
      <div>
        <h1 className="font-heading text-2xl font-semibold">Matchmaking</h1>
        <p className="text-sm text-muted-foreground">
          Approve introductions between participants, mentors, investors, and
          buyers.
        </p>
      </div>
      <div className="flex flex-col gap-3">
        {matches.map((match) => (
          <Card key={`${match.participant}-${match.partner}`}>
            <CardHeader className="flex-row items-start justify-between gap-4 space-y-0">
              <div>
                <CardTitle className="text-base">
                  {match.participant} → {match.partner}
                </CardTitle>
                <CardDescription>{match.stage}</CardDescription>
              </div>
              <Badge variant="secondary">{match.type}</Badge>
            </CardHeader>
            <CardContent className="flex gap-2">
              <Button
                size="sm"
                variant="outline"
                onClick={() => toast.message("Match declined (mock)")}
              >
                Decline
              </Button>
              <Button
                size="sm"
                onClick={() => toast.success("Introduction approved (mock)")}
              >
                Approve intro
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
