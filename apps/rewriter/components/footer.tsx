import { Envelope, TwitterLogo } from '@phosphor-icons/react/dist/ssr'
import Link from 'next/link'

export default function Footer() {
  return (
    <footer className='text-center h-16 sm:h-20 w-full sm:pt-2 pt-4 border-t mt-5 flex sm:flex-row flex-col justify-between items-center px-3 space-y-3 sm:mb-0 mb-3'>
      <div>
        Share your feedback with me at{' '}
        <a
          href='mailto:hello@rewritepal.com'
          target='_blank'
          className='font-bold hover:underline transition underline-offset-2'>
          hello@rewritepal.com{' '}
        </a>
        {/* and{' '}
        <a
          href='https://vercel.com/'
          target='_blank'
          className='font-bold hover:underline transition underline-offset-2'>
          Vercel
        </a> */}
      </div>
      <div className='flex space-x-4 pb-4 sm:pb-0'>
        {/* <Link
          href='https://github.com/kpedrok/rewrite-pal'
          className='group'
          target='_blank'
          aria-label='Rewrite Pal on GitHub'>
          <GithubLogo weight='bold' aria-hidden='true' className='h-6 w-6 fill-slate-500 group-hover:fill-slate-700' />
        </Link> */}
        <Link href='mailto:hello@rewritepal.com' target='_blank' className='group' aria-label='Rewrite Pal Email'>
          <Envelope weight='bold' aria-hidden='true' className='h-6 w-6 fill-slate-500 group-hover:fill-slate-700' />
        </Link>
        <Link
          href='https://twitter.com/CreatedByPed'
          className='group'
          target='_blank'
          aria-label='Rewrite Pal on Twitter'>
          <TwitterLogo weight='bold' aria-hidden='true' className='h-6 w-6 fill-slate-500 group-hover:fill-slate-700' />
        </Link>
        {/* <Link href='mailto:hello@rewritepal.com' target='_blank' className='group' aria-label='Rewrite AI Email'>
          hello@rewritepal.com
        </Link> */}
      </div>
    </footer>
  )
}
