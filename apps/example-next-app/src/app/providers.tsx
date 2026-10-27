'use client'

import type { ReactNode } from 'react'
import { createContext, useContext, useMemo, useState } from 'react'
import { ThemeProvider, ToastProvider } from 'plume-ui-react'
import { themeFor, type BrandId } from '@/theme'

interface BrandContextValue {
  brand: BrandId
  setBrand: (brand: BrandId) => void
}

const BrandContext = createContext<BrandContextValue | null>(null)

export function useBrand(): BrandContextValue {
  const context = useContext(BrandContext)
  if (!context) throw new Error('useBrand must be used within <Providers>')
  return context
}

export function Providers({
  brand: initialBrand,
  children,
  colorMode,
}: Readonly<{ brand: BrandId; children: ReactNode; colorMode: 'light' | 'dark' }>): ReactNode {
  const [brand, setBrand] = useState(initialBrand)
  const theme = useMemo(() => themeFor(brand), [brand])
  const value = useMemo(() => ({ brand, setBrand }), [brand])

  return (
    <BrandContext.Provider value={value}>
      <ThemeProvider defaultColorMode={colorMode} style={{ minHeight: '100vh' }} theme={theme}>
        <ToastProvider>{children}</ToastProvider>
      </ThemeProvider>
    </BrandContext.Provider>
  )
}
