'use client'

import type { ForwardedRef, HTMLAttributes, ReactNode } from 'react'
import { forwardRef } from 'react'
import { joinClasses } from '../../../overlay/class-names'
import type { ComponentProps } from '../../../theme'
import { useAlertContext } from './alert-context'
import styles from './alert.module.css'

type AlertIconRootAttributes = Pick<HTMLAttributes<HTMLSpanElement>, 'children'>

export type AlertIconProps = Omit<ComponentProps, 'index'> & AlertIconRootAttributes

export const AlertIcon = forwardRef<HTMLSpanElement, AlertIconProps>(
  (
    { children, className, style }: AlertIconProps,
    ref: ForwardedRef<HTMLSpanElement>,
  ): ReactNode => {
    const { icon, isStyled } = useAlertContext('AlertIcon')
    const content = children ?? icon
    if (!content) return null

    return (
      <span
        aria-hidden="true"
        className={joinClasses(isStyled && styles.icon, className)}
        data-plume-alert-icon=""
        ref={ref}
        style={style}
      >
        {content}
      </span>
    )
  },
)

AlertIcon.displayName = 'AlertIcon'
