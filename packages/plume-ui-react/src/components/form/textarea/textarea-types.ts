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
  /**
   * The parts of the textarea (`TextareaField`, `TextareaCount` and `TextareaStatus`), in the order
   * they should appear. Without children it renders the field, and the count with `showCount`.
   */
  children?: ReactNode
  /**
   * Color scheme of the focus ring and of the border while focused, from the theme palette.
   * @default 'secondary'
   */
  colorScheme?: ColorScheme
  /**
   * The texts of the textarea, for other languages. `count(count, max)` is the text of the count
   * (the default says `12 / 200`, or `12` without a limit) and `remaining(remaining)` is what a
   * screen reader gets near the limit (the default says `8 characters left`).
   */
  labels?: Partial<TextareaLabels>
  /**
   * Which way the user can resize the textarea.
   * @default 'vertical'
   */
  resize?: TextareaResize
  /**
   * Shape of the corners.
   * @default 'rounded'
   */
  shape?: Shape
  /**
   * Shows how many characters there are under the textarea, as `12` or, with `maxLength`, as `12 /
   * 200`. The count describes the textarea to a screen reader, and it turns red at the limit.
   * @default false
   */
  showCount?: boolean
  /**
   * Size of the textarea.
   * @default 'md'
   */
  size?: Size
  /**
   * Visual variant. `unstyled` drops the Plume styles so you can bring your own.
   * @default 'outline'
   */
  variant?: TextareaVariant
}

export type TextareaProps = Omit<ComponentProps, 'index'> &
  TextareaFieldAttributes &
  TextareaOwnProps
