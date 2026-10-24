'use client'

import type { ReactNode } from 'react'
import { SelectPlaceholder } from './select-placeholder'
import { type SelectedOption, useSelectContext } from './select-context'
import { SelectValueOption, SelectValueText } from './select-value-parts'

export interface SelectValueProps {
  children?: (selected: readonly SelectedOption[]) => ReactNode
  placeholder?: ReactNode
}

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
