'use client'

import type { ForwardedRef, HTMLAttributes, ReactNode } from 'react'
import { forwardRef } from 'react'
import { joinClasses } from '../../../overlay/class-names'
import type { ComponentProps } from '../../../theme'
import { useRatingContext } from './rating-context'
import styles from './rating.module.css'

type RatingFilledRootAttributes = Pick<HTMLAttributes<HTMLSpanElement>, 'children'>

export type RatingFilledProps = Omit<ComponentProps, 'index'> & RatingFilledRootAttributes

export const RatingFilled = forwardRef<HTMLSpanElement, RatingFilledProps>(
  (
    { children, className, style }: RatingFilledProps,
    ref: ForwardedRef<HTMLSpanElement>,
  ): ReactNode => {
    const { filledIcon, isStyled } = useRatingContext('RatingFilled')

    return (
      <span
        aria-hidden="true"
        className={joinClasses(isStyled && styles.filled, className)}
        data-plume-rating-filled=""
        ref={ref}
        style={style}
      >
        {children ?? filledIcon}
      </span>
    )
  },
)

RatingFilled.displayName = 'RatingFilled'
