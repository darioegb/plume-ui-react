'use client'

import type { ForwardedRef, HTMLAttributes } from 'react'
import { forwardRef } from 'react'
import { joinClasses } from '../../../overlay/class-names'
import type { ComponentProps } from '../../../theme'
import { useCardContext } from './card-context'
import styles from './card.module.css'

type CardHeaderRootAttributes = Pick<
  HTMLAttributes<HTMLDivElement>,
  'children' | 'hidden' | 'id' | 'title'
>

export type CardHeaderProps = Omit<ComponentProps, 'index'> & CardHeaderRootAttributes

/** The title area, in a larger and bolder type. */
export const CardHeader = forwardRef<HTMLDivElement, CardHeaderProps>(
  ({ children, className, style, ...rest }: CardHeaderProps, ref: ForwardedRef<HTMLDivElement>) => {
    const { isStyled } = useCardContext('CardHeader')

    return (
      <div
        className={joinClasses(isStyled && styles.header, className)}
        data-plume-card-header=""
        ref={ref}
        style={style}
        {...rest}
      >
        {children}
      </div>
    )
  },
)

CardHeader.displayName = 'CardHeader'
