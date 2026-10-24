import type { CSSProperties } from 'react'
import { joinClasses } from '../../../overlay/class-names'
import type { ColorScheme, Shape, Size } from '../../../theme'
import type { TextareaResize, TextareaVariant } from './textarea-types'
import styles from './textarea.module.css'

interface TextareaFieldClassesOptions {
  className?: string
  disabled: boolean
  invalid: boolean
  resize: TextareaResize
  shape: Shape
  size: Size
  variant: TextareaVariant
}

export const textareaFieldClasses = ({
  className,
  disabled,
  invalid,
  resize,
  shape,
  size,
  variant,
}: TextareaFieldClassesOptions): string | undefined => {
  const isStyled = variant !== 'unstyled'
  return joinClasses(
    isStyled &&
      `${styles.base} ${styles[variant]} ${styles[size]} ${styles[shape]} ${styles[resize]}`,
    invalid && isStyled && styles.invalid,
    disabled && styles.disabled,
    className,
  )
}

export const textareaColorVars = (colorScheme: ColorScheme, style?: CSSProperties): CSSProperties =>
  ({
    '--textarea-color': `var(--plume-color-${colorScheme}-text)`,
    ...style,
  }) as CSSProperties

export const isTextareaInvalid = (ariaInvalid: unknown): boolean =>
  ariaInvalid === true || ariaInvalid === 'true'
