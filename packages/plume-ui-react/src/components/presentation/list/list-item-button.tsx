import type { ForwardedRef, HTMLAttributes } from 'react'
import { forwardRef } from 'react'
import type { ComponentProps } from '../../../theme'
import styles from './list.module.css'

export interface ListItemButtonOwnProps {
  disabled?: boolean
  href?: string
  rel?: string
  selected?: boolean
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

export const ListItemButton = forwardRef<HTMLElement, ListItemButtonProps>(
  (
    {
      'aria-current': ariaCurrent,
      children,
      className = '',
      disabled = false,
      href,
      selected = false,
      style,
      ...rest
    }: ListItemButtonProps,
    ref: ForwardedRef<HTMLElement>,
  ) => {
    const classes = [styles.button, selected && styles.selected, className]
      .filter(Boolean)
      .join(' ')
    const current = ariaCurrent ?? (selected ? 'true' : undefined)

    if (href !== undefined) {
      return (
        <a
          aria-current={current}
          aria-disabled={disabled || undefined}
          className={classes}
          href={disabled ? undefined : href}
          ref={ref as ForwardedRef<HTMLAnchorElement>}
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
