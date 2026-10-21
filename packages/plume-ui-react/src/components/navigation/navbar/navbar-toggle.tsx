'use client'

import type { ButtonHTMLAttributes, ForwardedRef, ReactNode } from 'react'
import { forwardRef } from 'react'
import { joinClasses } from '../../../overlay/class-names'
import { CloseIcon, MenuIcon } from '../../../overlay/icons'
import { mergeRefs } from '../../../overlay/trigger'
import type { ComponentProps } from '../../../theme'
import { useNavbarContext } from './navbar-context'
import styles from './navbar.module.css'

export interface NavbarToggleOwnProps {
  icon?: ReactNode
  label?: string
}

type NavbarToggleRootAttributes = Pick<
  ButtonHTMLAttributes<HTMLButtonElement>,
  'children' | 'disabled' | 'id' | 'onClick' | 'title'
>

export type NavbarToggleProps = Omit<ComponentProps, 'index'> &
  NavbarToggleRootAttributes &
  NavbarToggleOwnProps

export const NavbarToggle = forwardRef<HTMLButtonElement, NavbarToggleProps>(
  (
    {
      children,
      className,
      icon,
      label = 'Toggle navigation',
      onClick,
      style,
      ...rest
    }: NavbarToggleProps,
    ref: ForwardedRef<HTMLButtonElement>,
  ): ReactNode => {
    const { contentId, isStyled, open, setOpen, toggleRef } = useNavbarContext('NavbarToggle')

    return (
      <button
        aria-controls={contentId}
        aria-expanded={open}
        aria-label={label}
        className={joinClasses(isStyled && styles.toggle, className)}
        data-open={open ? '' : undefined}
        data-plume-navbar-toggle=""
        onClick={(event) => {
          onClick?.(event)
          if (!event.defaultPrevented) setOpen(!open)
        }}
        ref={mergeRefs(ref, toggleRef)}
        style={style}
        type="button"
        {...rest}
      >
        {children ?? icon ?? (open ? <CloseIcon /> : <MenuIcon />)}
      </button>
    )
  },
)

NavbarToggle.displayName = 'NavbarToggle'
