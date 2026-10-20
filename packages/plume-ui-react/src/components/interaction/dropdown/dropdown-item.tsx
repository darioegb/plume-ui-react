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
import type { ComponentProps } from '../../../theme'
import { useDropdownContext } from './dropdown-context'
import styles from './dropdown.module.css'

export interface DropdownItemOwnProps {
  children?: ReactNode
  closeOnSelect?: boolean
  disabled?: boolean
  href?: string
  icon?: ReactNode
  onSelect?: (event: MouseEvent<HTMLElement>) => void
  rel?: string
  shortcut?: ReactNode
  target?: string
}

type DropdownItemRootAttributes = Pick<AnchorHTMLAttributes<HTMLElement>, 'aria-label'>

export type DropdownItemProps = Omit<ComponentProps, 'index'> &
  DropdownItemRootAttributes &
  DropdownItemOwnProps

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

    const content = (
      <>
        {icon ? (
          <span aria-hidden="true" className={context.isStyled ? styles.icon : undefined}>
            {icon}
          </span>
        ) : null}
        <span className={context.isStyled ? styles.label : undefined} data-plume-menu-item-label="">
          {children}
        </span>
        {shortcut ? (
          <span className={context.isStyled ? styles.shortcut : undefined}>{shortcut}</span>
        ) : null}
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
