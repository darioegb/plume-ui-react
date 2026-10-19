import type { CSSProperties, ForwardedRef, TextareaHTMLAttributes } from 'react'
import { forwardRef } from 'react'
import type { ColorScheme, ComponentProps, Shape, Size } from '../../../theme'
import styles from './textarea.module.css'

export interface TextareaOwnProps {
  colorScheme?: ColorScheme
  resize?: TextareaResize
  shape?: Shape
  size?: Size
  variant?: TextareaVariant
}

export type TextareaVariant = 'outline' | 'filled' | 'underline' | 'unstyled'
export type TextareaResize = 'none' | 'vertical' | 'horizontal' | 'both'

type TextareaRootAttributes = Pick<
  TextareaHTMLAttributes<HTMLTextAreaElement>,
  | 'aria-describedby'
  | 'aria-invalid'
  | 'aria-label'
  | 'aria-labelledby'
  | 'cols'
  | 'defaultValue'
  | 'disabled'
  | 'id'
  | 'maxLength'
  | 'minLength'
  | 'name'
  | 'onBlur'
  | 'onChange'
  | 'onFocus'
  | 'placeholder'
  | 'readOnly'
  | 'required'
  | 'rows'
  | 'value'
  | 'wrap'
>

export type TextareaProps = Omit<ComponentProps, 'index'> &
  TextareaRootAttributes &
  TextareaOwnProps

const textareaColorVars = (colorScheme: ColorScheme, style?: CSSProperties): CSSProperties =>
  ({
    '--textarea-color': `var(--plume-color-${colorScheme}-text)`,
    ...style,
  }) as CSSProperties

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  (
    {
      className = '',
      colorScheme = 'secondary',
      disabled = false,
      resize = 'vertical',
      rows = 3,
      shape = 'rounded',
      size = 'md',
      style,
      variant = 'outline',
      ...rest
    }: TextareaProps,
    ref: ForwardedRef<HTMLTextAreaElement>,
  ) => {
    const isStyled = variant !== 'unstyled'
    const isInvalid = rest['aria-invalid'] === true || rest['aria-invalid'] === 'true'
    const classes = `${
      isStyled
        ? `${styles.base} ${styles[variant]} ${styles[size]} ${styles[shape]} ${styles[resize]}`
        : ''
    } ${isInvalid && isStyled ? styles.invalid : ''} ${disabled ? styles.disabled : ''} ${className}`
      .replace(/\s+/g, ' ')
      .trim()

    return (
      <textarea
        className={classes}
        disabled={disabled}
        ref={ref}
        rows={rows}
        style={textareaColorVars(isInvalid ? 'error' : colorScheme, style)}
        {...rest}
      />
    )
  },
)

Textarea.displayName = 'Textarea'
