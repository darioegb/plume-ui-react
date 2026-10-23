'use client'

import type { ReactNode } from 'react'
import { useMemo } from 'react'
import { Modal, type ModalProps } from '../modal'
import { DrawerContext, type DrawerShape, type DrawerSide } from './drawer-context'

export type { DrawerShape, DrawerSide } from './drawer-context'

export interface DrawerOwnProps {
  shape?: DrawerShape
  side?: DrawerSide
}

export type DrawerProps = ModalProps & DrawerOwnProps

export function Drawer({
  children,
  shape = 'rounded',
  side = 'right',
  ...rest
}: Readonly<DrawerProps>): ReactNode {
  const context = useMemo(() => ({ shape, side }), [shape, side])

  return (
    <DrawerContext.Provider value={context}>
      <Modal {...rest}>{children}</Modal>
    </DrawerContext.Provider>
  )
}
