import { forwardRef } from 'react'
import type { HtmlHTMLAttributes } from 'react'
import type { ColorPalette, ComponentProps, Size } from '@plume-ui-react/core'
import { getMergedConfig } from '@plume-ui-react/core'
import styles from './spinner.module.css'

export interface SpinnerOwnProps {
  colorScheme?: keyof ColorPalette
  size?: Size
  speed?: string
  thickness?: number
  variant?: SpinnerVariant
}

type SpinnerVariant = 'solid' | 'dashed' | 'dotted' | 'double' | 'unstyled'
type SpinnerRootAttributes = Pick<HtmlHTMLAttributes<HTMLSpanElement>, 'hidden' | 'id' | 'tabIndex'>
type SpinnerStylesOptions = Omit<SpinnerOwnProps, 'size' | 'variant' | 'colorScheme'> &
  Pick<ComponentProps, 'style'> & { color: string }
export type SpinnerProps = ComponentProps & SpinnerRootAttributes & SpinnerOwnProps

const createSpinnerStyles = ({
  color,
  style,
  speed,
  thickness,
}: SpinnerStylesOptions): Record<string, unknown> => ({
  ...(thickness && { '--spinner-border-width': `${thickness}px` }),
  ...(color && { '--spinner-scheme': color }),
  '--spinner-animation-duration': speed?.length ? speed : '1s',
  ...(style ?? {}),
})

export const Spinner = forwardRef<HTMLOutputElement, SpinnerProps>(
  (
    {
      style,
      colorScheme,
      speed,
      className = '',
      thickness = 3,
      variant = 'solid',
      ...rest
    }: SpinnerProps,
    ref,
  ) => {
    const { size = variant !== 'unstyled' && 'md' } = rest
    const color = (colorScheme && getMergedConfig().colors[colorScheme]) || '#d3d3d3'
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
