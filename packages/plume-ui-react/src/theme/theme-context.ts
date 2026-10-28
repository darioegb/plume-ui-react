'use client'

import { createContext, useContext } from 'react'
import type { Theme } from './theme.types'

export type ColorMode = 'light' | 'dark'
export type ColorModeSetting = ColorMode | 'system'

export interface ThemeContextValue {
  theme: Theme
  colorMode: ColorMode
  setColorMode: (mode: ColorModeSetting) => void
}

export const ThemeContext = createContext<ThemeContextValue | null>(null)

export function useTheme(): ThemeContextValue {
  const context = useContext(ThemeContext)
  if (!context) {
    throw new Error('useTheme must be used within a <ThemeProvider>')
  }
  return context
}
