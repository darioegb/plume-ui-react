'use client'

import type { ForwardedRef, ReactNode } from 'react'
import { Fragment, forwardRef } from 'react'
import { joinClasses } from '../../../overlay/class-names'
import type { ComponentProps } from '../../../theme'
import { type SliderMark, useSliderContext } from './slider-context'
import { SliderMarkItem } from './slider-mark-item'
import styles from './slider.module.css'

export interface SliderMarksOwnProps {
  children?: ReactNode | ((mark: SliderMark, index: number) => ReactNode)
}

export type SliderMarksProps = Omit<ComponentProps, 'index'> & SliderMarksOwnProps

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
