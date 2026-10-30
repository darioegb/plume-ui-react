'use client'

import type { ReactNode } from 'react'
import { createContext, useContext, useMemo, useState } from 'react'
import { ThemeProvider, ToastProvider, type ColorModeSetting } from 'plume-ui-react'
import { themeFor, type BrandId } from '@/theme'
import { PlumeLocale } from '@/components/plume-locale'

interface PreferencesContextValue {
  brand: BrandId
  colorModeSetting: ColorModeSetting
  setBrand: (brand: BrandId) => void
  setColorModeSetting: (setting: ColorModeSetting) => void
}

const PreferencesContext = createContext<PreferencesContextValue | null>(null)

// The saved choices; `useTheme()` only has the resolved mode, never `system`.
export function usePreferences(): PreferencesContextValue {
  const context = useContext(PreferencesContext)
  if (!context) throw new Error('usePreferences must be used within <Providers>')
  return context
}

export function Providers({
  brand: initialBrand,
  children,
  colorMode,
}: Readonly<{ brand: BrandId; children: ReactNode; colorMode: ColorModeSetting }>): ReactNode {
  const [brand, setBrand] = useState(initialBrand)
  const [colorModeSetting, setColorModeSetting] = useState(colorMode)
  const theme = useMemo(() => themeFor(brand), [brand])
  const value = useMemo(
    () => ({ brand, colorModeSetting, setBrand, setColorModeSetting }),
    [brand, colorModeSetting],
  )

  return (
    <PreferencesContext.Provider value={value}>
      <ThemeProvider defaultColorMode={colorMode} style={{ minHeight: '100vh' }} theme={theme}>
        <PlumeLocale>
          <ToastProvider>{children}</ToastProvider>
        </PlumeLocale>
      </ThemeProvider>
    </PreferencesContext.Provider>
  )
}
