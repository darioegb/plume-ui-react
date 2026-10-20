'use client'

import type { ForwardedRef, ReactElement, ReactNode } from 'react'
import { forwardRef, isValidElement } from 'react'
import { cloneWithProps, mergeRefs } from '../../../overlay/trigger'
import { usePopoverContext } from './popover-context'

export interface PopoverTriggerProps {
  children: ReactNode
  className?: string
}

export const PopoverTrigger = forwardRef<HTMLElement, PopoverTriggerProps>(
  ({ children, className }: PopoverTriggerProps, ref: ForwardedRef<HTMLElement>): ReactElement => {
    const { open, setOpen, setTrigger } = usePopoverContext('PopoverTrigger')
    const injected = {
      'aria-expanded': open,
      'aria-haspopup': 'dialog' as const,
      onClick: () => setOpen(!open),
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

PopoverTrigger.displayName = 'PopoverTrigger'
