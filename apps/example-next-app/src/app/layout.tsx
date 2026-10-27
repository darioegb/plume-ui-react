import type { ReactNode } from 'react'
import type { Metadata } from 'next'
import 'plume-ui-react/styles.css'
import { getColorMode } from '@/lib/session'
import { Providers } from './providers'

export const metadata: Metadata = {
  title: { default: 'Plume Projects', template: '%s · Plume Projects' },
  description: 'A project dashboard built with plume-ui-react on the Next.js App Router.',
}

export default async function RootLayout({
  children,
}: Readonly<{ children: ReactNode }>): Promise<ReactNode> {
  // The mode comes from a cookie, so the server renders the right theme with no flash.
  const colorMode = await getColorMode()
  return (
    <html lang="en">
      <body style={{ margin: 0, fontFamily: 'system-ui, sans-serif' }}>
        <Providers colorMode={colorMode}>{children}</Providers>
      </body>
    </html>
  )
}
