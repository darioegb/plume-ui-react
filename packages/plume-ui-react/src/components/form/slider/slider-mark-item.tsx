'use client'

import type { CSSProperties, ForwardedRef, HTMLAttributes, ReactNode } from 'react'
import { forwardRef } from 'react'
import { joinClasses } from '../../../overlay/class-names'
import type { ComponentProps } from '../../../theme'
import { type SliderMark, useSliderContext } from './slider-context'
import { SliderMarkLabel } from './slider-mark-label'
import { fractionOf } from './slider-math'
import styles from './slider.module.css'

export interface SliderMarkItemOwnProps {
  /** The mark it shows: its value and, optionally, its label. */
  mark: SliderMark
}

export type SliderMarkItemProps = Omit<ComponentProps, 'index'> &
  Pick<HTMLAttributes<HTMLSpanElement>, 'children'> &
  SliderMarkItemOwnProps

/**
 * A mark: the dot on the track, which has `data-edge` at the ends of the track, where the style hides it. Without children it renders a `SliderMarkLabel` when the mark has a
 * label.
 */
export const SliderMarkItem = forwardRef<HTMLSpanElement, SliderMarkItemProps>(
  (
    { children, className, mark, style }: SliderMarkItemProps,
    ref: ForwardedRef<HTMLSpanElement>,
  ): ReactNode => {
    const { isStyled, max, min, values } = useSliderContext('SliderMarkItem')
    const lower = values.length > 1 ? Math.min(...values) : min
    const upper = Math.max(...values)

    return (
      <span
        className={joinClasses(isStyled && styles.mark, className)}
        data-active={mark.value > lower && mark.value < upper ? '' : undefined}
        data-edge={mark.value <= min || mark.value >= max ? '' : undefined}
        data-plume-slider-mark-item=""
        ref={ref}
        style={{ '--slider-mark': fractionOf(mark.value, min, max), ...style } as CSSProperties}
      >
        {children ??
          (mark.label === undefined ? null : <SliderMarkLabel>{mark.label}</SliderMarkLabel>)}
      </span>
    )
  },
)

SliderMarkItem.displayName = 'SliderMarkItem'
