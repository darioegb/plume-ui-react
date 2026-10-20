import type { ForwardedRef, HTMLAttributes } from 'react'
import { forwardRef } from 'react'
import type { ComponentProps } from '../../../theme'
import styles from './list.module.css'

type ListIconRootAttributes = Pick<HTMLAttributes<HTMLSpanElement>, 'children' | 'hidden' | 'id'>

export type ListIconProps = Omit<ComponentProps, 'index'> & ListIconRootAttributes

export const ListIcon = forwardRef<HTMLSpanElement, ListIconProps>(
  (
    { children, className = '', style, ...rest }: ListIconProps,
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

ListIcon.displayName = 'ListIcon'
