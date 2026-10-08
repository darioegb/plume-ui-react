import type { Theme } from './theme.types'

const PREFIX = '--plume'

type TokenRecord = Record<string, string | number>

function flatten(prefix: string, record: TokenRecord, target: Record<string, string>): void {
  for (const [key, value] of Object.entries(record)) {
    target[`${prefix}-${key}`] = String(value)
  }
}

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
