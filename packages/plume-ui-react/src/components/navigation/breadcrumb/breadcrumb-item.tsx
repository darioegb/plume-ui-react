'use client'

import type { ForwardedRef, HTMLAttributes, ReactNode } from 'react'
import { forwardRef } from 'react'
import { joinClasses } from '../../../overlay/class-names'
import type { ComponentProps } from '../../../theme'
import { useBreadcrumbContext } from './breadcrumb-context'
import { BreadcrumbSeparator } from './breadcrumb-separator'
import styles from './breadcrumb.module.css'

export interface BreadcrumbItemOwnProps {
  /** Replaces the separator of the breadcrumb for this item. `null` removes it. */
  separator?: ReactNode
}

type BreadcrumbItemRootAttributes = Pick<
  HTMLAttributes<HTMLLIElement>,
  'children' | 'hidden' | 'id' | 'title'
>

export type BreadcrumbItemProps = Omit<ComponentProps, 'index'> &
  BreadcrumbItemRootAttributes &
  BreadcrumbItemOwnProps

/**
 * One `<li>`, with the separator after it. `separator` replaces the separator of the breadcrumb for
 * this item, and `null` removes it.
 */
export const BreadcrumbItem = forwardRef<HTMLLIElement, BreadcrumbItemProps>(
  (
    { children, className, separator, style, ...rest }: BreadcrumbItemProps,
    ref: ForwardedRef<HTMLLIElement>,
  ): ReactNode => {
    const { isStyled } = useBreadcrumbContext('BreadcrumbItem')

    return (
      <li
        className={joinClasses(isStyled && styles.item, className)}
        data-plume-breadcrumb-item=""
        ref={ref}
        style={style}
        {...rest}
      >
        {children}
        {separator === null ? null : <BreadcrumbSeparator>{separator}</BreadcrumbSeparator>}
      </li>
    )
  },
)

BreadcrumbItem.displayName = 'BreadcrumbItem'
