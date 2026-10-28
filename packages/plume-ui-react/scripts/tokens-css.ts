import { getCssVarOverrides, getDefaultCssVars } from '../src/theme/default-css-vars'

const declarations = (vars: Record<string, string>): string =>
  Object.entries(vars)
    .map(([name, value]) => `${name}:${value}`)
    .join(';')

/**
 * The default theme as CSS: the light values on `:root`, and what changes in dark mode on
 * `[data-plume-color-mode='dark']`, so the components work without a `<ThemeProvider>`.
 */
export function buildTokensCss(): string {
  const light = getDefaultCssVars('light')
  const dark = getCssVarOverrides(getDefaultCssVars('dark'), light)
  return `:root,[data-plume-color-mode='light']{${declarations(light)}}[data-plume-color-mode='dark']{${declarations(dark)}}`
}
