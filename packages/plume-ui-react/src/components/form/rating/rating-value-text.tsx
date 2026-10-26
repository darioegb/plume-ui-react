'use client'

import type { ForwardedRef, HTMLAttributes, ReactNode } from 'react'
import { forwardRef } from 'react'
import { visuallyHidden } from '../../../overlay/visually-hidden'
import type { ComponentProps } from '../../../theme'
import { useRatingContext } from './rating-context'

type RatingValueTextRootAttributes = Pick<HTMLAttributes<HTMLSpanElement>, 'children'>

export type RatingValueTextProps = Omit<ComponentProps, 'index'> & RatingValueTextRootAttributes

/**
 * The text of a read only rating (`labels.readOnly`), visually hidden. It renders nothing when the
 * rating is interactive.
 */
export const RatingValueText = forwardRef<HTMLSpanElement, RatingValueTextProps>(
  (
    { children, className, style }: RatingValueTextProps,
    ref: ForwardedRef<HTMLSpanElement>,
  ): ReactNode => {
    const { labels, max, readOnly, value } = useRatingContext('RatingValueText')
    if (!readOnly) return null

    return (
      <span
        className={className}
        data-plume-rating-value-text=""
        ref={ref}
        style={{ ...visuallyHidden, ...style }}
      >
        {children ?? labels.readOnly(value, max)}
      </span>
    )
  },
)

RatingValueText.displayName = 'RatingValueText'
