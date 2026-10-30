'use client'

import type { ForwardedRef, HTMLAttributes } from 'react'
import { forwardRef } from 'react'
import { joinClasses } from '../../../overlay/class-names'
import type { ComponentProps } from '../../../theme'
import { useListContext } from './list-context'
import styles from './list.module.css'

type ListItemTextSecondaryRootAttributes = Pick<
  HTMLAttributes<HTMLSpanElement>,
  'children' | 'hidden' | 'id'
>

export type ListItemTextSecondaryProps = Omit<ComponentProps, 'index'> &
  ListItemTextSecondaryRootAttributes

/** The smaller text of a `ListItemText`, under the main one. */
export const ListItemTextSecondary = forwardRef<HTMLSpanElement, ListItemTextSecondaryProps>(
  (
    { children, className, style, ...rest }: ListItemTextSecondaryProps,
    ref: ForwardedRef<HTMLSpanElement>,
  ) => {
    const { isStyled } = useListContext('ListItemTextSecondary')

    return (
      <span
        className={joinClasses(isStyled && styles.secondary, className)}
        data-plume-list-item-text-secondary=""
        ref={ref}
        style={style}
        {...rest}
      >
        {children}
      </span>
    )
  },
)

ListItemTextSecondary.displayName = 'ListItemTextSecondary'
