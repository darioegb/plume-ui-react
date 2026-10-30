'use client'

import type { ForwardedRef, InputHTMLAttributes, ReactNode } from 'react'
import { forwardRef } from 'react'
import { useNumberInputContext } from './numberinput-context'

export type NumberInputHiddenProps = Pick<InputHTMLAttributes<HTMLInputElement>, 'form' | 'name'>

/**
 * The hidden input that carries the plain number in a form, or an empty string when the field is empty. The `NumberInput` adds it when it has a `name`, unless its parts already have one.
 */
export const NumberInputHidden = forwardRef<HTMLInputElement, NumberInputHiddenProps>(
  ({ name, ...rest }: NumberInputHiddenProps, ref: ForwardedRef<HTMLInputElement>): ReactNode => {
    const context = useNumberInputContext('NumberInputHidden')

    return (
      <input
        data-plume-numberinput-hidden=""
        name={name ?? context.name}
        ref={ref}
        type="hidden"
        value={context.number.value ?? ''}
        {...rest}
      />
    )
  },
)

NumberInputHidden.displayName = 'NumberInputHidden'
