'use client'

import type { ForwardedRef, HTMLAttributes } from 'react'
import { forwardRef } from 'react'
import { joinClasses } from '../../../overlay/class-names'
import type { ComponentProps } from '../../../theme'
import { useBadgeContext } from './badge-context'
import styles from './badge.module.css'

type BadgeDotRootAttributes = Pick<HTMLAttributes<HTMLSpanElement>, 'hidden' | 'id' | 'title'>

export type BadgeDotProps = Omit<ComponentProps, 'index'> & BadgeDotRootAttributes

/** The status dot, in the color of the text of the Badge. It is `aria-hidden`. */
export const BadgeDot = forwardRef<HTMLSpanElement, BadgeDotProps>(
  ({ className, style, ...rest }: BadgeDotProps, ref: ForwardedRef<HTMLSpanElement>) => {
    const { isStyled } = useBadgeContext('BadgeDot')

    return (
      <span
        aria-hidden="true"
        className={joinClasses(isStyled && styles.dot, className)}
        data-plume-badge-dot=""
        ref={ref}
        style={style}
        {...rest}
      />
    )
  },
)

BadgeDot.displayName = 'BadgeDot'
