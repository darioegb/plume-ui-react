'use client'

import type { ForwardedRef, MouseEvent, ReactNode } from 'react'
import { forwardRef } from 'react'
import { OverlayClose, type OverlayCloseProps } from '../../../overlay/overlay-close'
import { useChipContext } from './chip-context'
import styles from './chip.module.css'

export interface ChipRemoveOwnProps {
  /** Disables the button. By default it follows the `disabled` of the Chip. */
  disabled?: boolean
  /** Called when the button is clicked, before the `onRemove` of the Chip. */
  onClick?: (event: MouseEvent<HTMLButtonElement>) => void
}

export type ChipRemoveProps = OverlayCloseProps & ChipRemoveOwnProps

/**
 * The button that removes the Chip. It calls the `onRemove` of the Chip. Its name is `Remove`
 * followed by the text of the Chip unless you give it a `label` or the Chip has `labels.remove`.
 * An element given as `children`, such as a `Button`, becomes the button.
 */
export const ChipRemove = forwardRef<HTMLElement, ChipRemoveProps>(
  (
    { disabled, label, onClick, ...props }: ChipRemoveProps,
    ref: ForwardedRef<HTMLElement>,
  ): ReactNode => {
    const context = useChipContext('ChipRemove')
    const isDisabled = disabled ?? context.disabled
    const hasOwnName = Boolean(label) || context.customRemoveLabel

    return (
      <OverlayClose
        {...props}
        aria-labelledby={hasOwnName ? undefined : `${context.removeId} ${context.labelId}`}
        closeClassName={context.isStyled ? styles.remove : undefined}
        data-disabled={isDisabled ? '' : undefined}
        data-plume-chip-remove=""
        disabled={isDisabled}
        id={context.removeId}
        label={label ?? context.labels.remove}
        onClose={(event) => {
          onClick?.(event)
          context.onRemove?.(event)
        }}
        ref={ref}
      />
    )
  },
)

ChipRemove.displayName = 'ChipRemove'
