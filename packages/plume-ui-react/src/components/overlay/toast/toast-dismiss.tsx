'use client'

import type { ButtonHTMLAttributes, ForwardedRef, ReactNode } from 'react'
import { forwardRef } from 'react'
import { joinClasses } from '../../../overlay/class-names'
import { CloseIcon } from '../../../overlay/icons'
import type { ComponentProps } from '../../../theme'
import { useToastItem } from './toast-item-context'
import styles from './toast.module.css'

type ToastDismissRootAttributes = Pick<
  ButtonHTMLAttributes<HTMLButtonElement>,
  'aria-label' | 'children'
>

export type ToastDismissProps = Omit<ComponentProps, 'index'> & ToastDismissRootAttributes

export const ToastDismiss = forwardRef<HTMLButtonElement, ToastDismissProps>(
  (
    { 'aria-label': ariaLabel, children, className, style }: ToastDismissProps,
    ref: ForwardedRef<HTMLButtonElement>,
  ): ReactNode => {
    const { dismiss, dismissLabel, isStyled } = useToastItem('ToastDismiss')

    return (
      <button
        aria-label={ariaLabel ?? dismissLabel}
        className={joinClasses(isStyled && styles.dismiss, className)}
        data-plume-toast-dismiss=""
        onClick={dismiss}
        ref={ref}
        style={style}
        type="button"
      >
        {children ?? <CloseIcon />}
      </button>
    )
  },
)

ToastDismiss.displayName = 'ToastDismiss'
