'use client'

import type { ForwardedRef, HTMLAttributes } from 'react'
import { forwardRef } from 'react'
import { joinClasses } from '../../../overlay/class-names'
import type { ComponentProps } from '../../../theme'
import { useCardContext } from './card-context'
import styles from './card.module.css'

type CardFooterRootAttributes = Pick<
  HTMLAttributes<HTMLDivElement>,
  'children' | 'hidden' | 'id' | 'title'
>

export type CardFooterProps = Omit<ComponentProps, 'index'> & CardFooterRootAttributes

/** A row for actions. */
export const CardFooter = forwardRef<HTMLDivElement, CardFooterProps>(
  ({ children, className, style, ...rest }: CardFooterProps, ref: ForwardedRef<HTMLDivElement>) => {
    const { isStyled } = useCardContext('CardFooter')

    return (
      <div
        className={joinClasses(isStyled && styles.footer, className)}
        data-plume-card-footer=""
        ref={ref}
        style={style}
        {...rest}
      >
        {children}
      </div>
    )
  },
)

CardFooter.displayName = 'CardFooter'
