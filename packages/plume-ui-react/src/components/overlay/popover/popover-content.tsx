'use client'

import type { ForwardedRef, HTMLAttributes, ReactNode } from 'react'
import { forwardRef } from 'react'
import type { ComponentProps } from '../../../theme'
import { Portal, useFocusTrap } from '../../../overlay'
import { useFloatingPanel } from '../../../overlay/use-floating-panel'
import { mergeRefs } from '../../../overlay/trigger'
import { usePopoverContext } from './popover-context'
import styles from './popover.module.css'

type PopoverContentRootAttributes = Pick<
  HTMLAttributes<HTMLDialogElement>,
  'aria-describedby' | 'aria-label' | 'aria-labelledby' | 'children'
>

export type PopoverContentProps = Omit<ComponentProps, 'index'> & PopoverContentRootAttributes

/**
 * The panel, a non-modal `dialog`. Give it an `aria-label` or point `aria-labelledby` to its
 * title.
 */
export const PopoverContent = forwardRef<HTMLDialogElement, PopoverContentProps>(
  (
    { children, className = '', style, ...rest }: PopoverContentProps,
    ref: ForwardedRef<HTMLDialogElement>,
  ): ReactNode => {
    const context = usePopoverContext('PopoverContent')
    const { contentId, flip, isStyled, offset, open, placement, setOpen, shift, trigger } = context
    const { isTopmost, panel, position, setPanel } = useFloatingPanel({
      anchor: trigger,
      enabled: open,
      flip,
      offset,
      onDismiss: () => setOpen(false),
      placement,
      shift,
      tabOut: true,
    })
    useFocusTrap(panel, { active: open, isTopmost, returnFocus: trigger, trap: false })

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
        <dialog
          {...rest}
          className={classes}
          data-placement={position.placement}
          data-plume-dialog=""
          id={contentId}
          open
          ref={mergeRefs<HTMLDialogElement>(setPanel, ref)}
          style={{ ...position.style, opacity: position.isPositioned ? undefined : 0, ...style }}
        >
          {children}
        </dialog>
      </Portal>
    )
  },
)

PopoverContent.displayName = 'PopoverContent'
