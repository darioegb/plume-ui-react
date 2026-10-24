'use client'

import type { ButtonHTMLAttributes, ForwardedRef, ReactNode } from 'react'
import { forwardRef } from 'react'
import { joinClasses } from '../../../overlay/class-names'
import type { ComponentProps } from '../../../theme'
import { useToastItem } from './toast-item-context'
import styles from './toast.module.css'

type ToastActionButtonRootAttributes = Pick<ButtonHTMLAttributes<HTMLButtonElement>, 'children'>

export type ToastActionButtonProps = Omit<ComponentProps, 'index'> & ToastActionButtonRootAttributes

export const ToastActionButton = forwardRef<HTMLButtonElement, ToastActionButtonProps>(
  (
    { children, className, style }: ToastActionButtonProps,
    ref: ForwardedRef<HTMLButtonElement>,
  ): ReactNode => {
    const { isStyled, onAction, toast } = useToastItem('ToastActionButton')
    if (!toast.action) return null

    return (
      <button
        className={joinClasses(isStyled && styles.action, className)}
        data-plume-toast-action=""
        onClick={onAction}
        ref={ref}
        style={style}
        type="button"
      >
        {children ?? toast.action.label}
      </button>
    )
  },
)

ToastActionButton.displayName = 'ToastActionButton'
