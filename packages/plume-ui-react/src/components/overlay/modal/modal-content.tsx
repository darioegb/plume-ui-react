'use client'

import type { ForwardedRef, HTMLAttributes, ReactNode } from 'react'
import { forwardRef, useState } from 'react'
import type { ComponentProps } from '../../../theme'
import { useDismiss, useFocusTrap, useLayer, useScrollLock } from '../../../overlay'
import { joinClasses } from '../../../overlay/class-names'
import { mergeRefs } from '../../../overlay/trigger'
import { ModalBackdrop } from './modal-backdrop'
import { useInModalBackdrop } from './modal-backdrop-context'
import { useModalContext } from './modal-context'
import styles from './modal.module.css'

type ModalContentRootAttributes = Pick<
  HTMLAttributes<HTMLDialogElement>,
  'aria-describedby' | 'aria-label' | 'aria-labelledby' | 'children'
>

export type ModalContentProps = Omit<ComponentProps, 'index'> & ModalContentRootAttributes

export const ModalContent = forwardRef<HTMLDialogElement, ModalContentProps>(
  (
    { children, className, style, ...rest }: ModalContentProps,
    ref: ForwardedRef<HTMLDialogElement>,
  ): ReactNode => {
    const context = useModalContext('ModalContent')
    const { closeOnEscape, closeOnOutside, contentId, initialFocus, isStyled, open, setOpen } =
      context
    const [panel, setPanel] = useState<HTMLDialogElement | null>(null)
    const inBackdrop = useInModalBackdrop()
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

    const classes = joinClasses(
      isStyled && styles.content,
      isStyled && styles[context.size],
      className,
    )
    const labelledBy = rest['aria-labelledby'] ?? (rest['aria-label'] ? undefined : context.titleId)
    const dialog = (
      <dialog
        {...rest}
        aria-labelledby={labelledBy}
        aria-modal="true"
        className={classes}
        data-open=""
        data-plume-dialog=""
        id={contentId}
        open
        ref={mergeRefs<HTMLDialogElement>(setPanel, ref)}
        style={style}
      >
        {children}
      </dialog>
    )

    return inBackdrop ? dialog : <ModalBackdrop>{dialog}</ModalBackdrop>
  },
)

ModalContent.displayName = 'ModalContent'
