'use client'

import type { ForwardedRef, LiHTMLAttributes } from 'react'
import { forwardRef } from 'react'
import { joinClasses } from '../../../overlay/class-names'
import type { ComponentProps } from '../../../theme'
import { Divider } from '../divider'
import { useListContext } from './list-context'
import styles from './list.module.css'

type ListDividerRootAttributes = Pick<LiHTMLAttributes<HTMLLIElement>, 'hidden' | 'id'>

export type ListDividerProps = Omit<ComponentProps, 'index'> & ListDividerRootAttributes

/**
 * A line between two items. It is presentational: it doesn't count as an item of the list. With the
 * `unstyled` variant it is an empty `<li>` for your classes to draw.
 */
export const ListDivider = forwardRef<HTMLLIElement, ListDividerProps>(
  ({ className, style, ...rest }: ListDividerProps, ref: ForwardedRef<HTMLLIElement>) => {
    const { isStyled } = useListContext('ListDivider')

    return (
      <li
        aria-hidden="true"
        className={joinClasses(isStyled && styles.divider, className)}
        data-plume-list-divider=""
        ref={ref}
        style={style}
        {...rest}
      >
        {isStyled ? <Divider decorative spacing="sm" /> : null}
      </li>
    )
  },
)

ListDivider.displayName = 'ListDivider'
