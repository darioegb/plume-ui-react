'use client'

import type { ForwardedRef, ReactNode } from 'react'
import { forwardRef } from 'react'
import { OverlayClose, type OverlayCloseProps } from '../../../overlay/overlay-close'
import { useSelectContext } from './select-context'
import styles from './select.module.css'

export type SelectClearProps = OverlayCloseProps

/**
 * The button that clears the value. It renders nothing when the select is not `clearable` or has no
 * value. Its name is the `clear` label of the `Select` unless you give it a `label`, and an element
 * given as `children`, such as a `Button`, becomes the button.
 */
export const SelectClear = forwardRef<HTMLElement, SelectClearProps>(
  ({ label, ...props }: SelectClearProps, ref: ForwardedRef<HTMLElement>): ReactNode => {
    const context = useSelectContext('SelectClear')
    if (!context.canClear || context.selected.length === 0) return null

    return (
      <OverlayClose
        {...props}
        closeClassName={context.isStyled ? styles.clear : undefined}
        data-plume-select-clear=""
        label={label ?? context.labels.clear}
        onClose={context.clear}
        ref={ref}
      />
    )
  },
)

SelectClear.displayName = 'SelectClear'
