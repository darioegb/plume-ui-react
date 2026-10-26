'use client'

import type { ForwardedRef, ReactElement, ReactNode } from 'react'
import { forwardRef, isValidElement } from 'react'
import { useLabels } from '../locale/locale-provider'
import type { ComponentProps } from '../theme'
import { CloseIcon } from './icons'
import { cloneWithProps } from './trigger'

export interface OverlayCloseOwnProps {
  /**
   * Replaces the corner X icon. An element, such as a `Button`, becomes the close button and
   * gets the click handler.
   */
  children?: ReactNode
  /**
   * The accessible name of the corner X button.
   * @default 'Close'
   */
  label?: string
}

export type OverlayCloseProps = Omit<ComponentProps, 'index'> & OverlayCloseOwnProps

interface OverlayCloseInternalProps extends OverlayCloseProps {
  closeClassName?: string
  onClose: () => void
}

const DEFAULT_LABELS = { label: 'Close' }

export const OverlayClose = forwardRef<HTMLElement, OverlayCloseInternalProps>(
  (
    { children, className = '', closeClassName, label, onClose, style }: OverlayCloseInternalProps,
    ref: ForwardedRef<HTMLElement>,
  ): ReactElement => {
    const text = useLabels('overlayClose', DEFAULT_LABELS, { label })
    if (isValidElement(children)) return cloneWithProps(children, { onClick: onClose }, ref)

    const classes = [closeClassName, className].filter(Boolean).join(' ')

    return (
      <button
        aria-label={label ?? (children ? undefined : text.label)}
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
