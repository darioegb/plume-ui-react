import type { ForwardedRef, HTMLAttributes } from 'react'
import { forwardRef } from 'react'
import type { ComponentProps } from '../../../theme'
import styles from './list.module.css'

type ListItemIconRootAttributes = Pick<
  HTMLAttributes<HTMLSpanElement>,
  'children' | 'hidden' | 'id'
>

export type ListItemIconProps = Omit<ComponentProps, 'index'> & ListItemIconRootAttributes

export const ListItemIcon = forwardRef<HTMLSpanElement, ListItemIconProps>(
  (
    { children, className = '', style, ...rest }: ListItemIconProps,
    ref: ForwardedRef<HTMLSpanElement>,
  ) => (
    <span
      aria-hidden="true"
      className={[styles.icon, className].filter(Boolean).join(' ')}
      ref={ref}
      style={style}
      {...rest}
    >
      {children}
    </span>
  ),
)

ListItemIcon.displayName = 'ListItemIcon'
