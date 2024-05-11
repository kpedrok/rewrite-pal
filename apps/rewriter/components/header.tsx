import { RewritePalLogo } from '@repo/ui/logo'
import { NavbarButton } from '@repo/ui/navbar-button'

import Link from 'next/link'

export default function Header() {
  return (
    <header className='flex justify-between items-center w-full mt-5 border-b-2 pb-7 sm:px-4 px-2'>
      <Link href='/' className='flex space-x-3 items-center'>
        <RewritePalLogo className='w-[42px]' />
        <h1 className='sm:text-3xl hover:underline text-2xl font-bold ml-2 tracking-tight leading-tight'>RewritePal</h1>
      </Link>
      <div className='flex gap-3'>
        <Link href='https://www.rewritepal.com/' className='hidden md:flex'>
          <NavbarButton>Rewriter</NavbarButton>
        </Link>
        <Link href='/blog' className='hidden md:flex'>
          <NavbarButton>Blog</NavbarButton>
        </Link>

        <Link
          className='flex max-w-fit items-center justify-center space-x-2 rounded-full border border-gray-300 bg-white px-4 py-2 text-sm text-gray-600 shadow-md transition-colors hover:bg-gray-100'
          href='https://roadmap.rewritepal.com'
          target='_blank'
          rel='noopener noreferrer'>
          <span className='text-lg'>💡</span>
          <p>Roadmap</p>
        </Link>
      </div>
    </header>
  )
}
