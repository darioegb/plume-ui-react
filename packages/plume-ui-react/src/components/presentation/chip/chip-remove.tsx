'use client'

import type { ButtonHTMLAttributes, ForwardedRef, ReactNode } from 'react'
import { forwardRef } from 'react'
import { joinClasses } from '../../../overlay/class-names'
import { CloseIcon } from '../../../overlay/icons'
import type { ComponentProps } from '../../../theme'
import { useChipContext } from './chip-context'
import styles from './chip.module.css'

export type ChipRemoveProps = Omit<ComponentProps, 'index'> &
  Pick<ButtonHTMLAttributes<HTMLButtonElement>, 'aria-label' | 'children' | 'disabled' | 'onClick'>

export const ChipRemove = forwardRef<HTMLButtonElement, ChipRemoveProps>(
  (
    { 'aria-label': ariaLabel, children, className, disabled, onClick, style }: ChipRemoveProps,
    ref: ForwardedRef<HTMLButtonElement>,
  ): ReactNode => {
    const context = useChipContext('ChipRemove')
    const isDisabled = disabled ?? context.disabled
    const hasOwnName = Boolean(ariaLabel) || context.customRemoveLabel

    return (
      <button
        aria-label={ariaLabel ?? context.labels.remove}
        aria-labelledby={hasOwnName ? undefined : `${context.removeId} ${context.labelId}`}
        className={joinClasses(context.isStyled && styles.remove, className)}
        data-disabled={isDisabled ? '' : undefined}
        data-plume-chip-remove=""
        disabled={isDisabled}
        id={context.removeId}
        onClick={(event) => {
          onClick?.(event)
          context.onRemove?.(event)
        }}
        ref={ref}
        style={style}
        type="button"
      >
        {children ?? <CloseIcon />}
      </button>
    )
  },
)

ChipRemove.displayName = 'ChipRemove'
