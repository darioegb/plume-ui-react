'use client'

import { createContext, useContext } from 'react'
import type { PinInputLabels } from './pininput'
import type { PinInputType } from './pin-utils'
import type { PinInputState } from './use-pin-input'

export interface PinInputContextValue {
  autoComplete: string
  disabled: boolean
  id: string | undefined
  invalid: boolean
  isStyled: boolean
  labels: PinInputLabels
  length: number
  mask: boolean
  name: string | undefined
  pin: PinInputState
  placeholder: string | undefined
  readOnly: boolean
  required: boolean
  type: PinInputType
}

export const PinInputContext = createContext<PinInputContextValue | undefined>(undefined)

export const usePinInputContext = (part: string): PinInputContextValue => {
  const context = useContext(PinInputContext)
  if (!context) throw new Error(`<${part}> must be rendered inside a <PinInput>`)
  return context
}
