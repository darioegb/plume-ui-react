'use client'

import type { ForwardedRef, ReactElement, ReactNode } from 'react'
import { forwardRef, isValidElement } from 'react'
import type { ComponentProps } from '../theme'
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

const closeIcon = (
  <svg
    aria-hidden="true"
    fill="none"
    focusable="false"
    height="1em"
    stroke="currentColor"
    strokeLinecap="round"
    strokeWidth="2"
    viewBox="0 0 24 24"
    width="1em"
  >
    <path d="M6 6l12 12M18 6 6 18" />
  </svg>
)

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
        {children ?? closeIcon}
      </button>
    )
  },
)

OverlayClose.displayName = 'OverlayClose'
