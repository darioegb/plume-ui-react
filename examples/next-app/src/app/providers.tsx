'use client'

import type { ReactNode } from 'react'
import { ThemeProvider } from '@plume-ui-react/lib'
import { theme } from '@/theme'

export function Providers({ children }: { children: ReactNode }): ReactNode {
  return <ThemeProvider defaultColorMode="light" theme={theme}>{children}</ThemeProvider>
}
