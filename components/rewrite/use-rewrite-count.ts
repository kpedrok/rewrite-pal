'use client'

import { useCallback, useEffect, useState } from 'react'

export function useRewriteCount() {
  const [count, setCount] = useState<number | null>(null)

  useEffect(() => {
    async function loadCount() {
      try {
        const response = await fetch('/api/rewrite-count')
        const nextCount: unknown = await response.json()

        if (response.ok && typeof nextCount === 'number') {
          setCount(nextCount)
        }
      } catch {
        // The aggregate count is non-critical to the rewrite experience.
      }
    }

    void loadCount()
  }, [])

  const recordCompletedRewrite = useCallback(() => {
    setCount((current) => (current === null ? null : current + 1))
  }, [])

  return { count, recordCompletedRewrite }
}
