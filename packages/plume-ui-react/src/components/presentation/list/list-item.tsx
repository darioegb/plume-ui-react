import type { ForwardedRef, LiHTMLAttributes } from 'react'
import { forwardRef } from 'react'
import type { ComponentProps } from '../../../theme'
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
  (
    { children, className = '', style, ...rest }: ListItemProps,
    ref: ForwardedRef<HTMLLIElement>,
  ) => (
    <li
      className={[styles.item, className].filter(Boolean).join(' ')}
      ref={ref}
      style={style}
      {...rest}
    >
      {children}
    </li>
  ),
)

ListItem.displayName = 'ListItem'
