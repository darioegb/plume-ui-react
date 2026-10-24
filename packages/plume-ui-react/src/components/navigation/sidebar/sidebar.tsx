'use client'

import type { CSSProperties, ForwardedRef, HTMLAttributes, ReactNode } from 'react'
import { Children, forwardRef, isValidElement, useMemo, useState } from 'react'
import { joinClasses } from '../../../overlay/class-names'
import { useDismiss } from '../../../overlay/use-dismiss'
import { useFocusTrap } from '../../../overlay/use-focus-trap'
import { useLayer } from '../../../overlay/layer'
import { useScrollLock } from '../../../overlay/use-scroll-lock'
import { mergeRefs } from '../../../overlay/trigger'
import type { ColorScheme, ComponentProps, Size } from '../../../theme'
import { SidebarBackdrop } from './sidebar-backdrop'
import {
  SidebarStyleContext,
  type SidebarSide,
  type SidebarVariant,
  useSidebarContext,
} from './sidebar-context'
import styles from './sidebar.module.css'

export interface SidebarOwnProps {
  colorScheme?: ColorScheme
  side?: SidebarSide
  size?: Size
  variant?: SidebarVariant
}

type SidebarRootAttributes = Pick<
  HTMLAttributes<HTMLDivElement>,
  'aria-label' | 'aria-labelledby' | 'children' | 'hidden' | 'title'
>

export type SidebarProps = Omit<ComponentProps, 'index'> & SidebarRootAttributes & SidebarOwnProps

const sidebarColorVars = (colorScheme: ColorScheme, style?: CSSProperties): CSSProperties =>
  ({
    '--sidebar-contrast': `var(--plume-color-${colorScheme}-solid-contrast)`,
    '--sidebar-solid': `var(--plume-color-${colorScheme}-solid)`,
    '--sidebar-solid-active': `var(--plume-color-${colorScheme}-solid-active)`,
    '--sidebar-solid-hover': `var(--plume-color-${colorScheme}-solid-hover)`,
    '--sidebar-text': `var(--plume-color-${colorScheme}-text)`,
    '--sidebar-tint': `var(--plume-color-${colorScheme}-tint)`,
    '--sidebar-tint-text': `var(--plume-color-${colorScheme}-tint-text)`,
    ...style,
  }) as CSSProperties

const isBackdrop = (node: ReactNode): boolean =>
  isValidElement(node) && node.type === SidebarBackdrop

export const Sidebar = forwardRef<HTMLDivElement, SidebarProps>(
  (
    {
      'aria-label': ariaLabel,
      'aria-labelledby': ariaLabelledBy,
      children,
      className,
      colorScheme = 'primary',
      side = 'left',
      size = 'md',
      style,
      variant = 'plain',
      ...rest
    }: SidebarProps,
    ref: ForwardedRef<HTMLDivElement>,
  ) => {
    const { breakpoint, collapsed, isMobile, open, panelId, setOpen, toggleRef } =
      useSidebarContext('Sidebar')
    const isStyled = variant !== 'unstyled'
    const modal = isMobile && open
    const [panel, setPanel] = useState<HTMLDivElement | null>(null)
    const isTopmost = useLayer(modal)

    useDismiss({
      enabled: modal,
      isTopmost,
      onDismiss: () => setOpen(false),
      outsidePress: false,
      elements: [panel],
    })
    useFocusTrap(panel, { active: modal, isTopmost, returnFocus: toggleRef.current })
    useScrollLock(modal)

    const styleContext = useMemo(() => ({ isStyled }), [isStyled])
    const nodes = Children.toArray(children)
    const backdrops = nodes.filter(isBackdrop)
    const content = nodes.filter((node) => !isBackdrop(node))
    const modalProps = modal
      ? {
          'aria-label': ariaLabel,
          'aria-labelledby': ariaLabelledBy,
          'aria-modal': true,
          role: 'dialog',
        }
      : {}

    return (
      <SidebarStyleContext.Provider value={styleContext}>
        {backdrops.length > 0 ? backdrops : <SidebarBackdrop />}
        <div
          className={joinClasses(
            isStyled && styles.sidebar,
            isStyled && styles[variant],
            isStyled && styles[size],
            className,
          )}
          data-breakpoint={breakpoint}
          data-collapsed={collapsed ? '' : undefined}
          data-open={open ? '' : undefined}
          data-plume-sidebar=""
          data-side={side}
          id={panelId}
          ref={mergeRefs(ref, setPanel)}
          style={sidebarColorVars(colorScheme, style)}
          {...modalProps}
          {...rest}
        >
          {content}
        </div>
      </SidebarStyleContext.Provider>
    )
  },
)

Sidebar.displayName = 'Sidebar'
