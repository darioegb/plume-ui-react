'use client'

import type { ForwardedRef, HTMLAttributes, ReactNode } from 'react'
import { forwardRef } from 'react'
import { joinClasses } from '../../../overlay/class-names'
import type { ComponentProps } from '../../../theme'
import { SliderRange } from './slider-range'
import { useSliderContext } from './slider-context'
import styles from './slider.module.css'

export type SliderTrackProps = Omit<ComponentProps, 'index'> &
  Pick<HTMLAttributes<HTMLSpanElement>, 'children'>

/** The bar behind the thumbs. Without children it renders a `SliderRange`. */
export const SliderTrack = forwardRef<HTMLSpanElement, SliderTrackProps>(
  (
    { children, className, style }: SliderTrackProps,
    ref: ForwardedRef<HTMLSpanElement>,
  ): ReactNode => {
    const { isStyled } = useSliderContext('SliderTrack')

    return (
      <span
        className={joinClasses(isStyled && styles.track, className)}
        data-plume-slider-track=""
        ref={ref}
        style={style}
      >
        {children ?? <SliderRange />}
      </span>
    )
  },
)

SliderTrack.displayName = 'SliderTrack'
