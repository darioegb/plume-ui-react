'use client'

import type { AnchorHTMLAttributes, ForwardedRef, MouseEventHandler, ReactNode } from 'react'
import { forwardRef } from 'react'
import { joinClasses } from '../../../overlay/class-names'
import type { ComponentProps } from '../../../theme'
import { NavLink } from '../shared/nav-link'
import { useNavbarContext } from './navbar-context'
import styles from './navbar.module.css'

export interface NavbarItemOwnProps {
  active?: boolean
  disabled?: boolean
  onClick?: MouseEventHandler<HTMLElement>
}

type NavbarItemRootAttributes = Pick<
  AnchorHTMLAttributes<HTMLAnchorElement>,
  'children' | 'hidden' | 'href' | 'id' | 'rel' | 'target' | 'title'
>

export type NavbarItemProps = Omit<ComponentProps, 'index'> &
  NavbarItemRootAttributes &
  NavbarItemOwnProps

export const NavbarItem = forwardRef<HTMLElement, NavbarItemProps>(
  (
    { active = false, className, disabled = false, ...rest }: NavbarItemProps,
    ref: ForwardedRef<HTMLElement>,
  ): ReactNode => {
    const { isStyled } = useNavbarContext('NavbarItem')

    return (
      <NavLink
        active={active}
        className={joinClasses(isStyled && styles.item, className)}
        dataAttribute="data-plume-navbar-item"
        disabled={disabled}
        ref={ref}
        {...rest}
      />
    )
  },
)

NavbarItem.displayName = 'NavbarItem'
