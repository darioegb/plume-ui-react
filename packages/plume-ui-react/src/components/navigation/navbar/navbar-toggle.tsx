'use client'

import type { ButtonHTMLAttributes, ForwardedRef, ReactNode } from 'react'
import { forwardRef } from 'react'
import { joinClasses } from '../../../overlay/class-names'
import { CloseIcon, MenuIcon } from '../../../overlay/icons'
import { mergeRefs } from '../../../overlay/trigger'
import type { ComponentProps } from '../../../theme'
import { useNavbarContext } from './navbar-context'
import styles from './navbar.module.css'
import { useLabels } from '../../../locale/locale-provider'

export interface NavbarToggleOwnProps {
  /** Replaces the menu and close icons of the button. */
  icon?: ReactNode
  /** The accessible name of the button. */
  label?: string
}

type NavbarToggleRootAttributes = Pick<
  ButtonHTMLAttributes<HTMLButtonElement>,
  'children' | 'disabled' | 'id' | 'onClick' | 'title'
>

export type NavbarToggleProps = Omit<ComponentProps, 'index'> &
  NavbarToggleRootAttributes &
  NavbarToggleOwnProps

const DEFAULT_LABELS = { label: 'Toggle navigation' }

/**
 * The button that opens and closes the content. It is only shown below the breakpoint. `label` is
 * its accessible name (`"Toggle navigation"`), `icon` replaces the menu and close icons, and
 * `children` replaces all of its content.
 */
export const NavbarToggle = forwardRef<HTMLButtonElement, NavbarToggleProps>(
  (
    {
      children,
      className,
      icon,
      label,
      onClick,
      style,
      ...rest
    }: NavbarToggleProps,
    ref: ForwardedRef<HTMLButtonElement>,
  ): ReactNode => {
    const text = useLabels('navbarToggle', DEFAULT_LABELS, { label })
    const { contentId, isStyled, open, setOpen, toggleRef } = useNavbarContext('NavbarToggle')

    return (
      <button
        aria-controls={contentId}
        aria-expanded={open}
        aria-label={text.label}
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
