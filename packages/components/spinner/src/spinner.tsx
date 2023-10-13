import type { HtmlHTMLAttributes } from 'react'
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

type SpinnerVariant = 'solid' | 'dashed' | 'dotted' | 'double' | 'unstyled'
type SpinnerRootAttributes = Pick<
  HtmlHTMLAttributes<HTMLSpanElement>,
  'hidden' | 'id' | 'tabIndex'
>
type SpinnerStylesOptions = Omit<SpinnerOwnProps, 'size' | 'variant'> &
  Pick<ComponentProps, 'customStyles'>
export type SpinnerProps = ComponentProps &
  SpinnerRootAttributes &
  SpinnerOwnProps

const createSpinnerStyles = ({
  borderColor,
  borderTopColor,
  borderRightColor,
  borderBottomColor,
  borderLeftColor,
  customStyles: style,
  speed,
  thickness,
}: SpinnerStylesOptions): Record<string, unknown> => ({
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
      customStyles,
      borderColor = 'currentColor',
      customClasses = '',
      size = 'md',
      speed = '1s',
      thickness = 3,
      variant = 'solid',
      ...props
    }: SpinnerProps,
    ref,
  ) => {
    const spinnerStyles = createSpinnerStyles({
      borderColor,
      borderTopColor,
      borderRightColor,
      borderBottomColor,
      borderLeftColor,
      customStyles,
      speed,
      thickness,
    })

    const sizeClass = size !== 'md' ? styles[size] : ''
    const borderTopClass = borderTopColor ? styles.borderTopColor : ''
    const borderRightClass = borderRightColor ? styles.borderRightColor : ''
    const borderBottomClass = borderBottomColor ? styles.borderBottomColor : ''
    const borderLeftClass = borderLeftColor ? styles.borderLeftColor : ''
    const variantClass = variant !== 'unstyled' ? styles[variant] : ''

    const spinnerClass = `
      ${sizeClass} 
      ${variantClass} 
      ${borderTopClass} 
      ${borderRightClass}
      ${borderBottomClass}
      ${borderLeftClass}
      ${customClasses}
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
