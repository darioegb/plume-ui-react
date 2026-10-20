import type { ForwardedRef, LiHTMLAttributes } from 'react'
import { forwardRef } from 'react'
import type { ComponentProps } from '../../../theme'
import styles from './list.module.css'

type ListDividerRootAttributes = Pick<LiHTMLAttributes<HTMLLIElement>, 'hidden' | 'id'>

export type ListDividerProps = Omit<ComponentProps, 'index'> & ListDividerRootAttributes

export const ListDivider = forwardRef<HTMLLIElement, ListDividerProps>(
  ({ className = '', style, ...rest }: ListDividerProps, ref: ForwardedRef<HTMLLIElement>) => (
    <li
      className={[styles.divider, className].filter(Boolean).join(' ')}
      ref={ref}
      role="separator"
      style={style}
      {...rest}
    />
  ),
)

ListDivider.displayName = 'ListDivider'
