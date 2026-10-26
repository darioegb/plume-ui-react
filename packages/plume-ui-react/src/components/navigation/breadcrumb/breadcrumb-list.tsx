'use client'

import type { ForwardedRef, HTMLAttributes, ReactNode } from 'react'
import { forwardRef } from 'react'
import { joinClasses } from '../../../overlay/class-names'
import type { ComponentProps } from '../../../theme'
import { useBreadcrumbContext } from './breadcrumb-context'
import styles from './breadcrumb.module.css'

type BreadcrumbListRootAttributes = Pick<HTMLAttributes<HTMLOListElement>, 'children' | 'title'>

export type BreadcrumbListProps = Omit<ComponentProps, 'index'> & BreadcrumbListRootAttributes

/**
 * The `<ol>` that holds the items. The `Breadcrumb` wraps its items in one; add it yourself to
 * style the list.
 */
export const BreadcrumbList = forwardRef<HTMLOListElement, BreadcrumbListProps>(
  (
    { children, className, style, ...rest }: BreadcrumbListProps,
    ref: ForwardedRef<HTMLOListElement>,
  ): ReactNode => {
    const { isStyled } = useBreadcrumbContext('BreadcrumbList')

    return (
      <ol
        className={joinClasses(isStyled && styles.list, className)}
        data-plume-breadcrumb-list=""
        ref={ref}
        style={style}
        {...rest}
      >
        {children}
      </ol>
    )
  },
)

BreadcrumbList.displayName = 'BreadcrumbList'
