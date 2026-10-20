'use client'

import type { ForwardedRef, HTMLAttributes, KeyboardEvent, ReactNode } from 'react'
import { forwardRef, useEffect } from 'react'
import { Portal, useFocusTrap } from '../../../overlay'
import { useFloatingPanel } from '../../../overlay/use-floating-panel'
import { mergeRefs } from '../../../overlay/trigger'
import { isTypeaheadKey, matchTypeahead, useTypeahead } from '../../../overlay/use-typeahead'
import type { ComponentProps } from '../../../theme'
import { useDropdownContext } from './dropdown-context'
import styles from './dropdown.module.css'

type DropdownMenuRootAttributes = Pick<
  HTMLAttributes<HTMLDivElement>,
  'aria-label' | 'aria-labelledby' | 'children'
>

export type DropdownMenuProps = Omit<ComponentProps, 'index'> & DropdownMenuRootAttributes

const getItems = (menu: HTMLElement): HTMLElement[] =>
  Array.from(menu.querySelectorAll<HTMLElement>('[role="menuitem"]')).filter(
    (item) =>
      item.getAttribute('aria-disabled') !== 'true' && !(item as HTMLButtonElement).disabled,
  )

const focusItem = (item: HTMLElement | undefined): void => item?.focus({ preventScroll: true })

export const DropdownMenu = forwardRef<HTMLDivElement, DropdownMenuProps>(
  (
    { children, className = '', style, ...rest }: DropdownMenuProps,
    ref: ForwardedRef<HTMLDivElement>,
  ): ReactNode => {
    const context = useDropdownContext('DropdownMenu')
    const {
      flip,
      initialItem,
      isStyled,
      menuId,
      offset,
      open,
      placement,
      setOpen,
      shift,
      trigger,
    } = context
    const type = useTypeahead()
    const { isTopmost, panel, position, setPanel } = useFloatingPanel({
      anchor: trigger,
      enabled: open,
      flip,
      offset,
      onDismiss: () => setOpen(false),
      placement,
      shift,
    })

    useFocusTrap(panel, { active: open, isTopmost, returnFocus: trigger })

    useEffect(() => {
      if (!open || !panel) return
      const items = getItems(panel)
      if (initialItem.current === 'first') focusItem(items[0])
      else if (initialItem.current === 'last') focusItem(items[items.length - 1])
    }, [initialItem, open, panel])

    if (!open) return null

    const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>): void => {
      const items = getItems(event.currentTarget)
      const current = items.indexOf(document.activeElement as HTMLElement)
      let next: number | undefined
      if (event.key === 'ArrowDown') next = (current + 1) % items.length
      else if (event.key === 'ArrowUp') next = current <= 0 ? items.length - 1 : current - 1
      else if (event.key === 'Home') next = 0
      else if (event.key === 'End') next = items.length - 1
      else if (event.key === 'Tab') {
        event.preventDefault()
        setOpen(false)
        return
      } else if (isTypeaheadKey(event)) {
        const labels = items.map((item) => item.textContent ?? '')
        const match = matchTypeahead(labels, type(event.key), current)
        if (match >= 0) focusItem(items[match])
        return
      }
      if (next === undefined) return
      event.preventDefault()
      focusItem(items[next])
    }

    const classes = [
      isStyled && styles.menu,
      isStyled && styles[context.size],
      isStyled && styles[context.variant],
      className,
    ]
      .filter(Boolean)
      .join(' ')

    return (
      <Portal>
        <div
          aria-labelledby={
            rest['aria-label'] ? undefined : (rest['aria-labelledby'] ?? trigger?.id)
          }
          {...rest}
          className={classes}
          data-placement={position.placement}
          id={menuId}
          onKeyDown={handleKeyDown}
          ref={mergeRefs<HTMLDivElement>(setPanel, ref)}
          role="menu"
          style={{ ...position.style, opacity: position.isPositioned ? undefined : 0, ...style }}
          tabIndex={-1}
        >
          {children}
        </div>
      </Portal>
    )
  },
)

DropdownMenu.displayName = 'DropdownMenu'
