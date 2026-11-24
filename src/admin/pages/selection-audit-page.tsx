import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { PageLayout } from "@/shared/components/page-layout"
import { useApplications } from "@/shared/data/applications/applications-context"

export function AdminSelectionAuditPage() {
  const { state } = useApplications()

  return (
    <PageLayout
      variant="standard"
      title="Audit trail"
      description="Auditable record of scoring and selection decisions."
    >
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
    </PageLayout>
  )
}
