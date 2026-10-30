'use client'

import type { ForwardedRef, LiHTMLAttributes } from 'react'
import { forwardRef } from 'react'
import { joinClasses } from '../../../overlay/class-names'
import type { ComponentProps } from '../../../theme'
import { useListContext } from './list-context'
import styles from './list.module.css'

type ListSubheaderRootAttributes = Pick<
  LiHTMLAttributes<HTMLLIElement>,
  'children' | 'hidden' | 'id'
>

export type ListSubheaderProps = Omit<ComponentProps, 'index'> & ListSubheaderRootAttributes

/** A small title for the items that follow. */
export const ListSubheader = forwardRef<HTMLLIElement, ListSubheaderProps>(
  (
    { children, className, style, ...rest }: ListSubheaderProps,
    ref: ForwardedRef<HTMLLIElement>,
  ) => {
    const { isStyled } = useListContext('ListSubheader')

    return (
      <li
        className={joinClasses(isStyled && styles.subheader, className)}
        data-plume-list-subheader=""
        ref={ref}
        style={style}
        {...rest}
      >
        {children}
      </li>
    )
  },
)

ListSubheader.displayName = 'ListSubheader'
