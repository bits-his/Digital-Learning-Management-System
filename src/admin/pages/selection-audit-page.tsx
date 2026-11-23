import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { useApplications } from "@/shared/data/applications/applications-context"

export function AdminSelectionAuditPage() {
  const { state } = useApplications()

  return (
    <div className="flex flex-col gap-4">
      <div>
        <h1 className="font-heading text-2xl font-semibold">
          Selection audit trail
        </h1>
        <p className="text-sm text-muted-foreground">
          Auditable record of scoring and selection decisions.
        </p>
      </div>
      <div className="overflow-hidden rounded-xl border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>When</TableHead>
              <TableHead>Application</TableHead>
              <TableHead>Actor</TableHead>
              <TableHead>Action</TableHead>
              <TableHead>Note</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {state.audit.map((event) => (
              <TableRow key={event.id}>
                <TableCell className="whitespace-nowrap text-xs text-muted-foreground">
                  {new Date(event.at).toLocaleString()}
                </TableCell>
                <TableCell>{event.applicationId}</TableCell>
                <TableCell>{event.actor}</TableCell>
                <TableCell className="capitalize">
                  {event.action.replaceAll("_", " ")}
                </TableCell>
                <TableCell className="max-w-xs truncate text-muted-foreground">
                  {event.note || "—"}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
