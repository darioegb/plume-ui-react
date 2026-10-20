'use client'

import type { ForwardedRef, ReactElement } from 'react'
import { forwardRef } from 'react'
import { OverlayClose, type OverlayCloseProps } from '../../../overlay/overlay-close'
import { usePopoverContext } from './popover-context'
import styles from './popover.module.css'

export type PopoverCloseProps = OverlayCloseProps

export const PopoverClose = forwardRef<HTMLElement, PopoverCloseProps>(
  (props: PopoverCloseProps, ref: ForwardedRef<HTMLElement>): ReactElement => {
    const { isStyled, setOpen } = usePopoverContext('PopoverClose')

    return (
      <OverlayClose
        {...props}
        closeClassName={isStyled ? styles.close : undefined}
        onClose={() => setOpen(false)}
        ref={ref}
      />
    )
  },
)

PopoverClose.displayName = 'PopoverClose'
