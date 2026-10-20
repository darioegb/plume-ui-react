'use client'

import type { ChangeEvent } from 'react'
import { createContext, useContext } from 'react'
import type { ColorScheme, Size } from '../../../theme'
import type { RadioVariant } from './radio'

export interface RadioGroupContextValue {
  colorScheme: ColorScheme | undefined
  disabled: boolean
  invalid: boolean
  name: string
  readOnly: boolean
  required: boolean
  select: (value: string, event: ChangeEvent<HTMLInputElement>) => void
  size: Size | undefined
  value: string | undefined
  variant: RadioVariant | undefined
}

export const RadioGroupContext = createContext<RadioGroupContextValue | undefined>(undefined)

export const useRadioGroupContext = (): RadioGroupContextValue | undefined =>
  useContext(RadioGroupContext)
