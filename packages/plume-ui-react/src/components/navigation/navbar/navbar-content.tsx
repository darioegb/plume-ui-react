'use client'

import type { ForwardedRef, HTMLAttributes, ReactNode } from 'react'
import { forwardRef } from 'react'
import { joinClasses } from '../../../overlay/class-names'
import type { ComponentProps } from '../../../theme'
import { useNavbarContext } from './navbar-context'
import styles from './navbar.module.css'

export interface NavbarContentOwnProps {
  align?: 'start' | 'center' | 'end'
}

type NavbarContentRootAttributes = Pick<
  HTMLAttributes<HTMLDivElement>,
  'children' | 'hidden' | 'id' | 'title'
>

export type NavbarContentProps = Omit<ComponentProps, 'index'> &
  NavbarContentRootAttributes &
  NavbarContentOwnProps

export const NavbarContent = forwardRef<HTMLDivElement, NavbarContentProps>(
  (
    { align = 'start', children, className, id, style, ...rest }: NavbarContentProps,
    ref: ForwardedRef<HTMLDivElement>,
  ): ReactNode => {
    const { contentId, isStyled, open } = useNavbarContext('NavbarContent')

    return (
      <div
        className={joinClasses(isStyled && styles.content, className)}
        data-align={align}
        data-open={open ? '' : undefined}
        data-plume-navbar-content=""
        id={id ?? contentId}
        ref={ref}
        style={style}
        {...rest}
      >
        {children}
      </div>
    )
  },
)

NavbarContent.displayName = 'NavbarContent'
