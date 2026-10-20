'use client'

import type { ForwardedRef, HTMLAttributes, ReactNode } from 'react'
import { forwardRef, useState } from 'react'
import type { ComponentProps } from '../../../theme'
import { Portal, useDismiss, useFocusTrap, useLayer, usePosition } from '../../../overlay'
import { mergeRefs } from '../../../overlay/trigger'
import { usePopoverContext } from './popover-context'
import styles from './popover.module.css'

type PopoverContentRootAttributes = Pick<
  HTMLAttributes<HTMLDivElement>,
  'aria-describedby' | 'aria-label' | 'aria-labelledby' | 'children'
>

export type PopoverContentProps = Omit<ComponentProps, 'index'> & PopoverContentRootAttributes

export const PopoverContent = forwardRef<HTMLDivElement, PopoverContentProps>(
  (
    { children, className = '', style, ...rest }: PopoverContentProps,
    ref: ForwardedRef<HTMLDivElement>,
  ): ReactNode => {
    const context = usePopoverContext('PopoverContent')
    const { contentId, flip, isStyled, offset, open, placement, setOpen, shift, trigger } = context
    const [panel, setPanel] = useState<HTMLDivElement | null>(null)
    const isTopmost = useLayer(open)
    const position = usePosition({
      anchor: trigger,
      floating: panel,
      enabled: open,
      placement,
      offset,
      flip,
      shift,
    })

    useDismiss({
      enabled: open,
      onDismiss: () => setOpen(false),
      elements: [trigger, panel],
      isTopmost,
    })
    useFocusTrap(panel, { active: open, isTopmost, returnFocus: trigger })

    if (!open) return null

    const classes = [
      isStyled && styles.content,
      isStyled && styles[context.size],
      isStyled && styles[context.variant],
      className,
    ]
      .filter(Boolean)
      .join(' ')

    return (
      <Portal>
        <div
          {...rest}
          className={classes}
          data-placement={position.placement}
          id={contentId}
          ref={mergeRefs<HTMLDivElement>(setPanel, ref)}
          role="dialog"
          style={{ ...position.style, opacity: position.isPositioned ? undefined : 0, ...style }}
        >
          {children}
        </div>
      </Portal>
    )
  },
)

PopoverContent.displayName = 'PopoverContent'
