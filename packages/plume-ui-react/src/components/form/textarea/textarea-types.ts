import type { ReactNode, TextareaHTMLAttributes } from 'react'
import type { ColorScheme, ComponentProps, Shape, Size } from '../../../theme'

export type TextareaVariant = 'outline' | 'filled' | 'underline' | 'unstyled'
export type TextareaResize = 'none' | 'vertical' | 'horizontal' | 'both'

export interface TextareaLabels {
  count: (count: number, max: number | undefined) => string
  remaining: (remaining: number) => string
}

export type TextareaFieldAttributes = Pick<
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

export interface TextareaOwnProps {
  children?: ReactNode
  colorScheme?: ColorScheme
  labels?: Partial<TextareaLabels>
  resize?: TextareaResize
  shape?: Shape
  showCount?: boolean
  size?: Size
  variant?: TextareaVariant
}

export type TextareaProps = Omit<ComponentProps, 'index'> &
  TextareaFieldAttributes &
  TextareaOwnProps
