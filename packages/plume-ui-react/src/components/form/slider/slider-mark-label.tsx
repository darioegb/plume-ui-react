'use client'

import type { ForwardedRef, HTMLAttributes, ReactNode } from 'react'
import { forwardRef } from 'react'
import { joinClasses } from '../../../overlay/class-names'
import type { ComponentProps } from '../../../theme'
import { useSliderContext } from './slider-context'
import styles from './slider.module.css'

export type SliderMarkLabelProps = Omit<ComponentProps, 'index'> &
  Pick<HTMLAttributes<HTMLSpanElement>, 'children'>

export const SliderMarkLabel = forwardRef<HTMLSpanElement, SliderMarkLabelProps>(
  (
    { children, className, style }: SliderMarkLabelProps,
    ref: ForwardedRef<HTMLSpanElement>,
  ): ReactNode => {
    const { isStyled } = useSliderContext('SliderMarkLabel')

    return (
      <span
        className={joinClasses(isStyled && styles.markLabel, className)}
        data-plume-slider-mark-label=""
        ref={ref}
        style={style}
      >
        {children}
      </span>
    )
  },
)

SliderMarkLabel.displayName = 'SliderMarkLabel'
