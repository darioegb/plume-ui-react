'use client'

import type {
  ButtonHTMLAttributes,
  ForwardedRef,
  MouseEvent,
  ReactElement,
  ReactNode,
} from 'react'
import { forwardRef, isValidElement } from 'react'
import { useLabels } from '../locale/locale-provider'
import type { ComponentProps } from '../theme'
import { joinClasses } from './class-names'
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

interface OverlayCloseInternalProps
  extends OverlayCloseProps,
    Pick<ButtonHTMLAttributes<HTMLButtonElement>, 'aria-labelledby' | 'disabled' | 'id'> {
  [attribute: `data-${string}`]: string | undefined
  closeClassName?: string
  onClose: (event: MouseEvent<HTMLButtonElement>) => void
}

const DEFAULT_LABELS = { label: 'Close' }

export const OverlayClose = forwardRef<HTMLElement, OverlayCloseInternalProps>(
  (
    {
      children,
      className,
      closeClassName,
      label,
      onClose,
      style,
      ...data
    }: OverlayCloseInternalProps,
    ref: ForwardedRef<HTMLElement>,
  ): ReactElement => {
    const text = useLabels('overlayClose', DEFAULT_LABELS, { label })
    if (isValidElement(children))
      return cloneWithProps(children, { ...data, onClick: onClose }, ref)

    return (
      <button
        {...data}
        aria-label={label ?? (children ? undefined : text.label)}
        className={joinClasses(closeClassName, className)}
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
