'use client'

import type { ForwardedRef, HTMLAttributes, ReactNode } from 'react'
import { forwardRef } from 'react'
import { joinClasses } from '../../../overlay/class-names'
import type { ComponentProps } from '../../../theme'
import { useSliderContext } from './slider-context'
import styles from './slider.module.css'

export type SliderBodyProps = Omit<ComponentProps, 'index'> &
  Pick<HTMLAttributes<HTMLDivElement>, 'children'>

export const SliderBody = forwardRef<HTMLDivElement, SliderBodyProps>(
  (
    { children, className, style }: SliderBodyProps,
    ref: ForwardedRef<HTMLDivElement>,
  ): ReactNode => {
    const { isStyled } = useSliderContext('SliderBody')

    return (
      <div
        className={joinClasses(isStyled && styles.body, className)}
        data-plume-slider-body=""
        ref={ref}
        style={style}
      >
        {children}
      </div>
    )
  },
)

SliderBody.displayName = 'SliderBody'
