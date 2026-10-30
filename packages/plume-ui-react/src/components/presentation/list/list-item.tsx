'use client'

import type { ForwardedRef, LiHTMLAttributes } from 'react'
import { forwardRef } from 'react'
import { joinClasses } from '../../../overlay/class-names'
import type { ComponentProps } from '../../../theme'
import { useListContext } from './list-context'
import styles from './list.module.css'

type ListItemRootAttributes = Pick<
  LiHTMLAttributes<HTMLLIElement>,
  'children' | 'hidden' | 'id' | 'title' | 'value'
>

export type ListItemProps = Omit<ComponentProps, 'index'> & ListItemRootAttributes

/**
 * A row that lines up its icon, its text and anything you add after them, like a `Badge` or a
 * switch.
 */
export const ListItem = forwardRef<HTMLLIElement, ListItemProps>(
  ({ children, className, style, ...rest }: ListItemProps, ref: ForwardedRef<HTMLLIElement>) => {
    const { isStyled } = useListContext('ListItem')

    return (
      <li
        className={joinClasses(isStyled && styles.item, className)}
        data-plume-list-item=""
        ref={ref}
        style={style}
        {...rest}
      >
        {children}
      </li>
    )
  },
)

ListItem.displayName = 'ListItem'
