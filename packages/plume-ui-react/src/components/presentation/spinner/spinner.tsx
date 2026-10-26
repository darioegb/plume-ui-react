'use client'

import { forwardRef } from 'react'
import type { HtmlHTMLAttributes } from 'react'
import type { ColorShade, ComponentProps, Size } from '../../../theme'
import { colorVar } from '../../../theme'
import { useLabels } from '../../../locale/locale-provider'
import styles from './spinner.module.css'

const DEFAULT_LABELS = { label: 'Loading' }

export interface SpinnerOwnProps {
  /**
   * Color from the theme palette: a scheme (`primary`) or a specific shade (`primary.700`). Without
   * it the Spinner takes the foreground color of the theme, so it shows in light and dark mode.
   */
  color?: ColorShade
  /**
   * Accessible name of the Spinner, announced while it spins. Change it to translate it.
   *
   * @default 'Loading'
   */
  label?: string
  /**
   * The size of the Spinner.
   *
   * @default 'md'
   */
  size?: Size
  /**
   * Duration of one turn, as a CSS time (e.g. `0.5s`, `800ms`).
   *
   * @default '1s'
   */
  speed?: string
  /**
   * Border width in pixels.
   *
   * @default 3
   */
  thickness?: number
  /**
   * The border variant of the Spinner.
   *
   * @default 'solid'
   */
  variant?: SpinnerVariant
}

type SpinnerVariant = 'solid' | 'dashed' | 'dotted' | 'double' | 'unstyled'
type SpinnerRootAttributes = Pick<
  HtmlHTMLAttributes<HTMLSpanElement>,
  'hidden' | 'id' | 'tabIndex'
>
type SpinnerStylesOptions = Omit<SpinnerOwnProps, 'size' | 'variant'> &
  Pick<ComponentProps, 'style'>
export type SpinnerProps = ComponentProps & SpinnerRootAttributes & SpinnerOwnProps

const createSpinnerStyles = ({
  color,
  style,
  speed,
  thickness,
}: SpinnerStylesOptions): Record<string, unknown> => ({
  '--spinner-scheme': color ? colorVar(color) : 'var(--plume-foreground)',
  ...(thickness && { '--spinner-border-width': `${thickness}px` }),
  '--spinner-animation-duration': speed?.length ? speed : '1s',
  ...style,
})

export const Spinner = forwardRef<HTMLOutputElement, SpinnerProps>(
  (
    {
      color,
      label,
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
    const text = useLabels('spinner', DEFAULT_LABELS, { label })
    const sizeClass = size && (size !== 'md' || variant === 'unstyled') ? styles[size] : ''
    const variantClass = variant !== 'unstyled' ? styles[variant] : ''
    const spinnerClass = `
      ${sizeClass} 
      ${variantClass} 
      ${className}
    `.trim()

    return (
      <output
        aria-label={text.label}
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
