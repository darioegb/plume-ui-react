'use client'

import type { ForwardedRef, ReactNode } from 'react'
import { forwardRef } from 'react'
import { OverlayClose, type OverlayCloseProps } from '../../../overlay/overlay-close'
import { useToastItem } from './toast-item-context'
import styles from './toast.module.css'

export type ToastDismissProps = OverlayCloseProps

/**
 * The dismiss button. Its name is the `dismiss` label of the `ToastProvider` unless you give it a
 * `label`, and an element given as `children`, such as a `Button`, becomes the button.
 */
export const ToastDismiss = forwardRef<HTMLElement, ToastDismissProps>(
  ({ label, ...props }: ToastDismissProps, ref: ForwardedRef<HTMLElement>): ReactNode => {
    const { dismiss, dismissLabel, isStyled } = useToastItem('ToastDismiss')

    return (
      <OverlayClose
        {...props}
        closeClassName={isStyled ? styles.dismiss : undefined}
        data-plume-toast-dismiss=""
        label={label ?? dismissLabel}
        onClose={dismiss}
        ref={ref}
      />
    )
  },
)

ToastDismiss.displayName = 'ToastDismiss'
