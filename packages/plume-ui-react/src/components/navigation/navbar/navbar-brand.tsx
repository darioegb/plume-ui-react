'use client'

import type { AnchorHTMLAttributes, ForwardedRef, MouseEventHandler, ReactNode } from 'react'
import { forwardRef } from 'react'
import { joinClasses } from '../../../overlay/class-names'
import type { ComponentProps } from '../../../theme'
import { useNavbarContext } from './navbar-context'
import styles from './navbar.module.css'

export interface NavbarBrandOwnProps {
  /** Called when the brand is clicked. */
  onClick?: MouseEventHandler<HTMLElement>
}

type NavbarBrandRootAttributes = Pick<
  AnchorHTMLAttributes<HTMLAnchorElement>,
  'children' | 'hidden' | 'href' | 'id' | 'rel' | 'target' | 'title'
>

export type NavbarBrandProps = Omit<ComponentProps, 'index'> &
  NavbarBrandRootAttributes &
  NavbarBrandOwnProps

/** The name or the logo. A link with `href`, a `<span>` without it. */
export const NavbarBrand = forwardRef<HTMLElement, NavbarBrandProps>(
  (
    { children, className, href, onClick, rel, style, target, ...rest }: NavbarBrandProps,
    ref: ForwardedRef<HTMLElement>,
  ): ReactNode => {
    const { isStyled } = useNavbarContext('NavbarBrand')
    const common = {
      className: joinClasses(isStyled && styles.brand, className),
      'data-plume-navbar-brand': '',
      style,
      ...rest,
    }

    if (href === undefined) {
      return (
        <span {...common} ref={ref}>
          {children}
        </span>
      )
    }

    return (
      <a
        {...common}
        href={href}
        onClick={onClick}
        ref={ref as ForwardedRef<HTMLAnchorElement>}
        rel={rel}
        target={target}
      >
        {children}
      </a>
    )
  },
)

NavbarBrand.displayName = 'NavbarBrand'
