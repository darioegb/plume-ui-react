import type { ForwardedRef, HTMLAttributes, ReactNode } from 'react'
import { forwardRef } from 'react'
import { joinClasses } from '../../../overlay/class-names'
import type { ComponentProps } from '../../../theme'
import styles from './emptystate.module.css'

export type EmptyStateTitleTag = 'div' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6'

export interface EmptyStateTitleOwnProps {
  as?: EmptyStateTitleTag
}

export type EmptyStateTitleProps = Omit<ComponentProps, 'index'> &
  Pick<HTMLAttributes<HTMLElement>, 'children'> &
  EmptyStateTitleOwnProps

export const EmptyStateTitle = forwardRef<HTMLElement, EmptyStateTitleProps>(
  (
    { as: Tag = 'div', children, className, style }: EmptyStateTitleProps,
    ref: ForwardedRef<HTMLElement>,
  ): ReactNode => (
    <Tag
      className={joinClasses(styles.title, className)}
      data-plume-emptystate-title=""
      ref={ref as ForwardedRef<HTMLDivElement>}
      style={style}
    >
      {children}
    </Tag>
  ),
)

EmptyStateTitle.displayName = 'EmptyStateTitle'
