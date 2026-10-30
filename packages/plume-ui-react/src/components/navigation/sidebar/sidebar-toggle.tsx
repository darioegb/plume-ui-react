'use client'

import type { ButtonHTMLAttributes, ForwardedRef, ReactNode } from 'react'
import { forwardRef, useMemo } from 'react'
import { joinClasses } from '../../../overlay/class-names'
import { MenuIcon } from '../../../overlay/icons'
import { mergeRefs } from '../../../overlay/trigger'
import type { ComponentProps } from '../../../theme'
import { useSidebarContext } from './sidebar-context'
import styles from './sidebar.module.css'
import { useLabels } from '../../../locale/locale-provider'

export interface SidebarToggleOwnProps {
  /** Replaces the icon of the button. */
  icon?: ReactNode
  /** The accessible name of the button. */
  label?: string
  /**
   * Visual variant of the button. `unstyled` drops the Plume styles.
   *
   * @default 'default'
   */
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

/**
 * The button that collapses the sidebar on a wide screen and opens it on a small one, with
 * `aria-expanded` and `aria-controls`. `label` is its accessible name (`"Toggle sidebar"`), and
 * `variant="unstyled"` drops the Plume styles.
 */
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
    const { collapsed, isMobile, open, panelId, setCollapsed, setOpen, setToggle } =
      useSidebarContext('SidebarToggle')
    const toggleRef = useMemo(() => mergeRefs(ref, setToggle), [ref, setToggle])
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
        ref={toggleRef}
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
