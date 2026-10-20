'use client'

import type { ForwardedRef, ReactElement, ReactNode } from 'react'
import { forwardRef, isValidElement } from 'react'
import { cloneWithProps } from '../../../overlay/trigger'
import type { ComponentProps } from '../../../theme'
import { useModalContext } from './modal-context'
import styles from './modal.module.css'

export interface ModalCloseOwnProps {
  children?: ReactNode
  label?: string
}

export type ModalCloseProps = Omit<ComponentProps, 'index'> & ModalCloseOwnProps

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

export const ModalClose = forwardRef<HTMLElement, ModalCloseProps>(
  (
    { children, className = '', label, style }: ModalCloseProps,
    ref: ForwardedRef<HTMLElement>,
  ): ReactElement => {
    const { isStyled, setOpen } = useModalContext('ModalClose')
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

ModalClose.displayName = 'ModalClose'
