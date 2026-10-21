'use client'

import type { AnchorHTMLAttributes, ForwardedRef, MouseEventHandler, ReactNode } from 'react'
import { forwardRef, useContext } from 'react'
import { joinClasses } from '../../../overlay/class-names'
import type { ComponentProps } from '../../../theme'
import { NavLink } from '../shared/nav-link'
import { SidebarStyleContext } from './sidebar-context'
import styles from './sidebar.module.css'

export type SidebarItemPart = 'icon' | 'label'

export interface SidebarItemOwnProps {
  active?: boolean
  classNames?: Partial<Record<SidebarItemPart, string>>
  disabled?: boolean
  icon?: ReactNode
  onClick?: MouseEventHandler<HTMLElement>
}

type SidebarItemRootAttributes = Pick<
  AnchorHTMLAttributes<HTMLAnchorElement>,
  'children' | 'hidden' | 'href' | 'id' | 'rel' | 'target' | 'title'
>

export type SidebarItemProps = Omit<ComponentProps, 'index'> &
  SidebarItemRootAttributes &
  SidebarItemOwnProps

export const SidebarItem = forwardRef<HTMLElement, SidebarItemProps>(
  (
    {
      active = false,
      children,
      className,
      classNames,
      disabled = false,
      icon,
      ...rest
    }: SidebarItemProps,
    ref: ForwardedRef<HTMLElement>,
  ): ReactNode => {
    const { isStyled } = useContext(SidebarStyleContext)

    return (
      <NavLink
        active={active}
        className={joinClasses(isStyled && styles.item, className)}
        dataAttribute="data-plume-sidebar-item"
        disabled={disabled}
        ref={ref}
        {...rest}
      >
        {icon ? (
          <span
            aria-hidden="true"
            className={joinClasses(isStyled && styles.icon, classNames?.icon)}
            data-plume-sidebar-icon=""
          >
            {icon}
          </span>
        ) : null}
        <span
          className={joinClasses(isStyled && styles.label, classNames?.label)}
          data-plume-sidebar-label=""
        >
          {children}
        </span>
      </NavLink>
    )
  },
)

SidebarItem.displayName = 'SidebarItem'
