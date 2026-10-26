'use client'

import type { ForwardedRef, InputHTMLAttributes, ReactNode } from 'react'
import { forwardRef } from 'react'
import { usePinInputContext } from './pininput-context'

export type PinInputHiddenProps = Pick<InputHTMLAttributes<HTMLInputElement>, 'form' | 'name'>

/**
 * The hidden input that carries the whole code in a form. The default composition renders it when the `PinInput` has a `name`; in a composition you add it yourself.
 */
export const PinInputHidden = forwardRef<HTMLInputElement, PinInputHiddenProps>(
  ({ name, ...rest }: PinInputHiddenProps, ref: ForwardedRef<HTMLInputElement>): ReactNode => {
    const context = usePinInputContext('PinInputHidden')

    return (
      <input
        data-plume-pininput-hidden=""
        name={name ?? context.name}
        ref={ref}
        type="hidden"
        value={context.pin.value}
        {...rest}
      />
    )
  },
)

PinInputHidden.displayName = 'PinInputHidden'
