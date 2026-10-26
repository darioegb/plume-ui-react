import type { ForwardedRef, HTMLAttributes, ReactNode } from 'react'
import { forwardRef } from 'react'
import { joinClasses } from '../../../overlay/class-names'
import type { ComponentProps } from '../../../theme'
import styles from './emptystate.module.css'

export type EmptyStateActionProps = Omit<ComponentProps, 'index'> &
  Pick<HTMLAttributes<HTMLDivElement>, 'children'>

/** What the user can do about it. */
export const EmptyStateAction = forwardRef<HTMLDivElement, EmptyStateActionProps>(
  (
    { children, className, style }: EmptyStateActionProps,
    ref: ForwardedRef<HTMLDivElement>,
  ): ReactNode => (
    <div
      className={joinClasses(styles.action, className)}
      data-plume-emptystate-action=""
      ref={ref}
      style={style}
    >
      {children}
    </div>
  ),
)

EmptyStateAction.displayName = 'EmptyStateAction'
