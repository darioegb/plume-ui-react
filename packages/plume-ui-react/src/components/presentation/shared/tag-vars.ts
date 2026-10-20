import type { CSSProperties } from 'react'
import type { ColorScheme } from '../../../theme'

export const tagColorVars = (
  name: 'badge' | 'chip',
  colorScheme: ColorScheme,
  style?: CSSProperties,
): CSSProperties =>
  ({
    [`--${name}-solid`]: `var(--plume-color-${colorScheme}-solid)`,
    [`--${name}-contrast`]: `var(--plume-color-${colorScheme}-solid-contrast)`,
    [`--${name}-text`]: `var(--plume-color-${colorScheme}-text)`,
    [`--${name}-tint`]: `var(--plume-color-${colorScheme}-tint)`,
    [`--${name}-tint-text`]: `var(--plume-color-${colorScheme}-tint-text)`,
    '--tag-solid': `var(--${name}-solid)`,
    '--tag-contrast': `var(--${name}-contrast)`,
    '--tag-text': `var(--${name}-text)`,
    '--tag-tint': `var(--${name}-tint)`,
    '--tag-tint-text': `var(--${name}-tint-text)`,
    ...style,
  }) as CSSProperties
