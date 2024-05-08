import type { ReactNode } from 'react'

export function NavbarButton({ children }: { children: ReactNode }, className?: string) {
  return (
    <button
      className={`max-w-fit h-full items-center justify-center space-x-2 px-4 py-2 text-sm text-gray-600 transition-colors hover:bg-gray-100 rounded-md  ${className || ''}`}>
      {children}
    </button>
  )
}
