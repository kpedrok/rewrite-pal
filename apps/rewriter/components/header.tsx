'use client'

import { List } from '@phosphor-icons/react/dist/ssr'
import { RewritePalLogo } from '@repo/ui/components/rewritepal/logo'
import { Button } from '@repo/ui/components/ui/button'
import { Sheet, SheetContent, SheetTrigger } from '@repo/ui/components/ui/sheet'
import Link from 'next/link'
import { NavItem } from './nav-item'

export default function Header() {
  return (
    <header className='flex justify-between items-center w-full mt-5 border-b-2 pb-7 sm:px-4 px-2'>
      <Link href='/' className='flex space-x-3 items-center'>
        <RewritePalLogo className='w-[42px]' />
        <h1 className='sm:text-3xl hover:underline text-2xl font-bold ml-2 tracking-tight leading-tight'>RewritePal</h1>
      </Link>
      <div className='hidden gap-3 md:flex'>
        <NavItem href='/'>Paraphraser</NavItem>
        <NavItem href='/impersonator'>Impersonator</NavItem>

        <NavItem href='/download?product=desktop'>Desktop App</NavItem>
        <NavItem href='/download?product=browser'>Browser Extension</NavItem>
        <NavItem target='_blank' href='https://editor.rewritepal.com'>
          AI Text Editor (beta)
        </NavItem>
      </div>
      <Sheet>
        <SheetTrigger asChild>
          <Button className='rounded-full' size='icon' variant='outline'>
            <List className='h-6 w-6' size={32} />
            <span className='sr-only'>Toggle navigation menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent side='right'>
          <div className='grid gap-4 p-4'>
            <NavItem href='/'>Paraphraser</NavItem>

            <NavItem href='/download?product=desktop'>Desktop App</NavItem>
            <NavItem href='/download?product=browser'>Browser Extension</NavItem>
            <NavItem target='_blank' href='https://editor.rewritepal.com'>
              AI Text Editor (beta)
            </NavItem>
            <NavItem href='/blog'>Blog</NavItem>

            <NavItem target='_blank' href='https://roadmap.rewritepal.com'>
              Roadmap
            </NavItem>

            <NavItem href='mailto:hello@rewritepal.com' target='_blank'>
              hello@rewritepal.com
            </NavItem>
          </div>
        </SheetContent>
      </Sheet>
    </header>
  )
}
