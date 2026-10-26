'use client'

import type { ForwardedRef, HTMLAttributes, ReactNode } from 'react'
import { forwardRef } from 'react'
import { joinClasses } from '../../../overlay/class-names'
import type { ComponentProps } from '../../../theme'
import { useChipContext } from './chip-context'
import styles from './chip.module.css'

export type ChipLabelProps = Omit<ComponentProps, 'index'> &
  Pick<HTMLAttributes<HTMLSpanElement>, 'children'>

/** The text of the Chip. It names the remove button. */
export const ChipLabel = forwardRef<HTMLSpanElement, ChipLabelProps>(
  (
    { children, className, style }: ChipLabelProps,
    ref: ForwardedRef<HTMLSpanElement>,
  ): ReactNode => {
    const { isStyled, labelId } = useChipContext('ChipLabel')

    return (
      <span
        className={joinClasses(isStyled && styles.label, className)}
        data-plume-chip-label=""
        id={labelId}
        ref={ref}
        style={style}
      >
        {children}
      </span>
    )
  },
)

ChipLabel.displayName = 'ChipLabel'
