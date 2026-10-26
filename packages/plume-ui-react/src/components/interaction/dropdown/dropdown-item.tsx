'use client'

import type {
  AnchorHTMLAttributes,
  ForwardedRef,
  KeyboardEvent,
  MouseEvent,
  PointerEvent,
  ReactNode,
} from 'react'
import { forwardRef } from 'react'
import { hasPart } from '../../../overlay/has-part'
import type { ComponentProps } from '../../../theme'
import { useDropdownContext } from './dropdown-context'
import { DropdownItemIcon } from './dropdown-item-icon'
import { DropdownItemLabel } from './dropdown-item-label'
import { DropdownItemShortcut } from './dropdown-item-shortcut'
import styles from './dropdown.module.css'

const ITEM_PARTS = [DropdownItemIcon, DropdownItemLabel, DropdownItemShortcut]

export interface DropdownItemOwnProps {
  /**
   * The text of the item, or the `DropdownItemIcon`, `DropdownItemLabel` and `DropdownItemShortcut`
   * parts.
   */
  children?: ReactNode
  /**
   * Whether selecting this item closes the menu. It overrides the `closeOnSelect` of the
   * `Dropdown`.
   */
  closeOnSelect?: boolean
  /**
   * Disables the item: it can't be selected and the keyboard skips it.
   *
   * @default false
   */
  disabled?: boolean
  /** Renders the item as a link to this URL instead of an action. */
  href?: string
  /** Icon shown before the text. It has no effect when the item is composed with parts. */
  icon?: ReactNode
  /** Called when the item is selected with a click or the keyboard. */
  onSelect?: (event: MouseEvent<HTMLElement>) => void
  /** The `rel` of the link, when the item has an `href`. */
  rel?: string
  /**
   * Keyboard shortcut shown after the text. It has no effect when the item is composed with parts.
   */
  shortcut?: ReactNode
  /** The `target` of the link, when the item has an `href`. */
  target?: string
}

type DropdownItemRootAttributes = Pick<AnchorHTMLAttributes<HTMLElement>, 'aria-label'>

export type DropdownItemProps = Omit<ComponentProps, 'index'> &
  DropdownItemRootAttributes &
  DropdownItemOwnProps

/**
 * An action. With `href` it is a link. Given `DropdownItemIcon`, `DropdownItemLabel` or
 * `DropdownItemShortcut` as children it renders them as written, and `icon` and `shortcut` have no
 * effect.
 */
export const DropdownItem = forwardRef<HTMLElement, DropdownItemProps>(
  (
    {
      children,
      className = '',
      closeOnSelect,
      disabled = false,
      href,
      icon,
      onSelect,
      rel,
      shortcut,
      style,
      target,
      ...rest
    }: DropdownItemProps,
    ref: ForwardedRef<HTMLElement>,
  ): ReactNode => {
    const context = useDropdownContext('DropdownItem')
    const classes = [context.isStyled && styles.item, className].filter(Boolean).join(' ')

    const handleClick = (event: MouseEvent<HTMLElement>): void => {
      if (disabled) {
        event.preventDefault()
        return
      }
      onSelect?.(event)
      if (!event.defaultPrevented && (closeOnSelect ?? context.closeOnSelect)) {
        context.setOpen(false)
      }
    }

    const handlePointerMove = (event: PointerEvent<HTMLElement>): void => {
      if (!disabled && document.activeElement !== event.currentTarget) {
        event.currentTarget.focus({ preventScroll: true })
      }
    }

    const content = hasPart(children, ITEM_PARTS) ? (
      children
    ) : (
      <>
        {icon ? <DropdownItemIcon>{icon}</DropdownItemIcon> : null}
        <DropdownItemLabel>{children}</DropdownItemLabel>
        {shortcut ? <DropdownItemShortcut>{shortcut}</DropdownItemShortcut> : null}
      </>
    )

    if (href !== undefined) {
      const handleKeyDown = (event: KeyboardEvent<HTMLAnchorElement>): void => {
        if (event.key !== ' ') return
        event.preventDefault()
        event.currentTarget.click()
      }
      return (
        <a
          {...rest}
          aria-disabled={disabled || undefined}
          className={classes}
          data-plume-menu-item=""
          href={disabled ? undefined : href}
          onClick={handleClick}
          onKeyDown={handleKeyDown}
          onPointerMove={handlePointerMove}
          ref={ref as ForwardedRef<HTMLAnchorElement>}
          rel={rel}
          role="menuitem"
          style={style}
          tabIndex={-1}
          target={target}
        >
          {content}
        </a>
      )
    }

    return (
      <button
        {...rest}
        className={classes}
        data-plume-menu-item=""
        disabled={disabled}
        onClick={handleClick}
        onPointerMove={handlePointerMove}
        ref={ref as ForwardedRef<HTMLButtonElement>}
        role="menuitem"
        style={style}
        tabIndex={-1}
        type="button"
      >
        {content}
      </button>
    )
  },
)

DropdownItem.displayName = 'DropdownItem'
