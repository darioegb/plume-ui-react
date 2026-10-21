'use client'

import type { CSSProperties, ForwardedRef, MouseEventHandler, ReactNode } from 'react'
import { forwardRef } from 'react'

export interface NavLinkProps {
  active: boolean
  children?: ReactNode
  className?: string
  dataAttribute: string
  disabled: boolean
  href?: string
  id?: string
  onClick?: MouseEventHandler<HTMLElement>
  rel?: string
  style?: CSSProperties
  target?: string
  title?: string
  hidden?: boolean
}

export const NavLink = forwardRef<HTMLElement, NavLinkProps>(
  (
    {
      active,
      children,
      dataAttribute,
      disabled,
      href,
      onClick,
      rel,
      target,
      ...rest
    }: NavLinkProps,
    ref: ForwardedRef<HTMLElement>,
  ): ReactNode => {
    const common = {
      'aria-current': active ? ('page' as const) : undefined,
      'data-active': active ? '' : undefined,
      'data-disabled': disabled ? '' : undefined,
      [dataAttribute]: '',
      ...rest,
    }

    if (href === undefined) {
      return (
        <button
          {...common}
          disabled={disabled}
          onClick={onClick}
          ref={ref as ForwardedRef<HTMLButtonElement>}
          type="button"
        >
          {children}
        </button>
      )
    }

    return (
      <a
        {...common}
        aria-disabled={disabled || undefined}
        href={disabled ? undefined : href}
        onClick={onClick}
        ref={ref as ForwardedRef<HTMLAnchorElement>}
        rel={rel}
        tabIndex={disabled ? -1 : undefined}
        target={target}
      >
        {children}
      </a>
    )
  },
)

NavLink.displayName = 'NavLink'
