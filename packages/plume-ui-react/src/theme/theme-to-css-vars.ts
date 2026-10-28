import { getContrastRatio, getDarkenColor, getLightenColor } from '../utils/colors'
import type { Theme } from './theme.types'

const PREFIX = '--plume'

type TokenRecord = Record<string, string | number>

const WHITE = '#ffffff'
const BLACK = '#000000'
const AA_NORMAL_TEXT = 4.5

const isDarkSurface = (surface: string): boolean =>
  getContrastRatio(WHITE, surface) >= getContrastRatio(BLACK, surface)

// Light hues (e.g. warning) keep their base shade with dark text instead of darkening the fill.
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

// Darkens the ramp on light themes and lightens it on dark ones until AA holds on every surface.
function pickTextOnSurface(shades: TokenRecord, surfaces: string[]): string {
  const dark = isDarkSurface(surfaces[0])
  const order = dark
    ? ['500', '400', '300', '200', '100', '50']
    : ['500', '600', '700', '800', '900', '950']
  for (const key of order) {
    const color = String(shades[key])
    if (surfaces.every((surface) => getContrastRatio(color, surface) >= AA_NORMAL_TEXT))
      return color
  }
  return String(shades[dark ? '50' : '950'])
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

  const { background, surface, surfaceMuted } = theme.semantic
  const surfaces = [background, surface, surfaceMuted]
  const darkSurface = isDarkSurface(background)
  const colors = theme.colors as unknown as Record<string, TokenRecord>
  for (const [scheme, shades] of Object.entries(colors)) {
    flatten(`${PREFIX}-color-${scheme}`, shades, vars)

    const { bg: solid, fg: onSolid } = pickSolidPair(shades)
    vars[`${PREFIX}-color-${scheme}-solid`] = solid
    vars[`${PREFIX}-color-${scheme}-solid-contrast`] = onSolid
    vars[`${PREFIX}-color-${scheme}-solid-hover`] = getDarkenColor(solid, 12)
    vars[`${PREFIX}-color-${scheme}-solid-active`] = getDarkenColor(solid, 24)

    const text = pickTextOnSurface(shades, surfaces)
    vars[`${PREFIX}-color-${scheme}-text`] = text
    vars[`${PREFIX}-color-${scheme}-text-hover`] = darkSurface
      ? getLightenColor(text, 12)
      : getDarkenColor(text, 12)
    vars[`${PREFIX}-color-${scheme}-text-active`] = darkSurface
      ? getLightenColor(text, 24)
      : getDarkenColor(text, 24)
    const tint = String(shades[darkSurface ? '900' : '100'])
    const tintStrong = String(shades[darkSurface ? '800' : '200'])
    vars[`${PREFIX}-color-${scheme}-tint`] = tint
    vars[`${PREFIX}-color-${scheme}-tint-strong`] = tintStrong
    vars[`${PREFIX}-color-${scheme}-tint-text`] = pickTextOnSurface(shades, [tint, tintStrong])
  }

  const semantic = theme.semantic as unknown as Record<string, string>
  for (const [key, value] of Object.entries(semantic)) {
    vars[`${PREFIX}-${toKebab(key)}`] = value
  }

  vars[`${PREFIX}-font-family`] = theme.typography.fontFamily
  flatten(`${PREFIX}-font-size`, theme.typography.fontSizes as unknown as TokenRecord, vars)
  flatten(`${PREFIX}-font-weight`, theme.typography.fontWeights as unknown as TokenRecord, vars)
  flatten(`${PREFIX}-line-height`, theme.typography.lineHeights as unknown as TokenRecord, vars)
  flatten(`${PREFIX}-space`, theme.spaces, vars)
  flatten(`${PREFIX}-radius`, theme.radii, vars)
  flatten(`${PREFIX}-z`, theme.zIndices as unknown as TokenRecord, vars)
  flatten(`${PREFIX}-shadow`, theme.shadows as unknown as TokenRecord, vars)

  return vars
}
