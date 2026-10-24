'use client'

import type { ForwardedRef, HTMLAttributes, ReactNode } from 'react'
import { forwardRef } from 'react'
import type { ComponentProps } from '../../../theme'
import { Chip } from '../../presentation/chip'
import { type SelectedOption, useSelectContext } from './select-context'

type SelectChipRootAttributes = Pick<HTMLAttributes<HTMLSpanElement>, 'children'>

export interface SelectChipOwnProps {
  option?: SelectedOption
}

export type SelectChipProps = Omit<ComponentProps, 'index'> &
  SelectChipRootAttributes &
  SelectChipOwnProps

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
