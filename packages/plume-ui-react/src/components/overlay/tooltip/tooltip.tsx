'use client'

import type { CSSProperties, FocusEvent, PointerEvent, ReactElement, ReactNode } from 'react'
import { useCallback, useEffect, useId, useRef, useState } from 'react'
import type { Placement } from '../../../overlay'
import { Portal, useDismiss, useLayer, usePosition } from '../../../overlay'
import { cloneWithProps } from '../../../overlay/trigger'
import type { Size } from '../../../theme'
import styles from './tooltip.module.css'

export interface TooltipProps {
  /**
   * The element that opens the tooltip, such as a `Button`. It gets the handlers and
   * `aria-describedby`, and it has to be able to take the focus, so keyboard users reach the
   * tooltip too. A plain element needs a `tabIndex`.
   */
  children: ReactElement
  /** Class of the bubble. */
  className?: string
  /**
   * Milliseconds before the tooltip closes when the pointer leaves, which lets it reach the
   * tooltip.
   * @default 100
   */
  closeDelay?: number
  /** What the tooltip says. Keep it short. */
  content: ReactNode
  /**
   * Whether the tooltip is open at first, for an uncontrolled tooltip.
   * @default false
   */
  defaultOpen?: boolean
  /**
   * Turns the tooltip off.
   * @default false
   */
  disabled?: boolean
  /**
   * Distance in pixels between the element and the tooltip.
   * @default 6
   */
  offset?: number
  /** Called with the new state when the tooltip opens or closes. */
  onOpenChange?: (open: boolean) => void
  /** Whether the tooltip is open, for a controlled tooltip. Pair it with `onOpenChange`. */
  open?: boolean
  /**
   * Milliseconds the pointer has to rest on the element before the tooltip opens.
   * @default 300
   */
  openDelay?: number
  /**
   * Where the tooltip appears, relative to the element: a side, with an optional alignment
   * (`top-start`, `bottom-end`). It flips to the opposite side when there is no room.
   * @default 'top'
   */
  placement?: Placement
  /**
   * Size of the text and of the padding of the tooltip.
   * @default 'md'
   */
  size?: Size
  /** Inline style of the bubble. */
  style?: CSSProperties
  /**
   * Visual variant. `solid` is a dark tooltip on a light page and a light one on a dark page,
   * and `outline` is a bordered surface. `unstyled` drops the Plume styles so you can bring your
   * own.
   * @default 'solid'
   */
  variant?: TooltipVariant
}

export type TooltipVariant = 'solid' | 'outline' | 'unstyled'

const isFocusVisible = (element: HTMLElement): boolean => {
  try {
    return element.matches(':focus-visible')
  } catch {
    return true
  }
}

export function Tooltip({
  children,
  className = '',
  closeDelay = 100,
  content,
  defaultOpen = false,
  disabled = false,
  offset = 6,
  onOpenChange,
  open: openProp,
  openDelay = 300,
  placement = 'top',
  size = 'md',
  style,
  variant = 'solid',
}: Readonly<TooltipProps>): ReactNode {
  const tooltipId = useId()
  const [internalOpen, setInternalOpen] = useState(defaultOpen)
  const [trigger, setTrigger] = useState<HTMLElement | null>(null)
  const [panel, setPanel] = useState<HTMLDivElement | null>(null)
  const timer = useRef<number | undefined>(undefined)
  const isControlled = openProp !== undefined
  const open = !disabled && (isControlled ? openProp : internalOpen)
  const isStyled = variant !== 'unstyled'

  const setOpen = useCallback(
    (next: boolean): void => {
      if (!isControlled) setInternalOpen(next)
      if (next !== open) onOpenChange?.(next)
    },
    [isControlled, onOpenChange, open],
  )

  const clearTimer = useCallback((): void => {
    window.clearTimeout(timer.current)
    timer.current = undefined
  }, [])

  const schedule = useCallback(
    (next: boolean, delay: number): void => {
      clearTimer()
      if (delay <= 0) setOpen(next)
      else timer.current = window.setTimeout(() => setOpen(next), delay)
    },
    [clearTimer, setOpen],
  )

  useEffect(() => clearTimer, [clearTimer])

  const isTopmost = useLayer(open, false)
  const position = usePosition({
    anchor: trigger,
    floating: panel,
    enabled: open,
    placement,
    offset,
  })

  useDismiss({
    enabled: open,
    onDismiss: () => {
      clearTimer()
      setOpen(false)
    },
    elements: [trigger, panel],
    isTopmost,
  })

  const describedBy = (existing?: string): string | undefined =>
    [existing, open ? tooltipId : undefined].filter(Boolean).join(' ') || undefined

  const handlers = {
    onBlur: () => {
      clearTimer()
      setOpen(false)
    },
    onFocus: (event: FocusEvent<HTMLElement>) => {
      clearTimer()
      if (isFocusVisible(event.currentTarget)) setOpen(true)
    },
    onPointerEnter: (event: PointerEvent<HTMLElement>) => {
      if (event.pointerType !== 'touch') schedule(true, openDelay)
    },
    onPointerLeave: () => schedule(false, closeDelay),
  }

  const anchorElement = cloneWithProps(
    children,
    {
      ...handlers,
      'aria-describedby': describedBy(
        (children.props as { 'aria-describedby'?: string })['aria-describedby'],
      ),
    },
    setTrigger,
  )

  const classes = [
    isStyled && styles.tooltip,
    isStyled && styles[size],
    isStyled && styles[variant],
    className,
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <>
      {anchorElement}
      {open ? (
        <Portal>
          <div
            className={classes}
            data-placement={position.placement}
            id={tooltipId}
            onPointerEnter={clearTimer}
            onPointerLeave={() => schedule(false, closeDelay)}
            ref={setPanel}
            role="tooltip"
            style={{ ...position.style, opacity: position.isPositioned ? undefined : 0, ...style }}
          >
            {content}
          </div>
        </Portal>
      ) : null}
    </>
  )
}

Tooltip.displayName = 'Tooltip'
