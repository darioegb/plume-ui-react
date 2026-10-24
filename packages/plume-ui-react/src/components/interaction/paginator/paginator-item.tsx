'use client'

import type { ForwardedRef, LiHTMLAttributes, ReactNode } from 'react'
import { forwardRef } from 'react'
import { joinClasses } from '../../../overlay/class-names'
import type { ComponentProps } from '../../../theme'
import { usePaginatorContext } from './paginator-context'
import styles from './paginator.module.css'

type PaginatorItemRootAttributes = Pick<LiHTMLAttributes<HTMLLIElement>, 'children' | 'id'>

export type PaginatorItemProps = Omit<ComponentProps, 'index'> & PaginatorItemRootAttributes

export const PaginatorItem = forwardRef<HTMLLIElement, PaginatorItemProps>(
  (
    { children, className, style, ...rest }: PaginatorItemProps,
    ref: ForwardedRef<HTMLLIElement>,
  ): ReactNode => {
    const { isStyled } = usePaginatorContext('PaginatorItem')

    return (
      <li
        className={joinClasses(isStyled && styles.item, className)}
        data-plume-paginator-item=""
        ref={ref}
        style={style}
        {...rest}
      >
        {children}
      </li>
    )
  },
)

PaginatorItem.displayName = 'PaginatorItem'
