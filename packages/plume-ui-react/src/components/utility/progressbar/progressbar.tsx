'use client'

import type { ForwardedRef, ReactNode } from 'react'
import { forwardRef, useMemo } from 'react'
import { hasPart } from '../../../overlay/has-part'
import type { ColorScheme, ComponentProps, Shape, Size } from '../../../theme'
import { ProgressBarContext, progressBarColorVars } from './progressbar-context'
import type {
  ProgressBarContextValue,
  ProgressBarTrackAttributes,
  ProgressBarVariant,
} from './progressbar-context'
import { ProgressBarTrack } from './progressbar-track'
import { ProgressBarValue } from './progressbar-value'

export type { ProgressBarVariant } from './progressbar-context'

export interface ProgressBarOwnProps {
  /**
   * Moves the stripes. It only applies to the `striped` variant.
   * @default false
   */
  animated?: boolean
  /**
   * The parts of the bar: a `ProgressBarTrack`, or the `ProgressBarIndicator` that goes inside
   * it, and a `ProgressBarValue` for the text. Given none, it renders the track with its
   * indicator, and the value when `showValue` is set.
   */
  children?: ReactNode
  /**
   * Color scheme from the theme palette, including custom schemes added to it.
   * @default 'primary'
   */
  colorScheme?: ColorScheme
  /**
   * Returns the text that `showValue` shows, from the value (kept between 0 and `max`) and the
   * `max`. By default it is the rounded percentage.
   * @default (value, max) => `${Math.round((value / max) * 100)}%`
   */
  formatValue?: (value: number, max: number) => string
  /**
   * For a task of unknown length. The bar moves back and forth and the progress bar has no
   * value.
   * @default false
   */
  indeterminate?: boolean
  /**
   * The value that means the task is done. It has to be positive, or it falls back to `100`.
   * @default 100
   */
  max?: number
  /**
   * Corners of the bar.
   * @default 'pill'
   */
  shape?: Shape
  /**
   * Shows the percentage next to the bar. The text is hidden from screen readers, who already
   * get the value from the progress bar. An indeterminate bar has no text.
   * @default false
   */
  showValue?: boolean
  /**
   * Thickness of the bar.
   * @default 'md'
   */
  size?: Size
  /**
   * How much is done, from `0` to `max`. A value out of range is kept inside it.
   * @default 0
   */
  value?: number
  /** A text for the value, when the number is not enough: `3 of 10 files`. */
  valueText?: string
  /**
   * Visual variant. `solid` fills the bar with one color and `striped` adds stripes. `unstyled`
   * drops the Plume styles so you can bring your own.
   * @default 'solid'
   */
  variant?: ProgressBarVariant
}

export type ProgressBarProps = Omit<ComponentProps, 'index'> &
  ProgressBarTrackAttributes &
  ProgressBarOwnProps

const defaultFormatValue = (value: number, max: number): string =>
  `${Math.round((value / max) * 100)}%`

const clamp = (value: number, max: number): number => Math.min(Math.max(value, 0), max)

export const ProgressBar = forwardRef<HTMLDivElement, ProgressBarProps>(
  (
    {
      'aria-label': ariaLabel,
      'aria-labelledby': ariaLabelledBy,
      animated = false,
      children,
      className,
      colorScheme = 'primary',
      formatValue = defaultFormatValue,
      hidden,
      id,
      indeterminate = false,
      max = 100,
      shape = 'pill',
      showValue = false,
      size = 'md',
      style,
      title,
      value = 0,
      valueText,
      variant = 'solid',
    }: ProgressBarProps,
    ref: ForwardedRef<HTMLDivElement>,
  ): ReactNode => {
    const total = max > 0 ? max : 100
    const current = clamp(value, total)
    const trackProps = useMemo(
      () => ({ 'aria-label': ariaLabel, 'aria-labelledby': ariaLabelledBy, hidden, id, title }),
      [ariaLabel, ariaLabelledBy, hidden, id, title],
    )
    const context: ProgressBarContextValue = useMemo(
      () => ({
        animated,
        current,
        formatValue,
        indeterminate,
        isStyled: variant !== 'unstyled',
        percent: (current / total) * 100,
        shape,
        size,
        total,
        trackProps,
        trackRef: ref,
        valueText,
        variant,
      }),
      [
        animated,
        current,
        formatValue,
        indeterminate,
        ref,
        shape,
        size,
        total,
        trackProps,
        valueText,
        variant,
      ],
    )
    const outermost = {
      className,
      'data-plume-progressbar': '',
      style: progressBarColorVars(colorScheme, style),
    }

    if (hasPart(children, [ProgressBarTrack])) {
      return (
        <ProgressBarContext.Provider value={context}>
          <div data-plume-progressbar-field="" {...outermost}>
            {children}
          </div>
        </ProgressBarContext.Provider>
      )
    }

    if (!showValue || indeterminate) {
      return (
        <ProgressBarContext.Provider value={context}>
          <ProgressBarTrack {...outermost}>{children}</ProgressBarTrack>
        </ProgressBarContext.Provider>
      )
    }

    return (
      <ProgressBarContext.Provider value={context}>
        <div data-plume-progressbar-field="" {...outermost}>
          <ProgressBarTrack>{children}</ProgressBarTrack>
          <ProgressBarValue />
        </div>
      </ProgressBarContext.Provider>
    )
  },
)

ProgressBar.displayName = 'ProgressBar'
