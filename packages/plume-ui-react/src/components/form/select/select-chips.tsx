'use client'

import type { ReactNode } from 'react'
import { Fragment } from 'react'
import { SelectChip } from './select-chip'
import { type SelectedOption, useSelectContext } from './select-context'
import { useSelectTriggerContext } from './select-trigger-context'

export interface SelectChipsProps {
  /**
   * A function of each chosen option that returns its chip: `(option) => <SelectChip
   * className="..." option={option} />`.
   */
  children?: (option: SelectedOption) => ReactNode
  /**
   * How many chips to show before the one that counts the rest (`+N`). It defaults to the
   * `maxDisplay` of the `SelectTrigger`.
   */
  maxDisplay?: number
  /**
   * A function of the number of hidden chips that returns the chip that counts them. By default it
   * is a `SelectChip` with the `overflow` label.
   */
  overflow?: (hidden: number) => ReactNode
}

/** The chips of a `multiple` select. It has no element of its own. */
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
      {hidden > 0
        ? (overflow?.(hidden) ?? <SelectChip>{context.labels.overflow(hidden)}</SelectChip>)
        : null}
    </>
  )
}

SelectChips.displayName = 'SelectChips'
