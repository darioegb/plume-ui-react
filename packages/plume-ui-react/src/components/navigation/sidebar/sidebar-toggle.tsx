'use client'

import type { ButtonHTMLAttributes, ForwardedRef, ReactNode } from 'react'
import { forwardRef } from 'react'
import { joinClasses } from '../../../overlay/class-names'
import { MenuIcon } from '../../../overlay/icons'
import { mergeRefs } from '../../../overlay/trigger'
import type { ComponentProps } from '../../../theme'
import { useSidebarContext } from './sidebar-context'
import styles from './sidebar.module.css'
import { useLabels } from '../../../locale/locale-provider'

export interface SidebarToggleOwnProps {
  icon?: ReactNode
  label?: string
  variant?: 'default' | 'unstyled'
}

type SidebarToggleRootAttributes = Pick<
  ButtonHTMLAttributes<HTMLButtonElement>,
  'children' | 'disabled' | 'id' | 'onClick' | 'title'
>

export type SidebarToggleProps = Omit<ComponentProps, 'index'> &
  SidebarToggleRootAttributes &
  SidebarToggleOwnProps

const DEFAULT_LABELS = { label: 'Toggle sidebar' }

export const SidebarToggle = forwardRef<HTMLButtonElement, SidebarToggleProps>(
  (
    {
      children,
      className,
      icon,
      label,
      onClick,
      style,
      variant = 'default',
      ...rest
    }: SidebarToggleProps,
    ref: ForwardedRef<HTMLButtonElement>,
  ): ReactNode => {
    const text = useLabels('sidebarToggle', DEFAULT_LABELS, { label })
    const { collapsed, isMobile, open, panelId, setCollapsed, setOpen, toggleRef } =
      useSidebarContext('SidebarToggle')
    const expanded = isMobile ? open : !collapsed

    return (
      <button
        aria-controls={panelId}
        aria-expanded={expanded}
        aria-label={text.label}
        className={joinClasses(variant !== 'unstyled' && styles.toggle, className)}
        data-plume-sidebar-toggle=""
        onClick={(event) => {
          onClick?.(event)
          if (event.defaultPrevented) return
          if (isMobile) setOpen(!open)
          else setCollapsed(!collapsed)
        }}
        ref={mergeRefs(ref, (node: HTMLButtonElement | null) => {
          toggleRef.current = node
        })}
        style={style}
        type="button"
        {...rest}
      >
        {children ?? icon ?? <MenuIcon />}
      </button>
    )
  },
)

SidebarToggle.displayName = 'SidebarToggle'
