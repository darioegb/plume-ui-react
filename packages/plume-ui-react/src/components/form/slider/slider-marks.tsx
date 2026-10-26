'use client'

import type { ForwardedRef, ReactNode } from 'react'
import { Fragment, forwardRef } from 'react'
import { joinClasses } from '../../../overlay/class-names'
import type { ComponentProps } from '../../../theme'
import { type SliderMark, useSliderContext } from './slider-context'
import { SliderMarkItem } from './slider-mark-item'
import styles from './slider.module.css'

export interface SliderMarksOwnProps {
  /**
   * A node, or a function that gets each mark and its position and returns what to render for it.
   */
  children?: ReactNode | ((mark: SliderMark, index: number) => ReactNode)
}

export type SliderMarksProps = Omit<ComponentProps, 'index'> & SliderMarksOwnProps

/** The container of the marks. It renders nothing without marks. */
export const SliderMarks = forwardRef<HTMLSpanElement, SliderMarksProps>(
  (
    { children, className, style }: SliderMarksProps,
    ref: ForwardedRef<HTMLSpanElement>,
  ): ReactNode => {
    const { isStyled, marks } = useSliderContext('SliderMarks')
    const isDataDriven = typeof children === 'function' || children === undefined
    if (isDataDriven && marks.length === 0) return null

    const items = isDataDriven
      ? marks.map((mark, index) => (
          <Fragment key={mark.value}>
            {children === undefined ? <SliderMarkItem mark={mark} /> : children(mark, index)}
          </Fragment>
        ))
      : children

    return (
      <span
        aria-hidden="true"
        className={joinClasses(isStyled && styles.marks, className)}
        data-plume-slider-marks=""
        ref={ref}
        style={style}
      >
        {items}
      </span>
    )
  },
)

SliderMarks.displayName = 'SliderMarks'
