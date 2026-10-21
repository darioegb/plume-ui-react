'use client'

import type { ForwardedRef, HTMLAttributes, ReactNode } from 'react'
import { forwardRef } from 'react'
import { joinClasses } from '../../../overlay/class-names'
import type { ComponentProps } from '../../../theme'
import { useBreadcrumbContext } from './breadcrumb-context'
import styles from './breadcrumb.module.css'

type BreadcrumbSeparatorRootAttributes = Pick<HTMLAttributes<HTMLSpanElement>, 'children'>

export type BreadcrumbSeparatorProps = Omit<ComponentProps, 'index'> &
  BreadcrumbSeparatorRootAttributes

export const BreadcrumbSeparator = forwardRef<HTMLSpanElement, BreadcrumbSeparatorProps>(
  (
    { children, className, style, ...rest }: BreadcrumbSeparatorProps,
    ref: ForwardedRef<HTMLSpanElement>,
  ): ReactNode => {
    const { isStyled, separator, separatorClassName } = useBreadcrumbContext('BreadcrumbSeparator')

    return (
      <span
        aria-hidden="true"
        className={joinClasses(isStyled && styles.separator, separatorClassName, className)}
        data-plume-breadcrumb-separator=""
        ref={ref}
        style={style}
        {...rest}
      >
        {children ?? separator}
      </span>
    )
  },
)

BreadcrumbSeparator.displayName = 'BreadcrumbSeparator'
