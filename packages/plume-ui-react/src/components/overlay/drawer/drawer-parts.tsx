import type { ForwardedRef, ReactElement, ReactNode } from 'react'
import { forwardRef } from 'react'
import {
  ModalBody,
  ModalClose,
  ModalFooter,
  ModalHeader,
  ModalTrigger,
  type ModalBodyProps,
  type ModalCloseProps,
  type ModalFooterProps,
  type ModalHeaderProps,
  type ModalTriggerProps,
} from '../modal'

export type DrawerBodyProps = ModalBodyProps
export type DrawerCloseProps = ModalCloseProps
export type DrawerFooterProps = ModalFooterProps
export type DrawerHeaderProps = ModalHeaderProps
export type DrawerTriggerProps = ModalTriggerProps

export const DrawerBody = forwardRef<HTMLElement, DrawerBodyProps>(
  (props: DrawerBodyProps, ref: ForwardedRef<HTMLElement>): ReactNode => (
    <ModalBody {...props} ref={ref} />
  ),
)

export const DrawerClose = forwardRef<HTMLElement, DrawerCloseProps>(
  (props: DrawerCloseProps, ref: ForwardedRef<HTMLElement>): ReactElement => (
    <ModalClose {...props} ref={ref} />
  ),
)

export const DrawerFooter = forwardRef<HTMLDivElement, DrawerFooterProps>(
  (props: DrawerFooterProps, ref: ForwardedRef<HTMLDivElement>): ReactNode => (
    <ModalFooter {...props} ref={ref} />
  ),
)

export const DrawerHeader = forwardRef<HTMLHeadingElement, DrawerHeaderProps>(
  (props: DrawerHeaderProps, ref: ForwardedRef<HTMLHeadingElement>): ReactNode => (
    <ModalHeader {...props} ref={ref} />
  ),
)

export const DrawerTrigger = forwardRef<HTMLElement, DrawerTriggerProps>(
  (props: DrawerTriggerProps, ref: ForwardedRef<HTMLElement>): ReactElement => (
    <ModalTrigger {...props} ref={ref} />
  ),
)

DrawerBody.displayName = 'DrawerBody'
DrawerClose.displayName = 'DrawerClose'
DrawerFooter.displayName = 'DrawerFooter'
DrawerHeader.displayName = 'DrawerHeader'
DrawerTrigger.displayName = 'DrawerTrigger'
