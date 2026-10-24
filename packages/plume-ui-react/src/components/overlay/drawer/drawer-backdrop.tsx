'use client'

import type { ForwardedRef, HTMLAttributes, ReactNode } from 'react'
import { forwardRef } from 'react'
import { joinClasses } from '../../../overlay/class-names'
import type { ComponentProps } from '../../../theme'
import { ModalBackdrop } from '../modal'
import { useModalContext } from '../modal/modal-context'
import { useDrawerContext } from './drawer-context'
import styles from './drawer.module.css'

type DrawerBackdropRootAttributes = Pick<HTMLAttributes<HTMLDivElement>, 'children'>

export type DrawerBackdropProps = Omit<ComponentProps, 'index'> & DrawerBackdropRootAttributes

export const DrawerBackdrop = forwardRef<HTMLDivElement, DrawerBackdropProps>(
  ({ className, ...rest }: DrawerBackdropProps, ref: ForwardedRef<HTMLDivElement>): ReactNode => {
    const { side } = useDrawerContext('DrawerBackdrop')
    const { isStyled } = useModalContext('DrawerBackdrop')

    return (
      <ModalBackdrop
        {...rest}
        className={joinClasses(
          isStyled && styles.backdrop,
          isStyled && styles[`${side}Backdrop`],
          className,
        )}
        data-side={side}
        ref={ref}
      />
    )
  },
)

DrawerBackdrop.displayName = 'DrawerBackdrop'
