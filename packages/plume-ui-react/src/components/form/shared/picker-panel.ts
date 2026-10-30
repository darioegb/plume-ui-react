import type { CSSProperties } from 'react'
import type { Shape, Size } from '../../../theme'
import { joinClasses } from '../../../overlay/class-names'
import styles from './picker-panel.module.css'

export type PickerVariant = 'outline' | 'filled' | 'underline' | 'unstyled'

const VARIANT_CLASS = {
  filled: styles.panelFilled,
  outline: styles.panelOutline,
  underline: styles.panelUnderline,
} as const

export const pickerPanelClasses = (
  variant: PickerVariant,
  size?: Size,
  shape?: Shape,
): string | undefined =>
  variant === 'unstyled'
    ? undefined
    : joinClasses(
        styles.panel,
        VARIANT_CLASS[variant],
        size === 'sm' && styles.panelSm,
        size === 'lg' && styles.panelLg,
        shape === 'pill' && styles.panelPill,
      )

export const customProperties = (style?: CSSProperties): CSSProperties =>
  Object.fromEntries(Object.entries(style ?? {}).filter(([name]) => name.startsWith('--')))
