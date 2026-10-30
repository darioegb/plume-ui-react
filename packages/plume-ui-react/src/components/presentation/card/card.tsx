'use client'

import type { ForwardedRef, HTMLAttributes } from 'react'
import { forwardRef, useMemo } from 'react'
import { joinClasses } from '../../../overlay/class-names'
import type { ComponentProps, Size } from '../../../theme'
import { CardContext } from './card-context'
import styles from './card.module.css'

export interface CardOwnProps {
  /**
   * Size of the Card: the padding of its parts and the size of its text.
   *
   * @default 'md'
   */
  size?: Size
  /**
   * Visual variant. `elevated` floats the Card with a shadow, `outline` draws its border and
   * divides its parts, and `filled` gives it a muted background. `unstyled` drops the Plume styles
   * so you can bring your own.
   *
   * @default 'elevated'
   */
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
    { children, className, size = 'md', style, variant = 'elevated', ...rest }: CardProps,
    ref: ForwardedRef<HTMLDivElement>,
  ) => {
    const isStyled = variant !== 'unstyled'
    const context = useMemo(() => ({ isStyled }), [isStyled])
    const classes = joinClasses(
      isStyled && styles.card,
      isStyled && styles[size],
      isStyled && styles[variant],
      className,
    )

    return (
      <CardContext.Provider value={context}>
        <div className={classes} data-plume-card="" ref={ref} style={style} {...rest}>
          {children}
        </div>
      </CardContext.Provider>
    )
  },
)

Card.displayName = 'Card'
