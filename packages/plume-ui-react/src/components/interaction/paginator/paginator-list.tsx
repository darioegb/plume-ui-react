'use client'

import type { ForwardedRef, HTMLAttributes, ReactNode } from 'react'
import { forwardRef } from 'react'
import { joinClasses } from '../../../overlay/class-names'
import type { ComponentProps } from '../../../theme'
import { usePaginatorContext } from './paginator-context'
import { PaginatorFirst } from './paginator-first'
import { PaginatorItem } from './paginator-item'
import { PaginatorLast } from './paginator-last'
import { PaginatorNext } from './paginator-next'
import { PaginatorPages } from './paginator-pages'
import { PaginatorPrevious } from './paginator-previous'
import styles from './paginator.module.css'

type PaginatorListRootAttributes = Pick<HTMLAttributes<HTMLUListElement>, 'children' | 'id'>

export type PaginatorListProps = Omit<ComponentProps, 'index'> & PaginatorListRootAttributes

/**
 * The `<ul>`. Without children it builds the default: the edges, the previous button, the pages and
 * the next button, each in a `PaginatorItem`.
 */
export const PaginatorList = forwardRef<HTMLUListElement, PaginatorListProps>(
  (
    { children, className, style, ...rest }: PaginatorListProps,
    ref: ForwardedRef<HTMLUListElement>,
  ): ReactNode => {
    const { isStyled, showEdges } = usePaginatorContext('PaginatorList')

    return (
      <ul
        className={joinClasses(isStyled && styles.list, className)}
        data-plume-paginator-list=""
        ref={ref}
        style={style}
        {...rest}
      >
        {children ?? (
          <>
            {showEdges ? (
              <PaginatorItem>
                <PaginatorFirst />
              </PaginatorItem>
            ) : null}
            <PaginatorItem>
              <PaginatorPrevious />
            </PaginatorItem>
            <PaginatorPages />
            <PaginatorItem>
              <PaginatorNext />
            </PaginatorItem>
            {showEdges ? (
              <PaginatorItem>
                <PaginatorLast />
              </PaginatorItem>
            ) : null}
          </>
        )}
      </ul>
    )
  },
)

PaginatorList.displayName = 'PaginatorList'
