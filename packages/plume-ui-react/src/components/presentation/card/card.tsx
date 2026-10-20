import type { ForwardedRef, HTMLAttributes } from 'react'
import { forwardRef } from 'react'
import type { ComponentProps, Size } from '../../../theme'
import styles from './card.module.css'

export interface CardOwnProps {
  size?: Size
  variant?: CardVariant
}

export type CardVariant = 'elevated' | 'outline' | 'filled' | 'unstyled'

type CardRootAttributes = Pick<
  HTMLAttributes<HTMLDivElement>,
  'aria-label' | 'aria-labelledby' | 'children' | 'hidden' | 'id' | 'role' | 'title'
>

export type CardProps = Omit<ComponentProps, 'index'> & CardRootAttributes & CardOwnProps

export const Card = forwardRef<HTMLDivElement, CardProps>(
  (
    { children, className = '', size = 'md', style, variant = 'elevated', ...rest }: CardProps,
    ref: ForwardedRef<HTMLDivElement>,
  ) => {
    const isStyled = variant !== 'unstyled'
    const classes = [
      isStyled && styles.card,
      isStyled && styles[size],
      isStyled && styles[variant],
      className,
    ]
      .filter(Boolean)
      .join(' ')

    return (
      <div className={classes} ref={ref} style={style} {...rest}>
        {children}
      </div>
    )
  },
)

Card.displayName = 'Card'
