import { getContrastColor, getContrastRatio, getDarkenColor } from '@plume-ui-react/color-utils'
import type { Theme } from './theme.types'

const PREFIX = '--plume'

type TokenRecord = Record<string, string | number>

const WHITE = '#ffffff'
const BLACK = '#000000'
const AA_NORMAL_TEXT = 4.5

/**
 * Picks an accessible solid fill (background + text) for a color ramp so filled
 * surfaces such as solid buttons meet WCAG AA (4.5:1) for normal text.
 * Prefers white text on the lightest shade that passes; falls back to dark text
 * on the base shade for light hues (e.g. warning) so the brand color is kept.
 */
function pickSolidPair(shades: TokenRecord): { bg: string; fg: string } {
  for (const key of ['500', '600', '700']) {
    const color = String(shades[key])
    if (getContrastRatio(WHITE, color) >= AA_NORMAL_TEXT) return { bg: color, fg: WHITE }
  }
  const base = String(shades['500'])
  if (getContrastRatio(BLACK, base) >= AA_NORMAL_TEXT) return { bg: base, fg: BLACK }
  for (const key of ['800', '900']) {
    const color = String(shades[key])
    if (getContrastRatio(WHITE, color) >= AA_NORMAL_TEXT) return { bg: color, fg: WHITE }
  }
  return { bg: String(shades['900']), fg: WHITE }
}

function flatten(prefix: string, record: TokenRecord, target: Record<string, string>): void {
  for (const [key, value] of Object.entries(record)) {
    target[`${prefix}-${key}`] = String(value)
  }
}

const toKebab = (key: string): string =>
  key.replace(/(?<lower>[a-z0-9])(?<upper>[A-Z])/g, '$<lower>-$<upper>').toLowerCase()

/**
 * Flattens a resolved Theme into a map of CSS custom properties
 * (e.g. `--plume-color-primary-500`, `--plume-space-4`, `--plume-radius-2`).
 * Custom color schemes added via module augmentation are included automatically.
 */
export function themeToCssVars(theme: Theme): Record<string, string> {
  const vars: Record<string, string> = {}

  const colors = theme.colors as unknown as Record<string, TokenRecord>
  for (const [scheme, shades] of Object.entries(colors)) {
    flatten(`${PREFIX}-color-${scheme}`, shades, vars)
    vars[`${PREFIX}-color-${scheme}-contrast`] = getContrastColor(String(shades['500']))
    const { bg: solid, fg: onSolid } = pickSolidPair(shades)
    vars[`${PREFIX}-color-${scheme}-solid`] = solid
    vars[`${PREFIX}-color-${scheme}-solid-contrast`] = onSolid
    vars[`${PREFIX}-color-${scheme}-solid-hover`] = getDarkenColor(solid, 12)
    vars[`${PREFIX}-color-${scheme}-solid-active`] = getDarkenColor(solid, 24)
  }

  const semantic = theme.semantic as unknown as Record<string, string>
  for (const [key, value] of Object.entries(semantic)) {
    vars[`${PREFIX}-${toKebab(key)}`] = value
  }

  vars[`${PREFIX}-font-family`] = theme.typography.fontFamily
  flatten(`${PREFIX}-font-size`, theme.typography.fontSizes as unknown as TokenRecord, vars)
  flatten(`${PREFIX}-font-weight`, theme.typography.fontWeights as unknown as TokenRecord, vars)
  flatten(`${PREFIX}-line-height`, theme.typography.lineHeights as unknown as TokenRecord, vars)
  flatten(`${PREFIX}-space`, theme.spaces as unknown as TokenRecord, vars)
  flatten(`${PREFIX}-size`, theme.sizes as unknown as TokenRecord, vars)
  flatten(`${PREFIX}-radius`, theme.radii as unknown as TokenRecord, vars)
  flatten(`${PREFIX}-z`, theme.zIndeces as unknown as TokenRecord, vars)
  flatten(`${PREFIX}-shadow`, theme.shadows as unknown as TokenRecord, vars)
  flatten(`${PREFIX}-breakpoint`, theme.breakpoints as unknown as TokenRecord, vars)

  return vars
}
