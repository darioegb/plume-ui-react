'use client'

import type { ForwardedRef, HTMLAttributes, ReactNode } from 'react'
import { forwardRef } from 'react'
import { joinClasses } from '../../../overlay/class-names'
import type { ComponentProps } from '../../../theme'
import { useToastItem } from './toast-item-context'
import styles from './toast.module.css'

type ToastBodyRootAttributes = Pick<HTMLAttributes<HTMLDivElement>, 'children'>

export type ToastBodyProps = Omit<ComponentProps, 'index'> & ToastBodyRootAttributes

/** The wrapper of the text and the action. */
export const ToastBody = forwardRef<HTMLDivElement, ToastBodyProps>(
  (
    { children, className, style }: ToastBodyProps,
    ref: ForwardedRef<HTMLDivElement>,
  ): ReactNode => {
    const { isStyled } = useToastItem('ToastBody')

    return (
      <div
        className={joinClasses(isStyled && styles.content, className)}
        data-plume-toast-body=""
        ref={ref}
        style={style}
      >
        {children}
      </div>
    )
  },
)

ToastBody.displayName = 'ToastBody'
