'use client'

import type { ForwardedRef, HTMLAttributes, ReactNode } from 'react'
import { forwardRef } from 'react'
import { joinClasses } from '../../../overlay/class-names'
import type { ComponentProps } from '../../../theme'
import { useChipContext } from './chip-context'
import styles from './chip.module.css'

export type ChipIconProps = Omit<ComponentProps, 'index'> &
  Pick<HTMLAttributes<HTMLSpanElement>, 'children'>

export const ChipIcon = forwardRef<HTMLSpanElement, ChipIconProps>(
  (
    { children, className, style }: ChipIconProps,
    ref: ForwardedRef<HTMLSpanElement>,
  ): ReactNode => {
    const { isStyled } = useChipContext('ChipIcon')

    return (
      <span
        aria-hidden="true"
        className={joinClasses(isStyled && styles.icon, className)}
        data-plume-chip-icon=""
        ref={ref}
        style={style}
      >
        {children}
      </span>
    )
  },
)

ChipIcon.displayName = 'ChipIcon'
