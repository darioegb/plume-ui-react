'use client'

import type { ForwardedRef, ReactNode } from 'react'
import { forwardRef } from 'react'
import { OverlayClose, type OverlayCloseProps } from '../../../overlay/overlay-close'
import { useAlertContext } from './alert-context'
import styles from './alert.module.css'

export type AlertDismissProps = OverlayCloseProps

/**
 * The close button. It dismisses the `Alert`, calls `onDismiss` and takes its name from
 * `labels.dismiss` unless you give it a `label`. An element given as `children`, such as a
 * `Button`, becomes the button.
 */
export const AlertDismiss = forwardRef<HTMLElement, AlertDismissProps>(
  ({ label, ...props }: AlertDismissProps, ref: ForwardedRef<HTMLElement>): ReactNode => {
    const { dismiss, isStyled, labels } = useAlertContext('AlertDismiss')

    return (
      <OverlayClose
        {...props}
        closeClassName={isStyled ? styles.dismiss : undefined}
        data-plume-alert-dismiss=""
        label={label ?? labels.dismiss}
        onClose={dismiss}
        ref={ref}
      />
    )
  },
)

AlertDismiss.displayName = 'AlertDismiss'
