'use client'

import { List } from '@phosphor-icons/react/dist/ssr'
import Image from 'next/image'
import Link from 'next/link'
import { ModeToggle } from './mode-toggle'
import { NavItem } from './nav-item'
import { Button } from './ui/button'

import { Sheet, SheetContent, SheetTitle, SheetTrigger } from './ui/sheet'

const navLinks = [
  { href: '/', label: 'Paraphraser' },
  {
    href: 'https://github.com/kpedrok/rewrite-pal',
    label: 'Open Source',
    newTab: true,
  },
  {
    href: 'mailto:hello@rewritepal.com',
    label: 'hello@rewritepal.com',
  },
]

const NavigationLinks = ({ className }: { className: string }) => (
  <nav aria-label="Primary" className={className}>
    {navLinks.map(({ href, label, newTab }) => (
      <NavItem
        key={href}
        href={href}
        rel={newTab ? 'noopener noreferrer' : undefined}
        target={newTab ? '_blank' : undefined}
      >
        {label}
      </NavItem>
    ))}
  </nav>
)

const MobileMenu = () => (
  <div className="lg:hidden">
    <Sheet>
      <SheetTrigger asChild>
        <Button
          aria-label="Toggle navigation menu"
          className="rounded-full"
          size="icon"
          variant="outline"
        >
          <List aria-hidden="true" />
        </Button>
      </SheetTrigger>
      <SheetContent side="right">
        <SheetTitle className="sr-only">Navigation</SheetTitle>
        <nav aria-label="Mobile" className="grid gap-4 p-4">
          {navLinks.map(({ href, label, newTab }) => (
            <NavItem
              key={href}
              href={href}
              rel={newTab ? 'noopener noreferrer' : undefined}
              target={newTab ? '_blank' : undefined}
            >
              {label}
            </NavItem>
          ))}
        </nav>
      </SheetContent>
    </Sheet>
  </div>
)

export function Header() {
  return (
    <header className="flex w-full items-center justify-between border-b-2 p-2">
      <Link href="/" className="flex items-center gap-2">
        <Image
          className="size-[42px] dark:invert"
          width={42}
          height={42}
          src="/images/logos/rewritepal.svg"
          alt=""
        />
        <span className="text-2xl font-bold leading-tight tracking-tight hover:underline sm:text-3xl">
          RewritePal
        </span>
      </Link>

      <div className="flex items-center gap-2">
        <NavigationLinks className="hidden gap-3 lg:flex" />
        <ModeToggle />
        <MobileMenu />
      </div>
    </header>
  )
}
