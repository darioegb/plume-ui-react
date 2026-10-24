'use client'

import type { ReactNode } from 'react'
import { Fragment } from 'react'
import { SelectChip } from './select-chip'
import { type SelectedOption, useSelectContext } from './select-context'
import { useSelectTriggerContext } from './select-trigger-context'

export interface SelectChipsProps {
  children?: (option: SelectedOption) => ReactNode
  maxDisplay?: number
  overflow?: (hidden: number) => ReactNode
}

export function SelectChips({
  children,
  maxDisplay,
  overflow,
}: Readonly<SelectChipsProps>): ReactNode {
  const context = useSelectContext('SelectChips')
  const trigger = useSelectTriggerContext('SelectChips')
  if (!context.multiple) return null
  const shown = context.selectedOptions.slice(0, maxDisplay ?? trigger.maxDisplay)
  const hidden = context.selectedOptions.length - shown.length

  return (
    <>
      {shown.map((option) => (
        <Fragment key={option.value}>
          {children ? children(option) : <SelectChip option={option} />}
        </Fragment>
      ))}
      {hidden > 0 ? (overflow?.(hidden) ?? <SelectChip>+{hidden}</SelectChip>) : null}
    </>
  )
}
