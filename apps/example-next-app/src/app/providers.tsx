'use client'

import type { ReactNode } from 'react'
import { ThemeProvider, ToastProvider } from 'plume-ui-react'
import { theme } from '@/theme'

export function Providers({
  children,
  colorMode,
}: Readonly<{ children: ReactNode; colorMode: 'light' | 'dark' }>): ReactNode {
  return (
    <ThemeProvider defaultColorMode={colorMode} style={{ minHeight: '100vh' }} theme={theme}>
      <ToastProvider>{children}</ToastProvider>
    </ThemeProvider>
  )
}
