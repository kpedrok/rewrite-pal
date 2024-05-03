import { GeistSans } from 'geist/font/sans'
import { ReactNode } from 'react'
import './globals.css'

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang='en' className={GeistSans.variable}>
      <body>{children}</body>
    </html>
  )
}
