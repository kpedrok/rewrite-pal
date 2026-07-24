'use client'

import { useEffect } from 'react'

type ErrorPageProps = {
  error: Error & { digest?: string }
  reset: () => void
}

export default function ErrorPage({ error, reset }: ErrorPageProps) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <section
      aria-labelledby="error-heading"
      className="flex flex-1 flex-col items-center justify-center gap-4 py-16 text-center"
    >
      <h1 id="error-heading" className="text-3xl font-bold text-slate-900">
        Something went wrong
      </h1>
      <p className="max-w-md text-slate-600">
        Please try again. If the problem continues, contact{' '}
        <a className="underline" href="mailto:hello@rewritepal.com">
          hello@rewritepal.com
        </a>
        .
      </p>
      <button
        type="button"
        className="rounded-md bg-slate-900 px-4 py-2 font-medium text-white transition hover:bg-slate-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-900 focus-visible:ring-offset-2"
        onClick={reset}
      >
        Try again
      </button>
    </section>
  )
}
