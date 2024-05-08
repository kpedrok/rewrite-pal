import '@/styles/globals.css'
import '@/styles/prosemirror.css'

import type { Metadata, Viewport } from 'next'
import type { ReactNode } from 'react'
import Providers from './providers'

export const metadata: Metadata = {
  title: {
    default: 'RewritePal | Write Better, Communicate Better, Deliver More',
    template: '%s | RewritePal',
  },
  description: `Your Free AI Writing Tool. Paraphrasing tool, improve any paragraph's readability and rewrite it to make it sound more human-like with this powerful free tool.`,
  keywords: [
    'paraphrasing',
    'rewrite',
    'grammar checker',
    'AI writing assistant',
    'proofreading tool',
    'writing tool',
    'grammar tool',
    'free writing assistant',
    'language improvement',
    'online editor',
    'spelling check',
    'punctuation checker',
  ],
  robots: 'index, follow',
}

// const title = 'Novel - Notion-style WYSIWYG editor with AI-powered autocompletions'
// const description =
//   'Novel is a Notion-style WYSIWYG editor with AI-powered autocompletions. Built with Tiptap, OpenAI, and Vercel AI SDK.'

// export const metadata: Metadata = {
//   title,
//   description,
//   openGraph: {
//     title,
//     description,
//   },
//   twitter: {
//     title,
//     description,
//     card: "summary_large_image",
//     creator: "@steventey",
//   },
//   metadataBase: new URL("https://novel.sh"),
// };

export const viewport: Viewport = {
  themeColor: '#ffffff',
}

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang='en' suppressHydrationWarning>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
