'use client'

import { List } from '@phosphor-icons/react/dist/ssr'
import Image from 'next/image'
import { Button } from './ui/button'
import { NavItem } from './ui/nav-item'

import { Sheet, SheetContent, SheetTrigger } from './ui/sheet'

const navLinks = [
  { href: '/', label: 'Paraphraser' },
  { href: 'https://github.com/kpedrok/rewrite-pal', label: 'Open Source', external: true },
  { href: 'mailto:hello@rewritepal.com', label: 'hello@rewritepal.com', external: true },
]

const NavigationLinks = ({ className }: { className: string }) => (
  <div className={className}>
    {navLinks.slice(0, 5).map(({ href, label, external }) => (
      <NavItem key={href} href={href} target={external ? '_blank' : undefined}>
        {label}
      </NavItem>
    ))}
  </div>
)

const MobileMenu = () => (
  <Sheet>
    <SheetTrigger asChild>
      <Button className='rounded-full' size='icon' variant='outline'>
        <List className='h-6 w-6' size={32} />
        <span className='sr-only'>Toggle navigation menu</span>
      </Button>
    </SheetTrigger>
    <SheetContent side='right'>
      <div className='grid gap-4 p-4'>
        {navLinks.map(({ href, label, external }) => (
          <NavItem key={href} href={href} target={external ? '_blank' : undefined}>
            {label}
          </NavItem>
        ))}
      </div>
    </SheetContent>
  </Sheet>
)

export function Header() {
  return (
    <header className='flex justify-between items-center w-full border-b-2 p-2'>
      <a href='/' className='flex items-center'>
        <Image
          className='w-[42px]'
          width={42}
          height={42}
          src='/images/logos/rewritepal.svg'
          alt={'Rewrite Pal Logo'}
        />
        <h1 className='sm:text-3xl hover:underline text-2xl font-bold ml-2 tracking-tight leading-tight'>RewritePal</h1>
      </a>

      <NavigationLinks className='hidden gap-3 lg:flex' />

      <MobileMenu />
    </header>
  )
}
