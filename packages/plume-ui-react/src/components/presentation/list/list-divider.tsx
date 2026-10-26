import type { ForwardedRef, LiHTMLAttributes } from 'react'
import { forwardRef } from 'react'
import type { ComponentProps } from '../../../theme'
import { Divider } from '../divider'
import styles from './list.module.css'

type ListDividerRootAttributes = Pick<LiHTMLAttributes<HTMLLIElement>, 'hidden' | 'id'>

export type ListDividerProps = Omit<ComponentProps, 'index'> & ListDividerRootAttributes

/** A line between two items. It is presentational: it doesn't count as an item of the list. */
export const ListDivider = forwardRef<HTMLLIElement, ListDividerProps>(
  ({ className = '', style, ...rest }: ListDividerProps, ref: ForwardedRef<HTMLLIElement>) => (
    <li
      aria-hidden="true"
      className={[styles.divider, className].filter(Boolean).join(' ')}
      ref={ref}
      style={style}
      {...rest}
    >
      <Divider decorative spacing="sm" />
    </li>
  ),
)

ListDivider.displayName = 'ListDivider'
