'use client'

import type { ForwardedRef, ReactNode } from 'react'
import { forwardRef } from 'react'
import { joinClasses } from '../../../overlay/class-names'
import type { ComponentProps } from '../../../theme'
import { useSliderContext } from './slider-context'
import styles from './slider.module.css'

export type SliderRangeProps = Omit<ComponentProps, 'index'>

export const SliderRange = forwardRef<HTMLSpanElement, SliderRangeProps>(
  ({ className, style }: SliderRangeProps, ref: ForwardedRef<HTMLSpanElement>): ReactNode => {
    const { isStyled } = useSliderContext('SliderRange')

    return (
      <span
        className={joinClasses(isStyled && styles.range, className)}
        data-plume-slider-range=""
        ref={ref}
        style={style}
      />
    )
  },
)

SliderRange.displayName = 'SliderRange'
