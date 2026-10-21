import type { CSSProperties, ForwardedRef, TextareaHTMLAttributes } from 'react'
import { forwardRef } from 'react'
import type { ColorScheme, ComponentProps, Shape, Size } from '../../../theme'
import { TextareaCounter } from './textarea-counter'
import styles from './textarea.module.css'

export interface TextareaOwnProps {
  colorScheme?: ColorScheme
  countClassName?: string
  formatCount?: (count: number, max: number | undefined) => string
  formatRemaining?: (remaining: number) => string
  resize?: TextareaResize
  shape?: Shape
  showCount?: boolean
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
      countClassName,
      disabled = false,
      formatCount,
      formatRemaining,
      resize = 'vertical',
      rows = 3,
      shape = 'rounded',
      showCount = false,
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

    const textareaProps = {
      className: classes,
      disabled,
      rows,
      style: textareaColorVars(isInvalid ? 'error' : colorScheme, style),
      ...rest,
    }

    if (!showCount) return <textarea ref={ref} {...textareaProps} />

    return (
      <TextareaCounter
        countClassName={countClassName}
        formatCount={formatCount}
        formatRemaining={formatRemaining}
        isStyled={isStyled}
        ref={ref}
        textareaProps={textareaProps}
      />
    )
  },
)

Textarea.displayName = 'Textarea'
