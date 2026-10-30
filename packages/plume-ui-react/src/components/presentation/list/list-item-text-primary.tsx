'use client'

import type { ForwardedRef, HTMLAttributes } from 'react'
import { forwardRef } from 'react'
import { joinClasses } from '../../../overlay/class-names'
import type { ComponentProps } from '../../../theme'
import { useListContext } from './list-context'
import styles from './list.module.css'

type ListItemTextPrimaryRootAttributes = Pick<
  HTMLAttributes<HTMLSpanElement>,
  'children' | 'hidden' | 'id'
>

export type ListItemTextPrimaryProps = Omit<ComponentProps, 'index'> &
  ListItemTextPrimaryRootAttributes

/** The main text of a `ListItemText`. */
export const ListItemTextPrimary = forwardRef<HTMLSpanElement, ListItemTextPrimaryProps>(
  (
    { children, className, style, ...rest }: ListItemTextPrimaryProps,
    ref: ForwardedRef<HTMLSpanElement>,
  ) => {
    const { isStyled } = useListContext('ListItemTextPrimary')

    return (
      <span
        className={joinClasses(isStyled && styles.primary, className)}
        data-plume-list-item-text-primary=""
        ref={ref}
        style={style}
        {...rest}
      >
        {children}
      </span>
    )
  },
)

ListItemTextPrimary.displayName = 'ListItemTextPrimary'
