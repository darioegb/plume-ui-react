import { forwardRef } from 'react'
import type { HtmlHTMLAttributes } from 'react'
import type { ColorShade, ComponentProps, Size } from '../../../theme'
import { colorVar } from '../../../theme'
import styles from './spinner.module.css'

export interface SpinnerOwnProps {
  color?: ColorShade
  size?: Size
  speed?: string
  thickness?: number
  variant?: SpinnerVariant
}

type SpinnerVariant = 'solid' | 'dashed' | 'dotted' | 'double' | 'unstyled'
type SpinnerRootAttributes = Pick<HtmlHTMLAttributes<HTMLSpanElement>, 'hidden' | 'id' | 'tabIndex'>
type SpinnerStylesOptions = Omit<SpinnerOwnProps, 'size' | 'variant'> &
  Pick<ComponentProps, 'style'> & { color: ColorShade }
export type SpinnerProps = ComponentProps & SpinnerRootAttributes & SpinnerOwnProps

const createSpinnerStyles = ({
  color,
  style,
  speed,
  thickness,
}: SpinnerStylesOptions): Record<string, unknown> => ({
  '--spinner-scheme': colorVar(color),
  ...(thickness && { '--spinner-border-width': `${thickness}px` }),
  '--spinner-animation-duration': speed?.length ? speed : '1s',
  ...(style ?? {}),
})

export const Spinner = forwardRef<HTMLOutputElement, SpinnerProps>(
  (
    {
      color = `secondary.900`,
      style,
      speed,
      className = '',
      thickness = 3,
      variant = 'solid',
      size = variant !== 'unstyled' ? 'md' : undefined,
      ...rest
    }: SpinnerProps,
    ref,
  ) => {
    const sizeClass = size && (size !== 'md' || variant === 'unstyled') ? styles[size] : ''
    const variantClass = variant !== 'unstyled' ? styles[variant] : ''
    const spinnerClass = `
      ${sizeClass} 
      ${variantClass} 
      ${className}
    `.trim()

    return (
      <output
        aria-label="loading"
        className={spinnerClass}
        ref={ref}
        style={createSpinnerStyles({
          color,
          style,
          speed,
          thickness,
        })}
        {...rest}
      />
    )
  },
)

Spinner.displayName = 'Spinner'
