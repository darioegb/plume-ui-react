import type { CSSProperties, ForwardedRef, HTMLAttributes } from 'react'
import { forwardRef } from 'react'
import { joinClasses } from '../../../overlay/class-names'
import type { ColorScheme, ComponentProps, Shape, Size } from '../../../theme'
import styles from './progressbar.module.css'

export type ProgressBarVariant = 'solid' | 'striped' | 'unstyled'

export interface ProgressBarOwnProps {
  animated?: boolean
  colorScheme?: ColorScheme
  indeterminate?: boolean
  indicatorClassName?: string
  max?: number
  shape?: Shape
  size?: Size
  value?: number
  valueText?: string
  variant?: ProgressBarVariant
}

type ProgressBarRootAttributes = Pick<
  HTMLAttributes<HTMLDivElement>,
  'aria-label' | 'aria-labelledby' | 'hidden' | 'id' | 'title'
>

export type ProgressBarProps = Omit<ComponentProps, 'index'> &
  ProgressBarRootAttributes &
  ProgressBarOwnProps

const progressBarColorVars = (colorScheme: ColorScheme, style?: CSSProperties): CSSProperties =>
  ({
    '--progressbar-solid': `var(--plume-color-${colorScheme}-solid)`,
    ...style,
  }) as CSSProperties

const clamp = (value: number, max: number): number => Math.min(Math.max(value, 0), max)

export const ProgressBar = forwardRef<HTMLDivElement, ProgressBarProps>(
  (
    {
      animated = false,
      className,
      colorScheme = 'primary',
      indeterminate = false,
      indicatorClassName,
      max = 100,
      shape = 'pill',
      size = 'md',
      style,
      value = 0,
      valueText,
      variant = 'solid',
      ...rest
    }: ProgressBarProps,
    ref: ForwardedRef<HTMLDivElement>,
  ) => {
    const isStyled = variant !== 'unstyled'
    const total = max > 0 ? max : 100
    const current = clamp(value, total)
    const percent = (current / total) * 100
    const classes = joinClasses(
      isStyled && styles.progressbar,
      isStyled && styles[size],
      isStyled && styles[shape],
      className,
    )
    const indicator = joinClasses(
      isStyled && styles.indicator,
      isStyled && variant === 'striped' && styles.striped,
      isStyled && variant === 'striped' && animated && styles.animated,
      indicatorClassName,
    )

    return (
      <div
        aria-valuemax={total}
        aria-valuemin={0}
        aria-valuenow={indeterminate ? undefined : current}
        aria-valuetext={indeterminate ? undefined : valueText}
        className={classes}
        data-indeterminate={indeterminate ? '' : undefined}
        data-plume-progressbar=""
        ref={ref}
        role="progressbar"
        style={progressBarColorVars(colorScheme, style)}
        {...rest}
      >
        <div
          className={indicator}
          data-plume-progressbar-indicator=""
          style={indeterminate ? undefined : { inlineSize: `${percent}%` }}
        />
      </div>
    )
  },
)

ProgressBar.displayName = 'ProgressBar'
