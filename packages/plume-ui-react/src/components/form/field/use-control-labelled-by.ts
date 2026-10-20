'use client'

import { useId } from 'react'
import { useFieldContext } from './field-context'

interface ControlLabelledByOptions {
  hasText: boolean
  id: string | undefined
  labelledBy: string | undefined
}

export function useControlLabelledBy({ hasText, id, labelledBy }: ControlLabelledByOptions): {
  labelledBy: string | undefined
  textId: string
} {
  const field = useFieldContext()
  const textId = useId()
  const isFieldControl = Boolean(field?.labelsItself && field.labelId && id === field.controlId)
  if (!isFieldControl || labelledBy) return { labelledBy, textId }
  return {
    labelledBy: [field?.labelId, hasText ? textId : null].filter(Boolean).join(' '),
    textId,
  }
}
