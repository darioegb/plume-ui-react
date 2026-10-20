'use client'

import type { ForwardedRef, HTMLAttributes, ReactNode } from 'react'
import { forwardRef, useState } from 'react'
import type { ComponentProps } from '../../../theme'
import { Portal, useDismiss, useFocusTrap, useLayer, useScrollLock } from '../../../overlay'
import { mergeRefs } from '../../../overlay/trigger'
import { useModalContext } from './modal-context'
import styles from './modal.module.css'

type ModalContentRootAttributes = Pick<
  HTMLAttributes<HTMLDivElement>,
  'aria-describedby' | 'aria-label' | 'aria-labelledby' | 'children'
>

export type ModalContentProps = Omit<ComponentProps, 'index'> & ModalContentRootAttributes

export const ModalContent = forwardRef<HTMLDivElement, ModalContentProps>(
  (
    { children, className = '', style, ...rest }: ModalContentProps,
    ref: ForwardedRef<HTMLDivElement>,
  ): ReactNode => {
    const context = useModalContext('ModalContent')
    const { closeOnEscape, closeOnOutside, contentId, initialFocus, isStyled, open, setOpen } =
      context
    const [panel, setPanel] = useState<HTMLDivElement | null>(null)
    const isTopmost = useLayer(open)

    useScrollLock(open)
    useDismiss({
      enabled: open,
      onDismiss: () => setOpen(false),
      elements: [panel],
      isTopmost,
      escapeKey: closeOnEscape,
      outsidePress: closeOnOutside,
    })
    useFocusTrap(panel, {
      active: open,
      initialFocus: initialFocus?.current ?? null,
      isTopmost,
      returnFocus: context.trigger,
    })

    if (!open) return null

    const classes = [isStyled && styles.content, isStyled && styles[context.size], className]
      .filter(Boolean)
      .join(' ')
    const labelledBy = rest['aria-labelledby'] ?? (rest['aria-label'] ? undefined : context.titleId)

    return (
      <Portal>
        <div className={isStyled ? styles.backdrop : undefined}>
          <div
            {...rest}
            aria-labelledby={labelledBy}
            aria-modal="true"
            className={classes}
            id={contentId}
            ref={mergeRefs<HTMLDivElement>(setPanel, ref)}
            role="dialog"
            style={style}
          >
            {children}
          </div>
        </div>
      </Portal>
    )
  },
)

ModalContent.displayName = 'ModalContent'
