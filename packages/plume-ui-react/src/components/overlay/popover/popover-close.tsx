'use client'

import type { ForwardedRef, ReactElement, ReactNode } from 'react'
import { forwardRef, isValidElement } from 'react'
import { cloneWithProps } from '../../../overlay/trigger'
import type { ComponentProps } from '../../../theme'
import { usePopoverContext } from './popover-context'
import styles from './popover.module.css'

export interface PopoverCloseOwnProps {
  children?: ReactNode
  label?: string
}

export type PopoverCloseProps = Omit<ComponentProps, 'index'> & PopoverCloseOwnProps

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

export const PopoverClose = forwardRef<HTMLElement, PopoverCloseProps>(
  (
    { children, className = '', label, style }: PopoverCloseProps,
    ref: ForwardedRef<HTMLElement>,
  ): ReactElement => {
    const { isStyled, setOpen } = usePopoverContext('PopoverClose')
    const onClick = (): void => setOpen(false)

    if (isValidElement(children)) return cloneWithProps(children, { onClick }, ref)

    const classes = [isStyled && styles.close, className].filter(Boolean).join(' ')

    return (
      <button
        aria-label={label ?? (children ? undefined : 'Close')}
        className={classes}
        onClick={onClick}
        ref={ref as ForwardedRef<HTMLButtonElement>}
        style={style}
        type="button"
      >
        {children ?? closeIcon}
      </button>
    )
  },
)

PopoverClose.displayName = 'PopoverClose'
