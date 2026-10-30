'use client'

import type { ForwardedRef, HTMLAttributes } from 'react'
import { forwardRef } from 'react'
import { joinClasses } from '../../../overlay/class-names'
import type { ComponentProps } from '../../../theme'
import { useCardContext } from './card-context'
import styles from './card.module.css'

type CardBodyRootAttributes = Pick<
  HTMLAttributes<HTMLDivElement>,
  'children' | 'hidden' | 'id' | 'title'
>

export type CardBodyProps = Omit<ComponentProps, 'index'> & CardBodyRootAttributes

/** The content, which takes the free space of the Card. */
export const CardBody = forwardRef<HTMLDivElement, CardBodyProps>(
  ({ children, className, style, ...rest }: CardBodyProps, ref: ForwardedRef<HTMLDivElement>) => {
    const { isStyled } = useCardContext('CardBody')

    return (
      <div
        className={joinClasses(isStyled && styles.body, className)}
        data-plume-card-body=""
        ref={ref}
        style={style}
        {...rest}
      >
        {children}
      </div>
    )
  },
)

CardBody.displayName = 'CardBody'
