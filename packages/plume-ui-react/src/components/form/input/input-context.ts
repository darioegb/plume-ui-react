'use client'

import type { ForwardedRef, InputHTMLAttributes } from 'react'
import { createContext, useContext } from 'react'
import type { ColorScheme, Shape, Size } from '../../../theme'

export type InputVariant = 'outline' | 'filled' | 'underline' | 'unstyled'

export interface InputLabels {
  reveal: string
}

export interface InputContextValue {
  colorScheme: ColorScheme
  disabled: boolean
  fieldProps: InputHTMLAttributes<HTMLInputElement>
  fieldRef: ForwardedRef<HTMLInputElement>
  invalid: boolean
  isStyled: boolean
  labels: InputLabels
  readOnly: boolean
  revealed: boolean
  shape: Shape
  size: Size
  toggleReveal: () => void
  variant: InputVariant
}

export const InputContext = createContext<InputContextValue | undefined>(undefined)

export function useInputContext(part: string): InputContextValue {
  const context = useContext(InputContext)
  if (!context) throw new Error(`<${part}> must be rendered inside an <Input>`)
  return context
}

export const inputColorVars = (colorScheme: ColorScheme): Record<string, string> => ({
  '--input-color': `var(--plume-color-${colorScheme}-text)`,
})
