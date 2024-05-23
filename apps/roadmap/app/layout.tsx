import { GeistSans } from 'geist/font/sans'
import React from 'react'
import './globals.css'

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang='en' className={GeistSans.variable}>
      <body>{children}</body>
    </html>
  )
}
