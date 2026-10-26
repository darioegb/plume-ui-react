'use client'

import type { ForwardedRef, HTMLAttributes, ReactNode } from 'react'
import { forwardRef } from 'react'
import { joinClasses } from '../../../overlay/class-names'
import type { ComponentProps } from '../../../theme'
import { usePaginatorContext } from './paginator-context'
import styles from './paginator.module.css'

type PaginatorEllipsisRootAttributes = Pick<HTMLAttributes<HTMLSpanElement>, 'children' | 'id'>

export type PaginatorEllipsisProps = Omit<ComponentProps, 'index'> & PaginatorEllipsisRootAttributes

/** The `…` that stands for the folded pages, `aria-hidden`. */
export const PaginatorEllipsis = forwardRef<HTMLSpanElement, PaginatorEllipsisProps>(
  (
    { children, className, style, ...rest }: PaginatorEllipsisProps,
    ref: ForwardedRef<HTMLSpanElement>,
  ): ReactNode => {
    const { isStyled } = usePaginatorContext('PaginatorEllipsis')

    return (
      <span
        aria-hidden="true"
        className={joinClasses(isStyled && styles.ellipsis, className)}
        data-plume-paginator-ellipsis=""
        ref={ref}
        style={style}
        {...rest}
      >
        {children ?? '…'}
      </span>
    )
  },
)

PaginatorEllipsis.displayName = 'PaginatorEllipsis'
