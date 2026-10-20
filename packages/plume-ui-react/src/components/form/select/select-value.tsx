'use client'

import type { ReactNode } from 'react'
import { type SelectedOption, useSelectContext } from './select-context'
import styles from './select.module.css'

export interface SelectValueProps {
  children?: (selected: readonly SelectedOption[]) => ReactNode
  display?: 'chips' | 'text'
  maxDisplay?: number
  placeholder?: ReactNode
}

function OptionContent({ option }: Readonly<{ option: SelectedOption }>): ReactNode {
  const { isStyled } = useSelectContext('SelectValue')
  return (
    <>
      {option.icon ? (
        <span aria-hidden="true" className={isStyled ? styles.valueIcon : undefined}>
          {option.icon}
        </span>
      ) : null}
      <span className={isStyled ? styles.valueText : undefined}>{option.label}</span>
    </>
  )
}

export function SelectValue({
  children,
  display = 'chips',
  maxDisplay = 3,
  placeholder,
}: Readonly<SelectValueProps>): ReactNode {
  const { isStyled, multiple, selected, selectedOptions } = useSelectContext('SelectValue')

  if (selected.length === 0) {
    return placeholder ? (
      <span className={isStyled ? styles.placeholder : undefined}>{placeholder}</span>
    ) : null
  }
  if (children) return children(selectedOptions)
  if (!multiple) {
    return selectedOptions[0] ? (
      <span className={isStyled ? styles.value : undefined}>
        <OptionContent option={selectedOptions[0]} />
      </span>
    ) : null
  }
  if (display === 'text') {
    return (
      <span className={isStyled ? styles.valueText : undefined}>
        {selectedOptions.map((option) => option.label).join(', ')}
      </span>
    )
  }
  const shown = selectedOptions.slice(0, maxDisplay)
  const hidden = selectedOptions.length - shown.length
  return (
    <span className={isStyled ? styles.chips : undefined}>
      {shown.map((option) => (
        <span className={isStyled ? styles.chip : undefined} key={option.value}>
          <OptionContent option={option} />
        </span>
      ))}
      {hidden > 0 ? <span className={isStyled ? styles.chip : undefined}>+{hidden}</span> : null}
    </span>
  )
}
