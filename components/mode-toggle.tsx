'use client'

import { Button } from '@rewritepal/components/ui/button'
import { MoonIcon, SunIcon } from 'lucide-react'
import { useTheme } from 'next-themes'
import { useEffect, useState } from 'react'

function ThemeIcons() {
  return (
    <>
      <SunIcon
        aria-hidden="true"
        className="rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0"
      />
      <MoonIcon
        aria-hidden="true"
        className="absolute rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100"
      />
    </>
  )
}

export function ModeToggle() {
  const [mounted, setMounted] = useState(false)
  const { resolvedTheme, setTheme } = useTheme()
  const isDark = resolvedTheme === 'dark'
  const nextTheme = isDark ? 'light' : 'dark'

  useEffect(() => setMounted(true), [])

  if (!mounted) {
    return (
      <Button
        aria-label="Dark mode"
        aria-pressed="false"
        className="relative"
        disabled
        size="icon"
        type="button"
        variant="outline"
      >
        <ThemeIcons />
      </Button>
    )
  }

  return (
    <Button
      aria-label="Dark mode"
      aria-pressed={isDark}
      className="relative"
      onClick={() => setTheme(nextTheme)}
      size="icon"
      title={`Switch to ${nextTheme} mode`}
      type="button"
      variant="outline"
    >
      <ThemeIcons />
    </Button>
  )
}
