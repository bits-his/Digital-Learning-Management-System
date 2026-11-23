import * as React from "react"
import { FileIcon, UploadIcon, XIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

export function FileDropzone({
  label,
  hint,
  fileName,
  fileMeta,
  onFile,
  onClear,
  accept,
}: {
  label: string
  hint?: string
  fileName?: string
  fileMeta?: string
  onFile: (file: File) => void
  onClear?: () => void
  accept?: string
}) {
  const inputRef = React.useRef<HTMLInputElement>(null)
  const [dragging, setDragging] = React.useState(false)

  function handleFiles(files: FileList | null) {
    const file = files?.[0]
    if (file) onFile(file)
  }

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-between gap-2">
        <p className="text-sm font-medium">{label}</p>
        {fileName && onClear ? (
          <Button type="button" size="sm" variant="ghost" onClick={onClear}>
            <XIcon data-icon="inline-start" />
            Remove
          </Button>
        ) : null}
      </div>
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        onDragEnter={(event) => {
          event.preventDefault()
          setDragging(true)
        }}
        onDragOver={(event) => {
          event.preventDefault()
          setDragging(true)
        }}
        onDragLeave={(event) => {
          event.preventDefault()
          setDragging(false)
        }}
        onDrop={(event) => {
          event.preventDefault()
          setDragging(false)
          handleFiles(event.dataTransfer.files)
        }}
        className={cn(
          "flex w-full flex-col items-center justify-center gap-2 rounded-xl border border-dashed px-4 py-8 text-center transition-colors",
          dragging
            ? "border-primary bg-primary/5"
            : "border-border bg-muted/40 hover:border-primary/50 hover:bg-muted/70"
        )}
      >
        {fileName ? (
          <>
            <FileIcon className="size-8 text-primary" />
            <div className="flex flex-col gap-0.5">
              <span className="text-sm font-medium">{fileName}</span>
              {fileMeta ? (
                <span className="text-xs text-muted-foreground">{fileMeta}</span>
              ) : null}
            </div>
            <span className="text-xs text-muted-foreground">
              Click or drop a new file to replace
            </span>
          </>
        ) : (
          <>
            <UploadIcon className="size-8 text-muted-foreground" />
            <div className="flex flex-col gap-0.5">
              <span className="text-sm font-medium">
                Drag & drop, or click to upload
              </span>
              {hint ? (
                <span className="text-xs text-muted-foreground">{hint}</span>
              ) : (
                <span className="text-xs text-muted-foreground">
                  PDF, DOC, or image · max 10MB
                </span>
              )}
            </div>
          </>
        )}
      </button>
      <input
        ref={inputRef}
        type="file"
        className="sr-only"
        accept={accept}
        onChange={(event) => {
          handleFiles(event.target.files)
          event.target.value = ""
        }}
      />
    </div>
  )
}
