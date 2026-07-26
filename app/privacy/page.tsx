import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Privacy',
  description: 'How RewritePal processes text and prevents abuse.',
}

export default function PrivacyPage() {
  return (
    <article className="mx-auto w-full max-w-3xl py-12">
      <h1 className="text-4xl font-bold">Privacy</h1>
      <p className="mt-4 text-muted-foreground">Last updated July 25, 2026.</p>

      <section className="mt-8 space-y-3">
        <h2 className="text-2xl font-semibold">Text processing</h2>
        <p>
          RewritePal sends the text and options you submit to OpenAI to generate
          a rewrite. RewritePal does not intentionally write submitted text or
          generated output to its application database or application logs.
          OpenAI and the hosting infrastructure may process requests under their
          own policies.
        </p>
        <p>
          Do not submit confidential, regulated, or otherwise sensitive
          information unless those provider policies meet your requirements.
        </p>
      </section>

      <section className="mt-8 space-y-3">
        <h2 className="text-2xl font-semibold">Abuse prevention</h2>
        <p>
          The hosting platform supplies a network address for rate limiting.
          Before RewritePal uses that value with Upstash Redis, the application
          replaces it with a keyed one-way digest. The raw address is not placed
          in the application&apos;s rate-limit key.
        </p>
      </section>

      <section className="mt-8 space-y-3">
        <h2 className="text-2xl font-semibold">Other data</h2>
        <p>
          RewritePal stores an aggregate count of completed rewrites. That count
          does not contain submitted text or identify individual users. Your
          theme choice is stored locally in your browser.
        </p>
      </section>

      <section className="mt-8 space-y-3">
        <h2 className="text-2xl font-semibold">Contact</h2>
        <p>
          Questions about this notice can be sent to{' '}
          <a
            className="font-medium underline underline-offset-2"
            href="mailto:hello@rewritepal.com"
          >
            hello@rewritepal.com
          </a>
          .
        </p>
      </section>
    </article>
  )
}
