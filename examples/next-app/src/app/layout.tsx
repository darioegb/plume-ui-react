import type { ReactNode } from 'react'
import type { Metadata } from 'next'
import '@plume-ui-react/lib/styles.css'
import { Providers } from './providers'

export const metadata: Metadata = {
  title: 'Plume UI React — Next App Router',
  description: 'SSR/RSC-safe consumption example for @plume-ui-react, deployed on Vercel.',
}

export default function RootLayout({ children }: { children: ReactNode }): ReactNode {
  return (
    <html lang="en">
      <body style={{ margin: 0, fontFamily: 'system-ui, sans-serif' }}>
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
