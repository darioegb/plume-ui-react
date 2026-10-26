'use client'

import type { ForwardedRef, HTMLAttributes, ReactNode } from 'react'
import { forwardRef } from 'react'
import { joinClasses } from '../../../overlay/class-names'
import type { ComponentProps } from '../../../theme'
import { usePaginatorContext } from './paginator-context'
import styles from './paginator.module.css'

type PaginatorSummaryRootAttributes = Pick<HTMLAttributes<HTMLSpanElement>, 'children' | 'id'>

export type PaginatorSummaryProps = Omit<ComponentProps, 'index'> & PaginatorSummaryRootAttributes

/**
 * The range that is shown, such as `11–20 of 54`. Its text is `labels.summary` and its `children`
 * replace it. It renders nothing without a `total` in the `Paginator`.
 */
export const PaginatorSummary = forwardRef<HTMLSpanElement, PaginatorSummaryProps>(
  (
    { children, className, style, ...rest }: PaginatorSummaryProps,
    ref: ForwardedRef<HTMLSpanElement>,
  ): ReactNode => {
    const { current, isStyled, labels, pageSize, total } = usePaginatorContext('PaginatorSummary')
    if (total === undefined) return null

    const from = total === 0 ? 0 : (current - 1) * pageSize + 1
    const to = Math.min(current * pageSize, total)

    return (
      <span
        className={joinClasses(isStyled && styles.summary, className)}
        data-plume-paginator-summary=""
        ref={ref}
        style={style}
        {...rest}
      >
        {children ?? labels.summary(from, to, total)}
      </span>
    )
  },
)

PaginatorSummary.displayName = 'PaginatorSummary'
