import type { CSSProperties, ForwardedRef, HTMLAttributes } from 'react'
import { forwardRef } from 'react'
import { joinClasses } from '../../../overlay/class-names'
import type { ColorScheme, ComponentProps, Shape, Size } from '../../../theme'
import styles from './progressbar.module.css'

export type ProgressBarPart = 'indicator' | 'value'

export type ProgressBarVariant = 'solid' | 'striped' | 'unstyled'

export interface ProgressBarOwnProps {
  animated?: boolean
  colorScheme?: ColorScheme
  formatValue?: (value: number, max: number) => string
  indeterminate?: boolean
  classNames?: Partial<Record<ProgressBarPart, string>>
  /** Alias of `classNames.indicator`, kept until the next major. */
  indicatorClassName?: string
  max?: number
  shape?: Shape
  showValue?: boolean
  size?: Size
  value?: number
  /** Alias of `classNames.value`, kept until the next major. */
  valueClassName?: string
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

const defaultFormatValue = (value: number, max: number): string =>
  `${Math.round((value / max) * 100)}%`

const clamp = (value: number, max: number): number => Math.min(Math.max(value, 0), max)

export const ProgressBar = forwardRef<HTMLDivElement, ProgressBarProps>(
  (
    {
      animated = false,
      className,
      colorScheme = 'primary',
      formatValue = defaultFormatValue,
      indeterminate = false,
      classNames,
      indicatorClassName,
      max = 100,
      shape = 'pill',
      showValue = false,
      size = 'md',
      style,
      value = 0,
      valueClassName,
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
      classNames?.indicator,
    )

    const bar = (
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

    if (!showValue || indeterminate) return bar

    return (
      <div data-plume-progressbar-field="">
        {bar}
        <span
          aria-hidden="true"
          className={joinClasses(isStyled && styles.value, valueClassName, classNames?.value)}
          data-plume-progressbar-value=""
        >
          {formatValue(current, total)}
        </span>
      </div>
    )
  },
)

ProgressBar.displayName = 'ProgressBar'
