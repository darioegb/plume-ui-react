'use client'

import type { CSSProperties, ReactNode } from 'react'
import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { deepMerge } from '@plume-ui-react/merge-utils'
import { defaultDarkTheme, defaultTheme } from './config'
import type { DeepPartial, Theme } from './theme.types'
import { themeToCssVars } from './theme-to-css-vars'

export type ColorMode = 'light' | 'dark'
export type ColorModeSetting = ColorMode | 'system'

export interface ThemeContextValue {
  theme: Theme
  colorMode: ColorMode
  setColorMode: (mode: ColorModeSetting) => void
}

const ThemeContext = createContext<ThemeContextValue | null>(null)

export function useTheme(): ThemeContextValue {
  const context = useContext(ThemeContext)
  if (!context) {
    throw new Error('useTheme must be used within a <ThemeProvider>')
  }
  return context
}

export interface ThemeProviderProps {
  children: ReactNode
  theme?: DeepPartial<Theme>
  darkTheme?: DeepPartial<Theme>
  defaultColorMode?: ColorModeSetting
  /** Theme document.body and set data-plume-color-mode on <html> for full-page theming. Default true; set false for nested providers. */
  applyToBody?: boolean
  className?: string
  style?: CSSProperties
}

export function ThemeProvider({
  children,
  theme,
  darkTheme,
  defaultColorMode = 'light',
  applyToBody = true,
  className = '',
  style,
}: ThemeProviderProps): ReactNode {
  const lightTheme = useMemo(
    () => deepMerge<Theme>(defaultTheme, (theme ?? {}) as Theme),
    [theme],
  )
  const resolvedDarkTheme = useMemo(
    () =>
      deepMerge<Theme>(
        deepMerge<Theme>(lightTheme, defaultDarkTheme as Theme),
        (darkTheme ?? {}) as Theme,
      ),
    [lightTheme, darkTheme],
  )

  const [setting, setSetting] = useState<ColorModeSetting>(defaultColorMode)
  const [colorMode, setResolvedMode] = useState<ColorMode>(
    defaultColorMode === 'system' ? 'light' : defaultColorMode,
  )

  // 'system' is resolved on the client to keep server render deterministic.
  useEffect(() => {
    if (setting !== 'system') {
      setResolvedMode(setting)
      return
    }
    const query = window.matchMedia('(prefers-color-scheme: dark)')
    const sync = (): void => setResolvedMode(query.matches ? 'dark' : 'light')
    sync()
    query.addEventListener('change', sync)
    return () => query.removeEventListener('change', sync)
  }, [setting])

  const activeTheme = colorMode === 'dark' ? resolvedDarkTheme : lightTheme
  const cssVars = useMemo(() => themeToCssVars(activeTheme), [activeTheme])

  useEffect(() => {
    if (!applyToBody || typeof document === 'undefined') return
    const { documentElement: html, body } = document
    const prevMode = html.getAttribute('data-plume-color-mode')
    const prevBackground = body.style.backgroundColor
    const prevColor = body.style.color
    html.setAttribute('data-plume-color-mode', colorMode)
    body.style.backgroundColor = activeTheme.semantic.background
    body.style.color = activeTheme.semantic.foreground
    return () => {
      if (prevMode === null) html.removeAttribute('data-plume-color-mode')
      else html.setAttribute('data-plume-color-mode', prevMode)
      body.style.backgroundColor = prevBackground
      body.style.color = prevColor
    }
  }, [applyToBody, colorMode, activeTheme])

  const value = useMemo<ThemeContextValue>(
    () => ({ theme: activeTheme, colorMode, setColorMode: setSetting }),
    [activeTheme, colorMode],
  )

  return (
    <ThemeContext.Provider value={value}>
      <div
        className={`plume-root ${className}`.trim()}
        data-plume-color-mode={colorMode}
        style={{
          ...(cssVars as CSSProperties),
          backgroundColor: 'var(--plume-background)',
          color: 'var(--plume-foreground)',
          ...style,
        }}
      >
        {children}
      </div>
    </ThemeContext.Provider>
  )
}
