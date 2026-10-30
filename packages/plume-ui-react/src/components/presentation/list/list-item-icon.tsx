'use client'

import type { ForwardedRef, HTMLAttributes } from 'react'
import { forwardRef } from 'react'
import { joinClasses } from '../../../overlay/class-names'
import type { ComponentProps } from '../../../theme'
import { useListContext } from './list-context'
import styles from './list.module.css'

type ListItemIconRootAttributes = Pick<
  HTMLAttributes<HTMLSpanElement>,
  'children' | 'hidden' | 'id'
>

export type ListItemIconProps = Omit<ComponentProps, 'index'> & ListItemIconRootAttributes

/** An icon at the start of the row. It is hidden from screen readers. */
export const ListItemIcon = forwardRef<HTMLSpanElement, ListItemIconProps>(
  (
    { children, className, style, ...rest }: ListItemIconProps,
    ref: ForwardedRef<HTMLSpanElement>,
  ) => {
    const { isStyled } = useListContext('ListItemIcon')

    return (
      <span
        aria-hidden="true"
        className={joinClasses(isStyled && styles.icon, className)}
        data-plume-list-item-icon=""
        ref={ref}
        style={style}
        {...rest}
      >
        {children}
      </span>
    )
  },
)

ListItemIcon.displayName = 'ListItemIcon'
