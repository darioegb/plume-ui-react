'use client'

import type {
  AnchorHTMLAttributes,
  ElementType,
  ForwardedRef,
  MouseEventHandler,
  ReactNode,
} from 'react'
import { forwardRef, useContext } from 'react'
import { joinClasses } from '../../../overlay/class-names'
import { hasPart } from '../../../overlay/has-part'
import type { ComponentProps } from '../../../theme'
import { NavLink } from '../shared/nav-link'
import { SidebarStyleContext } from './sidebar-context'
import { SidebarItemIcon } from './sidebar-item-icon'
import { SidebarItemLabel } from './sidebar-item-label'
import styles from './sidebar.module.css'

export interface SidebarItemOwnProps {
  active?: boolean
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

const ITEM_PARTS: readonly ElementType[] = [SidebarItemIcon, SidebarItemLabel]

export const SidebarItem = forwardRef<HTMLElement, SidebarItemProps>(
  (
    { active = false, children, className, disabled = false, icon, ...rest }: SidebarItemProps,
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
        {hasPart(children, ITEM_PARTS) ? (
          children
        ) : (
          <>
            {icon ? <SidebarItemIcon>{icon}</SidebarItemIcon> : null}
            <SidebarItemLabel>{children}</SidebarItemLabel>
          </>
        )}
      </NavLink>
    )
  },
)

SidebarItem.displayName = 'SidebarItem'
