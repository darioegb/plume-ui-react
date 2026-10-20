'use client'

import type { ForwardedRef, ReactElement, ReactNode } from 'react'
import { forwardRef, isValidElement } from 'react'
import type { ComponentProps } from '../theme'
import { CloseIcon } from './icons'
import { cloneWithProps } from './trigger'

export interface OverlayCloseOwnProps {
  children?: ReactNode
  label?: string
}

export type OverlayCloseProps = Omit<ComponentProps, 'index'> & OverlayCloseOwnProps

interface OverlayCloseInternalProps extends OverlayCloseProps {
  closeClassName?: string
  onClose: () => void
}

export const OverlayClose = forwardRef<HTMLElement, OverlayCloseInternalProps>(
  (
    { children, className = '', closeClassName, label, onClose, style }: OverlayCloseInternalProps,
    ref: ForwardedRef<HTMLElement>,
  ): ReactElement => {
    if (isValidElement(children)) return cloneWithProps(children, { onClick: onClose }, ref)

    const classes = [closeClassName, className].filter(Boolean).join(' ')

    return (
      <button
        aria-label={label ?? (children ? undefined : 'Close')}
        className={classes}
        onClick={onClose}
        ref={ref as ForwardedRef<HTMLButtonElement>}
        style={style}
        type="button"
      >
        {children ?? <CloseIcon />}
      </button>
    )
  },
)

OverlayClose.displayName = 'OverlayClose'
