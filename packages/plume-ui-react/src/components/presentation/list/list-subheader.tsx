import type { ForwardedRef, LiHTMLAttributes } from 'react'
import { forwardRef } from 'react'
import type { ComponentProps } from '../../../theme'
import styles from './list.module.css'

type ListSubheaderRootAttributes = Pick<
  LiHTMLAttributes<HTMLLIElement>,
  'children' | 'hidden' | 'id'
>

export type ListSubheaderProps = Omit<ComponentProps, 'index'> & ListSubheaderRootAttributes

/** A small title for the items that follow. */
export const ListSubheader = forwardRef<HTMLLIElement, ListSubheaderProps>(
  (
    { children, className = '', style, ...rest }: ListSubheaderProps,
    ref: ForwardedRef<HTMLLIElement>,
  ) => (
    <li
      className={[styles.subheader, className].filter(Boolean).join(' ')}
      ref={ref}
      style={style}
      {...rest}
    >
      {children}
    </li>
  ),
)

ListSubheader.displayName = 'ListSubheader'
