'use client'

import { Button } from '@rewritepal/components/ui/button'
import { useEffect } from 'react'

type ErrorPageProps = {
  error: Error & { digest?: string }
  reset: () => void
}

export default function ErrorPage({ error, reset }: ErrorPageProps) {
  useEffect(() => {
    console.error('app.render_failed', { digest: error.digest })
  }, [error.digest])

  return (
    <section
      aria-labelledby="error-heading"
      className="flex flex-1 flex-col items-center justify-center gap-4 py-16 text-center"
    >
      <h1 id="error-heading" className="text-3xl font-bold">
        Something went wrong
      </h1>
      <p className="max-w-md text-muted-foreground">
        Please try again. If the problem continues, contact{' '}
        <a className="underline" href="mailto:hello@rewritepal.com">
          hello@rewritepal.com
        </a>
        .
      </p>
      <Button type="button" onClick={reset}>
        Try again
      </Button>
    </section>
  )
}
