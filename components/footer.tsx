import {
  Envelope,
  GithubLogo,
  TwitterLogo,
} from '@phosphor-icons/react/dist/ssr'
import Link from 'next/link'

const IconLink = ({
  href,
  label,
  children,
}: {
  href: string
  label: string
  children: React.ReactNode
}) => (
  <Link
    href={href}
    target="_blank"
    className="group rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
    aria-label={label}
  >
    {children}
  </Link>
)

type FooterIconProps = {
  Icon: typeof Envelope
  label: string
  href: string
}

const FooterIcon = ({ Icon, label, href }: FooterIconProps) => (
  <IconLink href={href} label={label}>
    <Icon
      weight="bold"
      aria-hidden="true"
      className="size-6 fill-muted-foreground transition-colors group-hover:fill-foreground"
    />
  </IconLink>
)
export default function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="mt-5 mb-3 flex min-h-16 w-full flex-col items-center justify-between gap-3 border-t px-3 pt-4 text-center sm:mb-0 sm:min-h-20 sm:flex-row sm:pt-2">
      <div>
        Share your feedback with me at{' '}
        <a
          href="mailto:hello@rewritepal.com"
          target="_blank"
          className="font-bold hover:underline transition underline-offset-2"
          rel="noopener"
        >
          hello@rewritepal.com
        </a>
      </div>
      <div className="flex items-center gap-4 pb-4 sm:pb-0">
        <FooterIcon
          Icon={Envelope}
          label="Rewrite Pal Email"
          href="mailto:hello@rewritepal.com"
        />
        <FooterIcon
          Icon={TwitterLogo}
          label="Rewrite Pal on Twitter"
          href="https://twitter.com/CreatedByPed"
        />
        <FooterIcon
          Icon={GithubLogo}
          label="Rewrite Pal on GitHub"
          href="https://github.com/kpedrok/rewrite-pal"
        />
        <p className="text-muted-foreground">
          © {currentYear} RewritePal, Inc.
        </p>
      </div>
    </footer>
  )
}
