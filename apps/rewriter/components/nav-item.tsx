'use client'

import clsx from 'clsx'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

export function NavItem({ href, children }: { href: string; children: React.ReactNode }) {
  const pathname = usePathname()

  return (
    <Link
      href={href}
      className={clsx(
        'items-center justify-center space-x-2 px-4 py-2 text-sm text-gray-600 transition-colors hover:bg-gray-100 rounded-md hidden md:flex',
        {
          'bg-gray-100': pathname === href,
        }
      )}>
      {children}
    </Link>
  )
}
