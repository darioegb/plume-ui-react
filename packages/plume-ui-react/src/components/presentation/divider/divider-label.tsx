import type { ForwardedRef, HTMLAttributes, ReactNode } from 'react'
import { forwardRef } from 'react'
import { joinClasses } from '../../../overlay/class-names'
import type { ComponentProps } from '../../../theme'
import styles from './divider.module.css'

export type DividerLabelProps = Omit<ComponentProps, 'index'> &
  Pick<HTMLAttributes<HTMLSpanElement>, 'children'>

/** The text between the two lines of a horizontal Divider. */
export const DividerLabel = forwardRef<HTMLSpanElement, DividerLabelProps>(
  (
    { children, className, style }: DividerLabelProps,
    ref: ForwardedRef<HTMLSpanElement>,
  ): ReactNode => (
    <span
      className={joinClasses(styles.label, className)}
      data-plume-divider-label=""
      ref={ref}
      style={style}
    >
      {children}
    </span>
  ),
)

DividerLabel.displayName = 'DividerLabel'
