import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '../lib/utils'

interface NavItemProps {
  href: string
  className?: string
  children: React.ReactNode
  [key: string]: any
}

export function NavItem({ href, className = '', children, ...props }: NavItemProps) {
  const pathname = usePathname()

  const linkClasses = cn(
    className,
    'flex items-center justify-center space-x-2 px-4 py-2 text-sm text-gray-600 transition-colors hover:bg-gray-100 rounded-md',
    { 'text-gray-900': pathname === href }
  )

  return (
    <Link href={href} {...props} className={linkClasses}>
      {children}
    </Link>
  )
}
