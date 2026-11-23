import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty"
import { AwardIcon } from "lucide-react"

export function ParticipantCertificatesPage() {
  return (
    <div className="flex flex-col gap-4">
      <div>
        <h1 className="font-heading text-2xl font-semibold">Certificates</h1>
        <p className="text-sm text-muted-foreground">
          Completion certificates appear here after programme criteria are met.
        </p>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>In progress</CardTitle>
          <CardDescription>
            Certificate unlocks at 80% course completion and final pitch
            approval.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Empty>
            <EmptyHeader>
              <EmptyMedia variant="icon">
                <AwardIcon />
              </EmptyMedia>
              <EmptyTitle>No certificate yet</EmptyTitle>
              <EmptyDescription>
                Keep learning — your AAIIRI certificate will show here with a
                verification code.
              </EmptyDescription>
            </EmptyHeader>
            <EmptyContent>
              <Button
                variant="outline"
                onClick={() =>
                  toast.message("Progress reminder saved (mock)")
                }
              >
                Remind me later
              </Button>
            </EmptyContent>
          </Empty>
        </CardContent>
      </Card>
    </div>
  )
}
