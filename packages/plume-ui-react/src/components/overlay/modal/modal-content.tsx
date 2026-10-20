'use client'

import type { ForwardedRef, HTMLAttributes, ReactNode } from 'react'
import { forwardRef, useState } from 'react'
import type { ComponentProps } from '../../../theme'
import { Portal, useDismiss, useFocusTrap, useLayer, useScrollLock } from '../../../overlay'
import { mergeRefs } from '../../../overlay/trigger'
import { useModalContext } from './modal-context'
import styles from './modal.module.css'

type ModalContentRootAttributes = Pick<
  HTMLAttributes<HTMLDialogElement>,
  'aria-describedby' | 'aria-label' | 'aria-labelledby' | 'children'
>

export type ModalContentProps = Omit<ComponentProps, 'index'> & ModalContentRootAttributes

export const ModalContent = forwardRef<HTMLDialogElement, ModalContentProps>(
  (
    { children, className = '', style, ...rest }: ModalContentProps,
    ref: ForwardedRef<HTMLDialogElement>,
  ): ReactNode => {
    const context = useModalContext('ModalContent')
    const { closeOnEscape, closeOnOutside, contentId, initialFocus, isStyled, open, setOpen } =
      context
    const [panel, setPanel] = useState<HTMLDialogElement | null>(null)
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
          <dialog
            {...rest}
            aria-labelledby={labelledBy}
            aria-modal="true"
            className={classes}
            data-plume-dialog=""
            id={contentId}
            open
            ref={mergeRefs<HTMLDialogElement>(setPanel, ref)}
            style={style}
          >
            {children}
          </dialog>
        </div>
      </Portal>
    )
  },
)

ModalContent.displayName = 'ModalContent'
