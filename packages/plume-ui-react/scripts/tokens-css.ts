import { defaultTheme } from '../src/theme/config'
import { getCssVarOverrides, getDefaultCssVars } from '../src/theme/default-css-vars'

const declarations = (vars: Record<string, string>): string =>
  Object.entries(vars)
    .map(([name, value]) => `${name}:${value}`)
    .join(';')

/**
 * The default theme as CSS: the light values on `:root`, and what changes in dark mode on
 * `[data-plume-color-mode='dark']`, so the components work without a `<ThemeProvider>`. With
 * `prefers-reduced-motion: reduce` the durations are 0, `!important` so a theme that sets its own
 * durations does not bring the motion back.
 */
export function buildTokensCss(): string {
  const light = getDefaultCssVars('light')
  const dark = getCssVarOverrides(getDefaultCssVars('dark'), light)
  const still = declarations(
    Object.fromEntries(
      Object.keys(defaultTheme.motion.durations).map((name) => [
        `--plume-duration-${name}`,
        '0s!important',
      ]),
    ),
  )
  return `:root,[data-plume-color-mode='light']{${declarations(light)}}[data-plume-color-mode='dark']{${declarations(dark)}}@media(prefers-reduced-motion:reduce){:root,[data-plume-color-mode]{${still}}}`
}
