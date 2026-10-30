'use client'

import type { InputHTMLAttributes, Ref, RefObject } from 'react'
import { createContext, useContext } from 'react'
import type { NumberInputLabels } from './numberinput-labels'
import type { NumberInputState } from './use-number-input'

export type NumberInputFieldAttributes = Pick<
  InputHTMLAttributes<HTMLInputElement>,
  | 'aria-describedby'
  | 'aria-invalid'
  | 'aria-label'
  | 'aria-labelledby'
  | 'id'
  | 'onBlur'
  | 'onFocus'
  | 'placeholder'
  | 'required'
  | 'title'
>

export interface NumberInputContextProps {
  disabled: boolean
  fieldProps: NumberInputFieldAttributes
  forwardedRef: Ref<HTMLInputElement> | undefined
  inputRef: RefObject<HTMLInputElement | null>
  invalid: boolean
  isStyled: boolean
  labels: NumberInputLabels
  max: number | undefined
  min: number | undefined
  name: string | undefined
  number: NumberInputState
  precision: number | undefined
  readOnly: boolean
}

export const NumberInputContext = createContext<NumberInputContextProps | undefined>(undefined)

export const useNumberInputContext = (part = 'useNumberInputContext'): NumberInputContextProps => {
  const context = useContext(NumberInputContext)
  if (!context) {
    throw new Error(`${part} must be used within a <NumberInput>`)
  }
  return context
}
