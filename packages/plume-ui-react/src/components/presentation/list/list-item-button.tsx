'use client'

import type { ForwardedRef, HTMLAttributes } from 'react'
import { forwardRef } from 'react'
import { joinClasses } from '../../../overlay/class-names'
import type { ComponentProps } from '../../../theme'
import { useListContext } from './list-context'
import styles from './list.module.css'

export interface ListItemButtonOwnProps {
  /**
   * Disables the item. As a link it loses its `href` and is announced as disabled.
   *
   * @default false
   */
  disabled?: boolean
  /** Renders the item as a link to this address. Without it the item is a `<button>`. */
  href?: string
  /** Relationship of the linked page, for an item that has an `href`. */
  rel?: string
  /**
   * Highlights the item as the current one and sets `aria-current="true"` unless `aria-current` is
   * given.
   *
   * @default false
   */
  selected?: boolean
  /** Where the linked page opens, for an item that has an `href`. */
  target?: string
}

type ListItemButtonRootAttributes = Pick<
  HTMLAttributes<HTMLElement>,
  | 'aria-controls'
  | 'aria-current'
  | 'aria-describedby'
  | 'aria-expanded'
  | 'aria-haspopup'
  | 'aria-label'
  | 'aria-labelledby'
  | 'children'
  | 'hidden'
  | 'id'
  | 'onBlur'
  | 'onClick'
  | 'onFocus'
  | 'onKeyDown'
  | 'tabIndex'
  | 'title'
>

export type ListItemButtonProps = Omit<ComponentProps, 'index'> &
  ListItemButtonRootAttributes &
  ListItemButtonOwnProps

/**
 * Goes inside a `ListItem` and fills it. `selected` highlights it and sets `aria-current="true"`;
 * for navigation pass `aria-current="page"`.
 */
export const ListItemButton = forwardRef<HTMLElement, ListItemButtonProps>(
  (
    {
      'aria-current': ariaCurrent,
      children,
      className,
      disabled = false,
      href,
      selected = false,
      style,
      ...rest
    }: ListItemButtonProps,
    ref: ForwardedRef<HTMLElement>,
  ) => {
    const { isStyled } = useListContext('ListItemButton')
    const classes = joinClasses(
      isStyled && styles.button,
      isStyled && selected && styles.selected,
      className,
    )
    const current = ariaCurrent ?? (selected ? 'true' : undefined)

    if (href !== undefined) {
      return (
        <a
          aria-current={current}
          aria-disabled={disabled || undefined}
          className={classes}
          data-disabled={disabled ? '' : undefined}
          data-plume-list-item-button=""
          data-selected={selected ? '' : undefined}
          href={disabled ? undefined : href}
          ref={ref as ForwardedRef<HTMLAnchorElement>}
          role={disabled ? 'link' : undefined}
          style={style}
          {...rest}
        >
          {children}
        </a>
      )
    }

    return (
      <button
        aria-current={current}
        className={classes}
        data-disabled={disabled ? '' : undefined}
        data-plume-list-item-button=""
        data-selected={selected ? '' : undefined}
        disabled={disabled}
        ref={ref as ForwardedRef<HTMLButtonElement>}
        style={style}
        type="button"
        {...rest}
      >
        {children}
      </button>
    )
  },
)

ListItemButton.displayName = 'ListItemButton'
