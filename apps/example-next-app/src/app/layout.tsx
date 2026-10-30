import type { ReactNode } from 'react'
import type { Metadata } from 'next'
import { NextIntlClientProvider } from 'next-intl'
import { getLocale, getTranslations } from 'next-intl/server'
import 'plume-ui-react/styles.css'
import { getBrand, getColorMode } from '@/lib/session'
import { Providers } from './providers'

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations('app')
  return {
    title: { default: t('name'), template: `%s · ${t('name')}` },
    description: t('description'),
  }
}

export default async function RootLayout({
  children,
}: Readonly<{ children: ReactNode }>): Promise<ReactNode> {
  // The mode and the brand come from cookies, so the server renders the right theme with no flash.
  const [colorMode, brand, locale] = await Promise.all([getColorMode(), getBrand(), getLocale()])
  return (
    <html lang={locale}>
      <body style={{ margin: 0, fontFamily: 'system-ui, sans-serif' }}>
        <NextIntlClientProvider>
          <Providers brand={brand} colorMode={colorMode}>{children}</Providers>
        </NextIntlClientProvider>
      </body>
    </html>
  )
}
