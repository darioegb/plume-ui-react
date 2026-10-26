'use client'

import type { ReactNode } from 'react'
import { SelectPlaceholder } from './select-placeholder'
import { type SelectedOption, useSelectContext } from './select-context'
import { SelectValueOption, SelectValueText } from './select-value-parts'

export interface SelectValueProps {
  /** A function of the chosen options that returns what to show. */
  children?: (selected: readonly SelectedOption[]) => ReactNode
  /** What it shows when nothing is chosen. */
  placeholder?: ReactNode
}

/**
 * What the combobox shows: the chosen option with its icon, or the labels of a `multiple` select as
 * text. `SelectCombobox` renders one by default; use your own to render the value yourself. It is
 * made of `SelectPlaceholder`, `SelectValueOption`, `SelectValueIcon` and `SelectValueText`.
 */
export function SelectValue({ children, placeholder }: Readonly<SelectValueProps>): ReactNode {
  const { multiple, selected, selectedOptions } = useSelectContext('SelectValue')

  if (selected.length === 0) {
    return placeholder ? <SelectPlaceholder>{placeholder}</SelectPlaceholder> : null
  }
  if (children) return children(selectedOptions)
  if (multiple) {
    return (
      <SelectValueText>{selectedOptions.map((option) => option.label).join(', ')}</SelectValueText>
    )
  }
  return selectedOptions[0] ? <SelectValueOption option={selectedOptions[0]} /> : null
}
