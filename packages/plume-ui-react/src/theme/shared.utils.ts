import type { ColorShade } from './shared.types'

/**
 * Maps a ColorShade (e.g. 'primary' or 'primary.900') to the matching CSS
 * custom property emitted by <ThemeProvider> (e.g. `var(--plume-color-primary-900)`).
 * A bare scheme defaults to shade 500.
 */
export function colorVar(colorShade: ColorShade): string {
  if (colorShade.includes('.')) {
    const [scheme, shade] = colorShade.split('.')
    return `var(--plume-color-${scheme}-${shade})`
  }
  return `var(--plume-color-${colorShade}-500)`
}
