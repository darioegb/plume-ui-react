'use client'

import type { Ref } from 'react'
import { createContext, useContext } from 'react'
import type { ColorScheme, Shape, Size } from '../../../theme'
import type {
  TextareaFieldAttributes,
  TextareaLabels,
  TextareaResize,
  TextareaVariant,
} from './textarea-types'

export interface TextareaFieldMeta {
  defaultValue: TextareaFieldAttributes['defaultValue']
  maxLength: number | undefined
  value: TextareaFieldAttributes['value']
}

export interface TextareaContextValue {
  colorScheme: ColorScheme
  count: number
  countId: string
  countMounted: boolean
  disabled: boolean
  fieldProps: TextareaFieldAttributes
  fieldRef: Ref<HTMLTextAreaElement> | undefined
  invalid: boolean
  labels: TextareaLabels
  maxLength: number | undefined
  registerCount: (mounted: boolean) => void
  registerField: (meta: TextareaFieldMeta) => void
  remaining: number | undefined
  resize: TextareaResize
  setTyped: (length: number) => void
  shape: Shape
  size: Size
  variant: TextareaVariant
}

export const TextareaContext = createContext<TextareaContextValue | undefined>(undefined)

export function useTextarea(part: string): TextareaContextValue {
  const context = useContext(TextareaContext)
  if (!context) throw new Error(`${part} must be used within a <Textarea>`)
  return context
}
