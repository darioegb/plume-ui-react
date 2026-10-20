'use client'

import type { ForwardedRef, KeyboardEvent, MouseEvent, ReactElement, ReactNode } from 'react'
import { forwardRef, isValidElement } from 'react'
import { cloneWithProps, mergeRefs } from '../../../overlay/trigger'
import { useDropdownContext } from './dropdown-context'

export interface DropdownTriggerProps {
  children: ReactNode
  className?: string
}

export const DropdownTrigger = forwardRef<HTMLElement, DropdownTriggerProps>(
  ({ children, className }: DropdownTriggerProps, ref: ForwardedRef<HTMLElement>): ReactElement => {
    const { open, openMenu, setOpen, setTrigger, triggerId } = useDropdownContext('DropdownTrigger')
    const ownId = isValidElement(children) ? (children.props as { id?: string }).id : undefined

    const injected = {
      'aria-expanded': open,
      'aria-haspopup': 'menu' as const,
      id: ownId ?? triggerId,
      onClick: (event: MouseEvent): void => {
        if (open) setOpen(false)
        else openMenu(event.detail === 0 ? 'first' : 'none')
      },
      onKeyDown: (event: KeyboardEvent): void => {
        if (event.key === 'ArrowDown') {
          event.preventDefault()
          openMenu('first')
        } else if (event.key === 'ArrowUp') {
          event.preventDefault()
          openMenu('last')
        }
      },
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

DropdownTrigger.displayName = 'DropdownTrigger'
