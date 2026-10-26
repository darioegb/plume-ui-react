import type { ForwardedRef, HTMLAttributes, ReactNode } from 'react'
import { forwardRef } from 'react'
import { joinClasses } from '../../../overlay/class-names'
import type { ComponentProps } from '../../../theme'
import styles from './emptystate.module.css'

export type EmptyStateIconProps = Omit<ComponentProps, 'index'> &
  Pick<HTMLAttributes<HTMLSpanElement>, 'children'>

/** The decorative icon, hidden from assistive technology. */
export const EmptyStateIcon = forwardRef<HTMLSpanElement, EmptyStateIconProps>(
  (
    { children, className, style }: EmptyStateIconProps,
    ref: ForwardedRef<HTMLSpanElement>,
  ): ReactNode => (
    <span
      aria-hidden="true"
      className={joinClasses(styles.icon, className)}
      data-plume-emptystate-icon=""
      ref={ref}
      style={style}
    >
      {children}
    </span>
  ),
)

EmptyStateIcon.displayName = 'EmptyStateIcon'
