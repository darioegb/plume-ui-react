'use client'

import type { ForwardedRef, HTMLAttributes, ReactNode } from 'react'
import { forwardRef } from 'react'
import { joinClasses } from '../../../overlay/class-names'
import type { ComponentProps } from '../../../theme'
import { useToastItem } from './toast-item-context'
import styles from './toast.module.css'

type ToastIconRootAttributes = Pick<HTMLAttributes<HTMLSpanElement>, 'children'>

export type ToastIconProps = Omit<ComponentProps, 'index'> & ToastIconRootAttributes

export const ToastIcon = forwardRef<HTMLSpanElement, ToastIconProps>(
  (
    { children, className, style }: ToastIconProps,
    ref: ForwardedRef<HTMLSpanElement>,
  ): ReactNode => {
    const { icon, isStyled } = useToastItem('ToastIcon')
    const content = children ?? icon
    if (!content) return null

    return (
      <span
        aria-hidden="true"
        className={joinClasses(isStyled && styles.icon, className)}
        data-plume-toast-icon=""
        ref={ref}
        style={style}
      >
        {content}
      </span>
    )
  },
)

ToastIcon.displayName = 'ToastIcon'
