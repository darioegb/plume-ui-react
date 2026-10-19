import type { CSSProperties } from 'react'
import type { ColorPalette , ShadeLevel } from './theme.types'

export interface ComponentProps {
  className?: string
  style?: CSSProperties
  index?: number
}

export type Size = 'sm' | 'md' | 'lg'
export type Shape = 'pill' | 'rounded'
export type ColorScheme = keyof ColorPalette
export type Shade = keyof ShadeLevel
export type ColorShade = ColorScheme | `${ColorScheme}.${Shade}`
