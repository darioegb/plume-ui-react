'use client'

import type { ForwardedRef, HTMLAttributes, ReactNode } from 'react'
import { forwardRef } from 'react'
import type { ComponentProps } from '../../../theme'
import { useSelectContext } from './select-context'

type SelectChipsSummaryRootAttributes = Pick<HTMLAttributes<HTMLSpanElement>, 'children'>

export type SelectChipsSummaryProps = Omit<ComponentProps, 'index'> &
  SelectChipsSummaryRootAttributes

/**
 * The visually hidden list of the chosen options inside the `SelectCombobox` of a select that shows
 * them as chips, so the combobox announces its value. It renders nothing when nothing is chosen,
 * and `children` replace the list.
 */
export const SelectChipsSummary = forwardRef<HTMLSpanElement, SelectChipsSummaryProps>(
  (
    { children, className, style }: SelectChipsSummaryProps,
    ref: ForwardedRef<HTMLSpanElement>,
  ): ReactNode => {
    const context = useSelectContext('SelectChipsSummary')
    if (context.selectedOptions.length === 0) return null

    return (
      <span className={className} data-plume-select-chips-summary="" ref={ref} style={style}>
        {children ?? context.selectedOptions.map((option) => option.label).join(', ')}
      </span>
    )
  },
)

SelectChipsSummary.displayName = 'SelectChipsSummary'
