'use client'

import type { ForwardedRef, HTMLAttributes, ReactNode } from 'react'
import { forwardRef } from 'react'
import type { ComponentProps } from '../../../theme'
import { Chip } from '../../presentation/chip'
import { type SelectedOption, useSelectContext } from './select-context'

type SelectChipRootAttributes = Pick<HTMLAttributes<HTMLSpanElement>, 'children'>

export interface SelectChipOwnProps {
  /** The chosen option the chip stands for. Without it the chip has no remove button. */
  option?: SelectedOption
}

export type SelectChipProps = Omit<ComponentProps, 'index'> &
  SelectChipRootAttributes &
  SelectChipOwnProps

/**
 * A chip of a chosen option. With an `option` it has a button that removes it; without one it is a
 * plain chip, like the `+N`. Compose it with `ChipLabel`, `ChipIcon` and `ChipRemove` to style its
 * parts.
 */
export const SelectChip = forwardRef<HTMLSpanElement, SelectChipProps>(
  (
    { children, className, option, style }: SelectChipProps,
    ref: ForwardedRef<HTMLSpanElement>,
  ): ReactNode => {
    const context = useSelectContext('SelectChip')
    const variant = context.isStyled ? 'subtle' : 'unstyled'
    const canRemove = !context.disabled && !context.readOnly

    if (!option) {
      return (
        <Chip
          className={className}
          data-plume-select-chip=""
          ref={ref}
          size={context.size}
          style={style}
          variant={variant}
        >
          {children}
        </Chip>
      )
    }

    return (
      <Chip
        className={className}
        data-plume-select-chip=""
        icon={option.icon}
        labels={{ remove: context.labels.remove(option.label) }}
        onRemove={canRemove ? () => context.remove(option.value) : undefined}
        ref={ref}
        size={context.size}
        style={style}
        variant={variant}
      >
        {children ?? <span aria-hidden="true">{option.label}</span>}
      </Chip>
    )
  },
)

SelectChip.displayName = 'SelectChip'
