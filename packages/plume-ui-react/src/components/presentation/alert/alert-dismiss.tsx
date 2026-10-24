'use client'

import type { ButtonHTMLAttributes, ForwardedRef, ReactNode } from 'react'
import { forwardRef } from 'react'
import { joinClasses } from '../../../overlay/class-names'
import { CloseIcon } from '../../../overlay/icons'
import type { ComponentProps } from '../../../theme'
import { useAlertContext } from './alert-context'
import styles from './alert.module.css'

type AlertDismissRootAttributes = Pick<
  ButtonHTMLAttributes<HTMLButtonElement>,
  'aria-label' | 'children'
>

export type AlertDismissProps = Omit<ComponentProps, 'index'> & AlertDismissRootAttributes

export const AlertDismiss = forwardRef<HTMLButtonElement, AlertDismissProps>(
  (
    { 'aria-label': ariaLabel, children, className, style }: AlertDismissProps,
    ref: ForwardedRef<HTMLButtonElement>,
  ): ReactNode => {
    const { dismiss, isStyled, labels } = useAlertContext('AlertDismiss')

    return (
      <button
        aria-label={ariaLabel ?? labels.dismiss}
        className={joinClasses(isStyled && styles.dismiss, className)}
        data-plume-alert-dismiss=""
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

AlertDismiss.displayName = 'AlertDismiss'
