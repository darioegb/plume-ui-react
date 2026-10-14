'use client'

import type { ReactNode } from 'react'
import { ThemeProvider } from '@plume-ui-react/core'

export function Providers({ children }: { children: ReactNode }): ReactNode {
  return <ThemeProvider defaultColorMode="light">{children}</ThemeProvider>
}
