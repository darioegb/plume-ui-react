'use client'

import type { ForwardedRef, HTMLAttributes, ReactNode } from 'react'
import { forwardRef } from 'react'
import { joinClasses } from '../../../overlay/class-names'
import type { ComponentProps } from '../../../theme'
import { useRatingContext } from './rating-context'
import styles from './rating.module.css'

type RatingEmptyRootAttributes = Pick<HTMLAttributes<HTMLSpanElement>, 'children'>

export type RatingEmptyProps = Omit<ComponentProps, 'index'> & RatingEmptyRootAttributes

/**
 * The outline layer of a star, hidden from assistive technology. Its `children` replace the
 * `emptyIcon` of the rating.
 */
export const RatingEmpty = forwardRef<HTMLSpanElement, RatingEmptyProps>(
  (
    { children, className, style }: RatingEmptyProps,
    ref: ForwardedRef<HTMLSpanElement>,
  ): ReactNode => {
    const { isStyled, outlineIcon } = useRatingContext('RatingEmpty')

    return (
      <span
        aria-hidden="true"
        className={joinClasses(isStyled && styles.empty, className)}
        data-plume-rating-empty=""
        ref={ref}
        style={style}
      >
        {children ?? outlineIcon}
      </span>
    )
  },
)

RatingEmpty.displayName = 'RatingEmpty'
