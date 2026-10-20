'use client'

import type { ForwardedRef, ReactElement, ReactNode } from 'react'
import { forwardRef, isValidElement } from 'react'
import { cloneWithProps, mergeRefs } from '../../../overlay/trigger'
import { useModalContext } from './modal-context'

export interface ModalTriggerProps {
  children: ReactNode
  className?: string
}

export const ModalTrigger = forwardRef<HTMLElement, ModalTriggerProps>(
  ({ children, className }: ModalTriggerProps, ref: ForwardedRef<HTMLElement>): ReactElement => {
    const { open, setOpen, setTrigger } = useModalContext('ModalTrigger')
    const injected = {
      'aria-expanded': open,
      'aria-haspopup': 'dialog' as const,
      onClick: () => setOpen(true),
    }

    if (isValidElement(children)) return cloneWithProps(children, injected, setTrigger, ref)

    return (
      <button
        {...injected}
        className={className}
        ref={mergeRefs<HTMLButtonElement>(setTrigger, ref as ForwardedRef<HTMLButtonElement>)}
        type="button"
      >
        {children}
      </button>
    )
  },
)

ModalTrigger.displayName = 'ModalTrigger'
