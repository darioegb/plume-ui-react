import type { ForwardedRef, HTMLAttributes } from 'react'
import { forwardRef } from 'react'
import type { ComponentProps } from '../../../theme'
import styles from './card.module.css'

type CardBodyRootAttributes = Pick<
  HTMLAttributes<HTMLDivElement>,
  'children' | 'hidden' | 'id' | 'title'
>

export type CardBodyProps = Omit<ComponentProps, 'index'> & CardBodyRootAttributes

export const CardBody = forwardRef<HTMLDivElement, CardBodyProps>(
  (
    { children, className = '', style, ...rest }: CardBodyProps,
    ref: ForwardedRef<HTMLDivElement>,
  ) => (
    <div
      className={[styles.body, className].filter(Boolean).join(' ')}
      ref={ref}
      style={style}
      {...rest}
    >
      {children}
    </div>
  ),
)

CardBody.displayName = 'CardBody'
