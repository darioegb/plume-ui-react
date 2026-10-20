'use client'

import type { ReactNode } from 'react'
import { ThemeProvider, ToastProvider } from 'plume-ui-react'
import { theme } from '@/theme'

export function Providers({ children }: { children: ReactNode }): ReactNode {
  return (
    <ThemeProvider defaultColorMode="light" theme={theme}>
      <ToastProvider>{children}</ToastProvider>
    </ThemeProvider>
  )
}
