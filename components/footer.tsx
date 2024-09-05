import { Envelope, GithubLogo, TwitterLogo } from '@phosphor-icons/react/dist/ssr'
import Link from 'next/link'

const IconLink = ({ href, label, children }: { href: string; label: string; children: React.ReactNode }) => (
  <Link href={href} target='_blank' className='group' aria-label={label}>
    {children}
  </Link>
)

const FooterIcon = ({ Icon, label, href }: { Icon: React.ComponentType<any>; label: string; href: string }) => (
  <IconLink href={href} label={label}>
    <Icon weight='bold' aria-hidden='true' className='h-6 w-6 fill-slate-500 group-hover:fill-slate-700' />
  </IconLink>
)
export default function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className='text-center h-16 sm:h-20 w-full sm:pt-2 pt-4 border-t mt-5 flex sm:flex-row flex-col justify-between items-center px-3 space-y-3 sm:mb-0 mb-3'>
      <div>
        Share your feedback with me at{' '}
        <a
          href='mailto:hello@rewritepal.com'
          target='_blank'
          className='font-bold hover:underline transition underline-offset-2'>
          hello@rewritepal.com
        </a>
      </div>
      <div className='flex space-x-4 pb-4 sm:pb-0'>
        <FooterIcon Icon={Envelope} label='Rewrite Pal Email' href='mailto:hello@rewritepal.com' />
        <FooterIcon Icon={TwitterLogo} label='Rewrite Pal on Twitter' href='https://twitter.com/CreatedByPed' />
        <FooterIcon Icon={GithubLogo} label='Rewrite Pal on GitHub' href='https://github.com/kpedrok/rewrite-pal' />
        <p className='text-slate-500'>© {currentYear} RewritePal, Inc.</p>
      </div>
    </footer>
  )
}
