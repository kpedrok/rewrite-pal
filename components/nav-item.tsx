'use client'

import { cn } from '@rewritepal/lib/utils'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

type NavItemProps = React.ComponentProps<typeof Link>

export function NavItem({
  href,
  className = '',
  children,
  ...props
}: NavItemProps) {
  const pathname = usePathname()

  const linkClasses = cn(
    className,
    'flex items-center justify-center gap-2 rounded-md px-4 py-2 text-sm text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground',
    { 'font-semibold text-foreground': pathname === href },
  )

  return (
    <Link
      aria-current={pathname === href ? 'page' : undefined}
      href={href}
      {...props}
      className={linkClasses}
    >
      {children}
    </Link>
  )
}
