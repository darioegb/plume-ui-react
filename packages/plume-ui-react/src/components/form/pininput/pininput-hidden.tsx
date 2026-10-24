'use client'

import type { ForwardedRef, InputHTMLAttributes, ReactNode } from 'react'
import { forwardRef } from 'react'
import { usePinInputContext } from './pininput-context'

type PinInputHiddenRootAttributes = Pick<InputHTMLAttributes<HTMLInputElement>, 'form' | 'name'>

export type PinInputHiddenProps = PinInputHiddenRootAttributes

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
