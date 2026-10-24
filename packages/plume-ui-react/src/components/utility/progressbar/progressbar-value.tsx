'use client'

import type { ForwardedRef, HTMLAttributes, ReactNode } from 'react'
import { forwardRef } from 'react'
import { joinClasses } from '../../../overlay/class-names'
import type { ComponentProps } from '../../../theme'
import { useProgressBarContext } from './progressbar-context'
import styles from './progressbar.module.css'

type ProgressBarValueRootAttributes = Pick<HTMLAttributes<HTMLSpanElement>, 'children'>

export type ProgressBarValueProps = Omit<ComponentProps, 'index'> & ProgressBarValueRootAttributes

export const ProgressBarValue = forwardRef<HTMLSpanElement, ProgressBarValueProps>(
  (
    { children, className, style }: ProgressBarValueProps,
    ref: ForwardedRef<HTMLSpanElement>,
  ): ReactNode => {
    const { current, formatValue, indeterminate, isStyled, total } =
      useProgressBarContext('ProgressBarValue')
    const content = children ?? (indeterminate ? null : formatValue(current, total))
    if (content === null) return null

    return (
      <span
        aria-hidden="true"
        className={joinClasses(isStyled && styles.value, className)}
        data-plume-progressbar-value=""
        ref={ref}
        style={style}
      >
        {content}
      </span>
    )
  },
)

ProgressBarValue.displayName = 'ProgressBarValue'
