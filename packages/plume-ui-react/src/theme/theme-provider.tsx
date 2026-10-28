'use client'

import type { CSSProperties, ReactNode } from 'react'
import { useEffect, useMemo, useState } from 'react'
import { deepMerge } from '../utils/merge'
import { defaultDarkTheme, defaultTheme } from './config'
import type { DeepPartial, Theme } from './theme.types'
import type { ColorMode, ColorModeSetting, ThemeContextValue } from './theme-context'
import { ThemeContext } from './theme-context'
import { ThemeRootContext } from './theme-root'
import { getCssVarOverrides, getDefaultCssVars } from './default-css-vars'
import { themeToCssVars } from './theme-to-css-vars'

export { useTheme } from './theme-context'
export type { ColorMode, ColorModeSetting, ThemeContextValue } from './theme-context'

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
}: Readonly<ThemeProviderProps>): ReactNode {
  const lightTheme = useMemo(() => deepMerge<Theme>(defaultTheme, (theme ?? {}) as Theme), [theme])
  const resolvedDarkTheme = useMemo(
    () =>
      deepMerge<Theme>(
        deepMerge<Theme>(lightTheme, defaultDarkTheme as Theme),
        (darkTheme ?? {}) as Theme,
      ),
    [lightTheme, darkTheme],
  )

  const [setting, setSetting] = useState<ColorModeSetting>(defaultColorMode)
  const [root, setRoot] = useState<HTMLDivElement | null>(null)
  const [resolvedMode, setResolvedMode] = useState<ColorMode>(
    defaultColorMode === 'system' ? 'light' : defaultColorMode,
  )
  const colorMode = resolvedMode

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
  const cssVars = useMemo(
    () => getCssVarOverrides(themeToCssVars(activeTheme), getDefaultCssVars(colorMode)),
    [activeTheme, colorMode],
  )

  useEffect(() => {
    if (!applyToBody || typeof document === 'undefined') return
    const { documentElement: html, body } = document
    const prevMode = html.dataset.plumeColorMode
    const prevScheme = html.style.colorScheme
    const prevBackground = body.style.backgroundColor
    const prevColor = body.style.color
    html.dataset.plumeColorMode = colorMode
    html.style.colorScheme = colorMode
    body.style.backgroundColor = activeTheme.semantic.background
    body.style.color = activeTheme.semantic.foreground
    return () => {
      if (prevMode === undefined) delete html.dataset.plumeColorMode
      else html.dataset.plumeColorMode = prevMode
      html.style.colorScheme = prevScheme
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
        ref={setRoot}
        style={{
          ...(cssVars as CSSProperties),
          backgroundColor: 'var(--plume-background)',
          color: 'var(--plume-foreground)',
          colorScheme: colorMode,
          ...style,
        }}
      >
        <ThemeRootContext.Provider value={root}>{children}</ThemeRootContext.Provider>
      </div>
    </ThemeContext.Provider>
  )
}
