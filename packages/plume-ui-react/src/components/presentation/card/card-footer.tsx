import type { ForwardedRef, HTMLAttributes } from 'react'
import { forwardRef } from 'react'
import type { ComponentProps } from '../../../theme'
import styles from './card.module.css'

type CardFooterRootAttributes = Pick<
  HTMLAttributes<HTMLDivElement>,
  'children' | 'hidden' | 'id' | 'title'
>

export type CardFooterProps = Omit<ComponentProps, 'index'> & CardFooterRootAttributes

export const CardFooter = forwardRef<HTMLDivElement, CardFooterProps>(
  (
    { children, className = '', style, ...rest }: CardFooterProps,
    ref: ForwardedRef<HTMLDivElement>,
  ) => (
    <div
      className={[styles.footer, className].filter(Boolean).join(' ')}
      ref={ref}
      style={style}
      {...rest}
    >
      {children}
    </div>
  ),
)

CardFooter.displayName = 'CardFooter'
