'use client'

import type {
  CSSProperties,
  ForwardedRef,
  KeyboardEvent,
  MouseEvent,
  ReactElement,
  ReactNode,
} from 'react'
import { forwardRef, isValidElement } from 'react'
import { joinClasses } from '../../../overlay/class-names'
import { cloneWithProps, mergeRefs } from '../../../overlay/trigger'
import type { ComponentProps } from '../../../theme'
import { useDropdownContext } from './dropdown-context'

export interface DropdownTriggerOwnProps {
  /** The element that opens the menu, such as a `Button`. Text renders a plain `<button>`. */
  children: ReactNode
}

export type DropdownTriggerProps = Omit<ComponentProps, 'index'> & DropdownTriggerOwnProps

/**
 * One element, such as a `Button`, which gets the click and keyboard handlers and the `aria-*`
 * attributes and is what the menu is anchored to. With text, it renders a plain `<button>`. Its
 * `className` and `style` are added to those of the element.
 */
export const DropdownTrigger = forwardRef<HTMLElement, DropdownTriggerProps>(
  (
    { children, className, style }: DropdownTriggerProps,
    ref: ForwardedRef<HTMLElement>,
  ): ReactElement => {
    const { open, openMenu, setOpen, setTrigger, triggerId } = useDropdownContext('DropdownTrigger')
    const childProps = isValidElement(children)
      ? (children.props as { className?: string; id?: string; style?: CSSProperties })
      : undefined

    const injected = {
      'aria-expanded': open,
      'aria-haspopup': 'menu' as const,
      'data-open': open ? '' : undefined,
      'data-plume-dropdown-trigger': '',
      id: childProps?.id ?? triggerId,
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
      ...(className ? { className: joinClasses(childProps?.className, className) } : {}),
      ...(style ? { style: { ...childProps?.style, ...style } } : {}),
    }

    if (isValidElement(children)) return cloneWithProps(children, injected, setTrigger, ref)

    return (
      <button
        {...injected}
        ref={mergeRefs<HTMLButtonElement>(setTrigger, ref as ForwardedRef<HTMLButtonElement>)}
        type="button"
      >
        {children}
      </button>
    )
  },
)

DropdownTrigger.displayName = 'DropdownTrigger'
