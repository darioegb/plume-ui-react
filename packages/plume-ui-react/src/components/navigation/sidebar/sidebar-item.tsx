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
  /**
   * Marks the item as the current one, with `aria-current="page"` and `data-active`.
   *
   * @default false
   */
  active?: boolean
  /**
   * Disables the item: it can't be activated and the keyboard skips it.
   *
   * @default false
   */
  disabled?: boolean
  /** Icon shown before the text. It has no effect when the item is composed with parts. */
  icon?: ReactNode
  /** Called when the item is clicked. */
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

/**
 * A link, or a button without `href`. Given text it renders the `icon` and the label; given
 * `SidebarItemIcon` or `SidebarItemLabel` it renders them as written. It has `data-active` and
 * `data-disabled`.
 */
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
