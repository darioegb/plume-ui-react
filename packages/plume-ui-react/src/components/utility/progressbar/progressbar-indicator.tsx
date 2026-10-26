'use client'

import type { ForwardedRef, ReactNode } from 'react'
import { forwardRef } from 'react'
import { joinClasses } from '../../../overlay/class-names'
import type { ComponentProps } from '../../../theme'
import { useProgressBarContext } from './progressbar-context'
import styles from './progressbar.module.css'

export type ProgressBarIndicatorProps = Omit<ComponentProps, 'index'>

/** The bar. Its width follows the value. */
export const ProgressBarIndicator = forwardRef<HTMLDivElement, ProgressBarIndicatorProps>(
  (
    { className, style }: ProgressBarIndicatorProps,
    ref: ForwardedRef<HTMLDivElement>,
  ): ReactNode => {
    const { animated, indeterminate, isStyled, percent, variant } =
      useProgressBarContext('ProgressBarIndicator')
    const striped = isStyled && variant === 'striped'

    return (
      <div
        className={joinClasses(
          isStyled && styles.indicator,
          striped && styles.striped,
          striped && animated && styles.animated,
          className,
        )}
        data-plume-progressbar-indicator=""
        ref={ref}
        style={indeterminate ? style : { inlineSize: `${percent}%`, ...style }}
      />
    )
  },
)

ProgressBarIndicator.displayName = 'ProgressBarIndicator'
