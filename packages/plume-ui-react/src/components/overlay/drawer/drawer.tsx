'use client'

import type { ReactNode } from 'react'
import { useMemo } from 'react'
import { Modal, type ModalProps } from '../modal'
import { DrawerContext, type DrawerSide, type DrawerVariant } from './drawer-context'

export type { DrawerSide, DrawerVariant } from './drawer-context'

export interface DrawerOwnProps {
  side?: DrawerSide
  variant?: DrawerVariant
}

export type DrawerProps = Omit<ModalProps, 'variant'> & DrawerOwnProps

export function Drawer({
  children,
  side = 'right',
  variant = 'default',
  ...rest
}: Readonly<DrawerProps>): ReactNode {
  const context = useMemo(() => ({ side, variant }), [side, variant])

  return (
    <DrawerContext.Provider value={context}>
      <Modal {...rest} variant={variant === 'unstyled' ? 'unstyled' : 'default'}>
        {children}
      </Modal>
    </DrawerContext.Provider>
  )
}
