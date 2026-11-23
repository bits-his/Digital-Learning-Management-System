import { Link } from "react-router-dom"

import { FileDropzone } from "@/applicant/components/file-dropzone"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/shared/auth/auth-context"
import { useApplications } from "@/shared/data/applications/applications-context"
import {
  DOCUMENT_LABELS,
  REQUIRED_DOCUMENTS,
} from "@/shared/data/applications/gamification"
import type { DocumentType } from "@/shared/data/applications/types"

function sizeLabelFor(file: File) {
  return file.size > 1024 * 1024
    ? `${(file.size / (1024 * 1024)).toFixed(1)} MB`
    : `${Math.max(1, Math.round(file.size / 1024))} KB`
}

export function ApplicantDocumentsPage() {
  const { user } = useAuth()
  const { getByApplicant, uploadDocument, removeDocument } = useApplications()
  const application = user ? getByApplicant(user.id) : undefined

  if (!application) {
    return (
      <div className="mx-auto flex max-w-lg flex-col gap-4 py-16 text-center">
        <h1 className="font-heading text-2xl font-semibold">
          No application draft
        </h1>
        <p className="text-muted-foreground">Create an application first.</p>
        <Button className="mx-auto h-11 w-fit px-6" asChild>
          <Link to="/apply/form">Open form</Link>
        </Button>
      </div>
    )
  }

  function handleUpload(type: DocumentType, file: File) {
    uploadDocument(application!.id, type, file.name, sizeLabelFor(file))
  }

  return (
    <div className="mx-auto flex w-full max-w-3xl flex-col gap-8">
      <div className="flex flex-col gap-2">
        <h1 className="font-heading text-3xl font-semibold tracking-tight">
          Documents
        </h1>
        <p className="text-muted-foreground">
          Upload or replace required application documents.
        </p>
      </div>
      <div className="flex flex-col gap-5">
        {REQUIRED_DOCUMENTS.map((type) => {
          const existing = application.documents.find(
            (doc) => doc.type === type
          )
          return (
            <FileDropzone
              key={type}
              label={DOCUMENT_LABELS[type]}
              fileName={existing?.name}
              fileMeta={existing?.sizeLabel}
              onFile={(file) => handleUpload(type, file)}
              onClear={
                existing
                  ? () => removeDocument(application.id, existing.id)
                  : undefined
              }
            />
          )
        })}
      </div>
      <Button variant="outline" className="h-11 w-fit" asChild>
        <Link to="/apply/form">Back to application</Link>
      </Button>
    </div>
  )
}
