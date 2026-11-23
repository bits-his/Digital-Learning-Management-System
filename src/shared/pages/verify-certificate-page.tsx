import * as React from "react"
import { Link, useSearchParams } from "react-router-dom"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import { Field, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { BrandMark } from "@/shared/components/brand-mark"
import {
  findCertificateByVerification,
  type CertificateRecord,
} from "@/shared/data/mock-certification"
import { StatusLabel } from "@/shared/components/work-row"

export function VerifyCertificatePage() {
  const [params] = useSearchParams()
  const initial = params.get("code") ?? ""
  const [code, setCode] = React.useState(initial)
  const [result, setResult] = React.useState<CertificateRecord | null>(
    initial ? findCertificateByVerification(initial) ?? null : null
  )
  const [searched, setSearched] = React.useState(Boolean(initial))

  function verify(event?: React.FormEvent) {
    event?.preventDefault()
    const found = findCertificateByVerification(code)
    setResult(found ?? null)
    setSearched(true)
    if (found) toast.success("Certificate verified")
    else toast.error("No matching issued certificate")
  }

  React.useEffect(() => {
    if (initial) {
      setCode(initial)
      setResult(findCertificateByVerification(initial) ?? null)
      setSearched(true)
    }
  }, [initial])

  return (
    <div className="relative min-h-svh overflow-hidden">
      <div className="absolute inset-0 mesh-panel opacity-95" />
      <div className="relative z-10 mx-auto flex min-h-svh max-w-3xl flex-col gap-8 px-6 py-10">
        <div className="flex items-center justify-between gap-4">
          <BrandMark to="/login" light />
          <Button asChild variant="secondary" size="sm">
            <Link to="/login">Sign in</Link>
          </Button>
        </div>

        <div className="story-enter rounded-2xl border border-white/20 bg-background/95 p-6 shadow-none backdrop-blur-md md:p-8">
          <p className="text-xs font-semibold tracking-[0.18em] text-primary uppercase">
            Public verification
          </p>
          <h1 className="mt-2 font-heading text-3xl font-semibold md:text-4xl">
            Verify an AAIIRI certificate
          </h1>
          <p className="mt-2 max-w-xl text-sm leading-relaxed text-muted-foreground">
            Enter the certificate number or verification code. No login
            required — for employers, investors, and buyers.
          </p>

          <form
            className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-end"
            onSubmit={verify}
          >
            <Field className="flex-1">
              <FieldLabel htmlFor="verify-code">
                Certificate / verification code
              </FieldLabel>
              <Input
                id="verify-code"
                value={code}
                onChange={(event) => setCode(event.target.value)}
                placeholder="e.g. VERIFY-CS-10482-KX9"
              />
            </Field>
            <Button type="submit" size="lg">
              Verify
            </Button>
          </form>

          <p className="mt-3 text-xs text-muted-foreground">
            Demo code that works:{" "}
            <button
              type="button"
              className="font-medium text-primary underline-offset-2 hover:underline"
              onClick={() => {
                setCode("VERIFY-CS-10482-KX9")
                setResult(findCertificateByVerification("VERIFY-CS-10482-KX9") ?? null)
                setSearched(true)
              }}
            >
              VERIFY-CS-10482-KX9
            </button>
          </p>

          {searched ? (
            <div className="mt-8 border-t border-foreground/10 pt-6">
              {result ? (
                <div className="space-y-4">
                  <div className="flex flex-wrap items-center gap-2">
                    <StatusLabel tone="success">Verified authentic</StatusLabel>
                    <StatusLabel tone="primary">{result.status}</StatusLabel>
                  </div>
                  <div className="rounded-xl border border-primary/20 bg-primary/5 p-5">
                    <p className="font-heading text-2xl font-semibold">
                      {result.recipientName}
                    </p>
                    <p className="mt-1 text-muted-foreground">
                      {result.businessName}
                    </p>
                    <p className="mt-4 text-sm">{result.programme}</p>
                    <dl className="mt-4 grid gap-2 text-sm sm:grid-cols-2">
                      <div>
                        <dt className="text-muted-foreground">Certificate No.</dt>
                        <dd className="font-medium">{result.code}</dd>
                      </div>
                      <div>
                        <dt className="text-muted-foreground">Verification</dt>
                        <dd className="font-medium">{result.verificationCode}</dd>
                      </div>
                      <div>
                        <dt className="text-muted-foreground">Issued</dt>
                        <dd className="font-medium">
                          {result.issuedAt} · {result.issuedBy}
                        </dd>
                      </div>
                      <div>
                        <dt className="text-muted-foreground">Cohort</dt>
                        <dd className="font-medium">{result.cohort}</dd>
                      </div>
                    </dl>
                  </div>
                </div>
              ) : (
                <div className="rounded-xl border border-destructive/20 bg-destructive/5 p-5">
                  <p className="font-heading text-xl font-semibold">
                    No certificate found
                  </p>
                  <p className="mt-2 text-sm text-muted-foreground">
                    Check the code for typos. Revoked or draft certificates
                    will not verify.
                  </p>
                </div>
              )}
            </div>
          ) : null}
        </div>
      </div>
    </div>
  )
}
