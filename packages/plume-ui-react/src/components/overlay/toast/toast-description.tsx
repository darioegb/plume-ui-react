'use client'

import type { ForwardedRef, HTMLAttributes, ReactNode } from 'react'
import { forwardRef } from 'react'
import { joinClasses } from '../../../overlay/class-names'
import type { ComponentProps } from '../../../theme'
import { useToastItem } from './toast-item-context'
import styles from './toast.module.css'

type ToastDescriptionRootAttributes = Pick<HTMLAttributes<HTMLSpanElement>, 'children'>

export type ToastDescriptionProps = Omit<ComponentProps, 'index'> & ToastDescriptionRootAttributes

export const ToastDescription = forwardRef<HTMLSpanElement, ToastDescriptionProps>(
  (
    { children, className, style }: ToastDescriptionProps,
    ref: ForwardedRef<HTMLSpanElement>,
  ): ReactNode => {
    const { isStyled, toast } = useToastItem('ToastDescription')
    const content = children ?? toast.description
    if (!content) return null

    return (
      <span
        className={joinClasses(isStyled && styles.description, className)}
        data-plume-toast-description=""
        ref={ref}
        style={style}
      >
        {content}
      </span>
    )
  },
)

ToastDescription.displayName = 'ToastDescription'
