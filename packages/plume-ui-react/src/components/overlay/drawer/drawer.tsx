'use client'

import type { ReactNode } from 'react'
import { useMemo } from 'react'
import { Modal, type ModalProps } from '../modal'
import { DrawerContext, type DrawerSide } from './drawer-context'

export type { DrawerSide } from './drawer-context'

export interface DrawerOwnProps {
  side?: DrawerSide
}

export type DrawerProps = ModalProps & DrawerOwnProps

export function Drawer({ children, side = 'right', ...rest }: Readonly<DrawerProps>): ReactNode {
  const context = useMemo(() => ({ side }), [side])

  return (
    <DrawerContext.Provider value={context}>
      <Modal {...rest}>{children}</Modal>
    </DrawerContext.Provider>
  )
}
