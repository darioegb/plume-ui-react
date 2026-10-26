'use client'

import type { ForwardedRef, ReactNode } from 'react'
import { forwardRef } from 'react'
import { joinClasses } from '../../../overlay/class-names'
import { ModalContent, type ModalContentProps } from '../modal'
import { useInModalBackdrop } from '../modal/modal-backdrop-context'
import { useModalContext } from '../modal/modal-context'
import { DrawerBackdrop } from './drawer-backdrop'
import { useDrawerContext } from './drawer-context'
import styles from './drawer.module.css'

export type DrawerContentProps = ModalContentProps

/** The panel. It is named by the `DrawerHeader`, or by `aria-label` when there is none. */
export const DrawerContent = forwardRef<HTMLDialogElement, DrawerContentProps>(
  ({ className, ...rest }: DrawerContentProps, ref: ForwardedRef<HTMLDialogElement>): ReactNode => {
    const { shape, side } = useDrawerContext('DrawerContent')
    const { isStyled, size } = useModalContext('DrawerContent')
    const inBackdrop = useInModalBackdrop()

    const panel = (
      <ModalContent
        {...rest}
        className={joinClasses(
          isStyled && styles.drawer,
          isStyled && styles[side],
          isStyled && styles[size],
          isStyled && styles[shape],
          className,
        )}
        data-plume-drawer=""
        data-side={side}
        ref={ref}
      />
    )

    return inBackdrop ? panel : <DrawerBackdrop>{panel}</DrawerBackdrop>
  },
)

DrawerContent.displayName = 'DrawerContent'
