'use client'

import { Button } from '@rewritepal/components/ui/button'
import type { RefObject } from 'react'
import toast from 'react-hot-toast'

type RewriteResultProps = {
  completion: string
  headingRef: RefObject<HTMLHeadingElement | null>
  isStreaming: boolean
}

export function RewriteResult({
  completion,
  headingRef,
  isStreaming,
}: RewriteResultProps) {
  if (!completion) {
    return null
  }

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(completion)
      toast.success('Copied to clipboard.')
    } catch {
      toast.error('Unable to copy the rewritten text.')
    }
  }

  return (
    <section
      aria-busy={isStreaming}
      aria-labelledby="rewritten-text-heading"
      className="mt-5"
    >
      <h2
        ref={headingRef}
        id="rewritten-text-heading"
        className="mx-auto mb-4 text-3xl font-bold sm:text-xl"
        tabIndex={-1}
      >
        Rewritten text
      </h2>
      <div className="rounded-xl border bg-card p-4 text-left text-card-foreground shadow-2xl">
        <p data-testid="rewrite-output" className="whitespace-pre-wrap">
          {completion}
        </p>
        <Button
          aria-label="Copy rewritten text"
          className="mt-4"
          disabled={isStreaming}
          onClick={handleCopy}
          type="button"
          variant="outline"
        >
          Copy
        </Button>
      </div>
    </section>
  )
}
