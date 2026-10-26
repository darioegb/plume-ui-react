import type { ForwardedRef, HTMLAttributes } from 'react'
import { forwardRef } from 'react'
import type { ComponentProps } from '../../../theme'
import styles from './card.module.css'

type CardHeaderRootAttributes = Pick<
  HTMLAttributes<HTMLDivElement>,
  'children' | 'hidden' | 'id' | 'title'
>

export type CardHeaderProps = Omit<ComponentProps, 'index'> & CardHeaderRootAttributes

/** The title area, in a larger and bolder type. */
export const CardHeader = forwardRef<HTMLDivElement, CardHeaderProps>(
  (
    { children, className = '', style, ...rest }: CardHeaderProps,
    ref: ForwardedRef<HTMLDivElement>,
  ) => (
    <div
      className={[styles.header, className].filter(Boolean).join(' ')}
      ref={ref}
      style={style}
      {...rest}
    >
      {children}
    </div>
  ),
)

CardHeader.displayName = 'CardHeader'
