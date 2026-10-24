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
  animated?: boolean
  children?: ReactNode
  colorScheme?: ColorScheme
  formatValue?: (value: number, max: number) => string
  indeterminate?: boolean
  max?: number
  shape?: Shape
  showValue?: boolean
  size?: Size
  value?: number
  valueText?: string
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
      animated = false,
      children,
      className,
      colorScheme = 'primary',
      formatValue = defaultFormatValue,
      indeterminate = false,
      max = 100,
      shape = 'pill',
      showValue = false,
      size = 'md',
      style,
      value = 0,
      valueText,
      variant = 'solid',
      ...rest
    }: ProgressBarProps,
    ref: ForwardedRef<HTMLDivElement>,
  ): ReactNode => {
    const total = max > 0 ? max : 100
    const current = clamp(value, total)
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
        trackProps: rest,
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
        rest,
        shape,
        size,
        total,
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
