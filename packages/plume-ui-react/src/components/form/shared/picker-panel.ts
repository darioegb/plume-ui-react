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
  joinClasses(
    styles.panel,
    variant !== 'unstyled' && VARIANT_CLASS[variant],
    size === 'sm' && styles.panelSm,
    size === 'lg' && styles.panelLg,
    shape === 'pill' && styles.panelPill,
  )
