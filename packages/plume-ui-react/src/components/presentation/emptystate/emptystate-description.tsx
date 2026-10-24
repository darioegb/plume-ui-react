import type { ForwardedRef, HTMLAttributes, ReactNode } from 'react'
import { forwardRef } from 'react'
import { joinClasses } from '../../../overlay/class-names'
import type { ComponentProps } from '../../../theme'
import styles from './emptystate.module.css'

export type EmptyStateDescriptionProps = Omit<ComponentProps, 'index'> &
  Pick<HTMLAttributes<HTMLParagraphElement>, 'children'>

export const EmptyStateDescription = forwardRef<HTMLParagraphElement, EmptyStateDescriptionProps>(
  (
    { children, className, style }: EmptyStateDescriptionProps,
    ref: ForwardedRef<HTMLParagraphElement>,
  ): ReactNode => (
    <p
      className={joinClasses(styles.description, className)}
      data-plume-emptystate-description=""
      ref={ref}
      style={style}
    >
      {children}
    </p>
  ),
)

EmptyStateDescription.displayName = 'EmptyStateDescription'
