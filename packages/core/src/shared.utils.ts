import type { CSSProperties } from 'react'
import type { ColorScheme, ColorShade, Shade } from './shared.types'
import { getMergedTheme } from './config'

interface CreateStylesProps {
  [key: string]: string | CSSProperties | undefined
  style?: CSSProperties
  prefix?: string
}

export function createStyles({
  prefix = '',
  style,
  ...rest
}: CreateStylesProps): Record<string, unknown> {
  const customStyles: Record<string, string> = {}

  const definedProps = Object.entries(rest).filter(([_, value]) => typeof value === 'string')

  for (const [key, value] of definedProps) {
    const kebabCaseKey = key.replace(/(?<temp2>[a-z0-9])(?<temp1>[A-Z])/g, '$1-$2').toLowerCase()
    customStyles[`--${prefix}-${kebabCaseKey}`] =
      typeof value === 'string' ? value : JSON.stringify(value)
  }

  const combinedStyles = style ? { ...customStyles, ...style } : customStyles

  return combinedStyles
}

export function getColorFromTheme(colorShade: ColorShade): string {
  if (colorShade.includes('.')) {
    const [color, shade] = colorShade.split('.') as [ColorScheme, Shade]
    return getColorWithShadeFromTheme(color, shade)
  }
  const color = colorShade as ColorScheme
  return getColorWithShadeFromTheme(color)
}

export function getColorWithShadeFromTheme(scheme: ColorScheme, shade?: Shade): string {
  const colors = getMergedTheme().colors
  return shade ? colors[scheme][shade] : colors[scheme][500]
}
