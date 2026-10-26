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

/** The content. It scrolls when it is taller than the screen. */
export const DrawerBody = forwardRef<HTMLElement, DrawerBodyProps>(
  (props: DrawerBodyProps, ref: ForwardedRef<HTMLElement>): ReactNode => (
    <ModalBody {...props} ref={ref} />
  ),
)

/**
 * A button that closes the Drawer. Without children it is the corner X button; with an element,
 * such as a `Button`, it gives it the click handler.
 */
export const DrawerClose = forwardRef<HTMLElement, DrawerCloseProps>(
  (props: DrawerCloseProps, ref: ForwardedRef<HTMLElement>): ReactElement => (
    <ModalClose {...props} ref={ref} />
  ),
)

/** A row for the actions. */
export const DrawerFooter = forwardRef<HTMLDivElement, DrawerFooterProps>(
  (props: DrawerFooterProps, ref: ForwardedRef<HTMLDivElement>): ReactNode => (
    <ModalFooter {...props} ref={ref} />
  ),
)

/** The title, which names the panel. */
export const DrawerHeader = forwardRef<HTMLHeadingElement, DrawerHeaderProps>(
  (props: DrawerHeaderProps, ref: ForwardedRef<HTMLHeadingElement>): ReactNode => (
    <ModalHeader {...props} ref={ref} />
  ),
)

/** What opens the Drawer. */
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
