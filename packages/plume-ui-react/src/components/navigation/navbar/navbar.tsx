'use client'

import type { CSSProperties, ForwardedRef, HTMLAttributes } from 'react'
import { forwardRef, useCallback, useId, useMemo, useRef, useState } from 'react'
import { joinClasses } from '../../../overlay/class-names'
import { useControllableState } from '../../../overlay/use-controllable-state'
import { useDismiss } from '../../../overlay/use-dismiss'
import { mergeRefs } from '../../../overlay/trigger'
import type { ColorScheme, ComponentProps, Size } from '../../../theme'
import { NavbarContext, type NavbarBreakpoint, type NavbarVariant } from './navbar-context'
import styles from './navbar.module.css'

export interface NavbarOwnProps {
  breakpoint?: NavbarBreakpoint
  colorScheme?: ColorScheme
  defaultOpen?: boolean
  onOpenChange?: (open: boolean) => void
  open?: boolean
  size?: Size
  sticky?: boolean
  variant?: NavbarVariant
}

type NavbarRootAttributes = Pick<
  HTMLAttributes<HTMLElement>,
  'aria-label' | 'aria-labelledby' | 'children' | 'hidden' | 'id' | 'title'
>

export type NavbarProps = Omit<ComponentProps, 'index'> & NavbarRootAttributes & NavbarOwnProps

const navbarColorVars = (colorScheme: ColorScheme, style?: CSSProperties): CSSProperties =>
  ({
    '--navbar-solid': `var(--plume-color-${colorScheme}-solid)`,
    '--navbar-contrast': `var(--plume-color-${colorScheme}-solid-contrast)`,
    '--navbar-solid-active': `var(--plume-color-${colorScheme}-solid-active)`,
    '--navbar-solid-hover': `var(--plume-color-${colorScheme}-solid-hover)`,
    '--navbar-text': `var(--plume-color-${colorScheme}-text)`,
    '--navbar-tint': `var(--plume-color-${colorScheme}-tint)`,
    '--navbar-tint-text': `var(--plume-color-${colorScheme}-tint-text)`,
    ...style,
  }) as CSSProperties

export const Navbar = forwardRef<HTMLElement, NavbarProps>(
  (
    {
      breakpoint = 'md',
      children,
      className,
      colorScheme = 'primary',
      defaultOpen = false,
      id,
      onOpenChange,
      open: openProp,
      size = 'md',
      sticky = false,
      style,
      variant = 'plain',
      ...rest
    }: NavbarProps,
    ref: ForwardedRef<HTMLElement>,
  ) => {
    const generatedId = useId()
    const rootId = id ?? generatedId
    const isStyled = variant !== 'unstyled'
    const [open, setOpen] = useControllableState({
      defaultValue: defaultOpen,
      onChange: onOpenChange,
      value: openProp,
    })
    const [root, setRoot] = useState<HTMLElement | null>(null)
    const toggle = useRef<HTMLButtonElement | null>(null)

    const dismiss = useCallback(
      (reason: 'escape' | 'outside'): void => {
        setOpen(false)
        if (reason === 'escape') toggle.current?.focus()
      },
      [setOpen],
    )
    useDismiss({ elements: [root], enabled: open, onDismiss: dismiss })

    const context = useMemo(
      () => ({
        contentId: `${rootId}-content`,
        isStyled,
        open,
        setOpen,
        toggleRef: toggle,
      }),
      [isStyled, open, rootId, setOpen],
    )

    return (
      <NavbarContext.Provider value={context}>
        <nav
          className={joinClasses(
            isStyled && styles.navbar,
            isStyled && styles[variant],
            isStyled && styles[size],
            className,
          )}
          data-breakpoint={breakpoint}
          data-plume-navbar=""
          data-sticky={sticky ? '' : undefined}
          id={rootId}
          ref={mergeRefs(ref, setRoot)}
          style={navbarColorVars(colorScheme, style)}
          {...rest}
        >
          {children}
        </nav>
      </NavbarContext.Provider>
    )
  },
)

Navbar.displayName = 'Navbar'
