'use client'

import type { ForwardedRef, ReactNode } from 'react'
import { forwardRef } from 'react'
import { joinClasses } from '../../../overlay/class-names'
import { ModalContent, type ModalContentProps } from '../modal'
import { useModalContext } from '../modal/modal-context'
import { useDrawerContext } from './drawer-context'
import styles from './drawer.module.css'

export type DrawerContentProps = ModalContentProps

export const DrawerContent = forwardRef<HTMLDialogElement, DrawerContentProps>(
  (
    { className, classNames, ...rest }: DrawerContentProps,
    ref: ForwardedRef<HTMLDialogElement>,
  ): ReactNode => {
    const { shape, side } = useDrawerContext('DrawerContent')
    const { isStyled, size } = useModalContext('DrawerContent')

    return (
      <ModalContent
        {...rest}
        classNames={{
          ...classNames,
          backdrop: joinClasses(
            isStyled && styles.backdrop,
            isStyled && styles[`${side}Backdrop`],
            classNames?.backdrop,
          ),
        }}
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
  },
)

DrawerContent.displayName = 'DrawerContent'
