import type { ChangeEvent } from 'react'
import { useState } from 'react'

export type MaskChangeHandler = (event: ChangeEvent<HTMLInputElement>) => void

export interface UseMaskProps {
  mask?: string
  value?: string
  defaultValue?: string
  onChange?: MaskChangeHandler
}

export interface UseMaskResult {
  value: string | undefined
  onChange: MaskChangeHandler
}

/**
 * Formats `value` according to `mask`. `#` matches any single character; every
 * other mask character is a literal that is auto-inserted as the user types.
 * e.g. applyMask('15082024', '##/##/####') -> '15/08/2024'.
 */
export function applyMask(value: string, mask: string): string {
  if (!mask) return value

  let result = ''
  let valueIndex = 0

  for (let maskIndex = 0; maskIndex < mask.length && valueIndex < value.length; maskIndex += 1) {
    const maskChar = mask[maskIndex]

    if (maskChar === '#') {
      result += value[valueIndex]
      valueIndex += 1
    } else {
      result += maskChar
      if (value[valueIndex] === maskChar) valueIndex += 1
    }
  }

  return result
}

/**
 * Masks an input's value. Works for both controlled (`value` provided) and
 * uncontrolled (`defaultValue`) usage. When no `mask` is given it passes the
 * value/handler through untouched, so callers can use it unconditionally.
 */
export function useMask({
  mask,
  value,
  defaultValue = '',
  onChange,
}: UseMaskProps): UseMaskResult {
  const isControlled = value !== undefined
  const [internalValue, setInternalValue] = useState<string>(() =>
    applyMask(defaultValue, mask ?? ''),
  )

  const handleChange: MaskChangeHandler = (event) => {
    if (mask) {
      const maskedValue = applyMask(event.target.value, mask)
      // Mutate the event so consumers reading event.target.value get the masked value.
      event.target.value = maskedValue
      if (!isControlled) setInternalValue(maskedValue)
    }
    onChange?.(event)
  }

  if (!mask) {
    return { value, onChange: handleChange }
  }

  return {
    value: isControlled ? applyMask(value, mask) : internalValue,
    onChange: handleChange,
  }
}
