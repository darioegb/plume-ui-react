'use client'

import type { ForwardedRef, HTMLAttributes, ReactNode } from 'react'
import { forwardRef } from 'react'
import { joinClasses } from '../../../overlay/class-names'
import type { ComponentProps } from '../../../theme'
import { useToastItem } from './toast-item-context'
import styles from './toast.module.css'

type ToastTitleRootAttributes = Pick<HTMLAttributes<HTMLSpanElement>, 'children'>

export type ToastTitleProps = Omit<ComponentProps, 'index'> & ToastTitleRootAttributes

export const ToastTitle = forwardRef<HTMLSpanElement, ToastTitleProps>(
  (
    { children, className, style }: ToastTitleProps,
    ref: ForwardedRef<HTMLSpanElement>,
  ): ReactNode => {
    const { isStyled, toast } = useToastItem('ToastTitle')
    const content = children ?? toast.title
    if (!content) return null

    return (
      <span
        className={joinClasses(isStyled && styles.title, className)}
        data-plume-toast-title=""
        ref={ref}
        style={style}
      >
        {content}
      </span>
    )
  },
)

ToastTitle.displayName = 'ToastTitle'
