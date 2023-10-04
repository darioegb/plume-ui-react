import type { CSSProperties, HtmlHTMLAttributes } from 'react'
import { forwardRef } from 'react'
import type { ComponentProps, Size } from '@plume-ui-react/core'
import styles from './spinner.module.css'

export interface SpinnerOwnProps {
  borderColor?: string
  borderTopColor?: string
  borderBottomColor?: string
  borderLeftColor?: string
  borderRightColor?: string
  size?: Size
  speed?: string
  thickness?: number
  variant?: SpinnerVariant
}

type SpinnerVariant = 'solid' | 'dashed' | 'dotted' | 'double'
type SpinnerRootAttributes = Pick<
  HtmlHTMLAttributes<HTMLSpanElement>,
  'hidden' | 'id' | 'tabIndex'
>
export type SpinnerProps = ComponentProps &
  SpinnerRootAttributes &
  SpinnerOwnProps

const createSpinnerStyles = (
  thickness: number,
  borderColor: string,
  speed: string,
  borderTopColor?: string,
  borderRightColor?: string,
  borderBottomColor?: string,
  borderLeftColor?: string,
  style?: CSSProperties,
): Record<string, unknown> => ({
  ...(thickness && { '--border-width': `${thickness}px` }),
  ...(borderColor && { '--color': borderColor }),
  ...(borderTopColor && {
    '--border-top-color': borderTopColor,
  }),
  ...(borderRightColor && {
    '--border-right-color': borderRightColor,
  }),
  ...(borderBottomColor && {
    '--border-bottom-color': borderBottomColor,
  }),
  ...(borderLeftColor && {
    '--border-left-color': borderLeftColor,
  }),
  '--animation-duration': speed,
  ...(style || {}),
})

export const Spinner = forwardRef<HTMLSpanElement, SpinnerProps>(
  (
    {
      borderTopColor,
      borderRightColor,
      borderBottomColor,
      borderLeftColor,
      customClasses,
      customStyles,
      borderColor = 'currentColor',
      size = 'md',
      speed = '1s',
      thickness = 3,
      variant = 'solid',
      ...props
    }: SpinnerProps,
    ref,
  ) => {
    const spinnerStyles = createSpinnerStyles(
      thickness,
      borderColor,
      speed,
      borderTopColor,
      borderRightColor,
      borderBottomColor,
      borderLeftColor,
      customStyles,
    )

    const spinnerClass = `
    ${
      customClasses ??
      `
    ${size !== 'md' ? styles[`${size}`] : ''}
    ${styles[`${variant}`]}
    ${borderTopColor ? styles.borderTopColor : ''}
    ${borderRightColor ? styles.borderRightColor : ''}
    ${borderBottomColor ? styles.borderBottomColor : ''}
    ${borderLeftColor ? styles.borderLeftColor : ''}`
    }
  `.trim()

    return (
      <span
        aria-label="loading"
        className={spinnerClass}
        ref={ref}
        role="status"
        style={spinnerStyles}
        {...props}
      />
    )
  },
)

Spinner.displayName = 'Spinner'
