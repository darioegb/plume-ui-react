'use client'

import type { ChangeEvent } from 'react'
import { useCallback, useState } from 'react'

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

const SLOT_TESTS: Record<string, RegExp> = {
  '#': /^\d$/,
  A: /^\p{L}$/u,
  '*': /^[\p{L}\d]$/u,
}

type MaskToken = { slot: RegExp } | { literal: string }

function parseMask(mask: string): MaskToken[] {
  const tokens: MaskToken[] = []
  for (let index = 0; index < mask.length; index += 1) {
    const char = mask[index]
    if (char === '\\' && index + 1 < mask.length) {
      index += 1
      tokens.push({ literal: mask[index] })
    } else if (char in SLOT_TESTS) {
      tokens.push({ slot: SLOT_TESTS[char] })
    } else {
      tokens.push({ literal: char })
    }
  }
  return tokens
}

/**
 * Formats `value` according to `mask`. Mask characters: `#` a digit, `A` a
 * letter, `*` a letter or digit; `\` escapes the next character as a literal;
 * any other character is a literal that is auto-inserted as the user types.
 * Input characters that don't fit the next slot are dropped.
 * e.g. applyMask('15082024', '##/##/####') -> '15/08/2024'.
 */
export function applyMask(value: string, mask: string): string {
  if (!mask) return value

  let result = ''
  // Literals are only emitted once a slot after them is filled, so deleting never leaves a dangling one.
  let pendingLiterals = ''
  let valueIndex = 0

  for (const token of parseMask(mask)) {
    if (valueIndex >= value.length) break

    if ('literal' in token) {
      pendingLiterals += token.literal
      if (value[valueIndex] === token.literal) valueIndex += 1
      continue
    }

    while (valueIndex < value.length && !token.slot.test(value[valueIndex])) valueIndex += 1
    if (valueIndex >= value.length) break

    result += pendingLiterals + value[valueIndex]
    pendingLiterals = ''
    valueIndex += 1
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

  const handleChange: MaskChangeHandler = useCallback(
    (event) => {
      if (mask) {
        const maskedValue = applyMask(event.target.value, mask)
        // Mutate the event so consumers reading event.target.value get the masked value.
        event.target.value = maskedValue
        if (!isControlled) setInternalValue(maskedValue)
      }
      onChange?.(event)
    },
    [isControlled, mask, onChange],
  )

  if (!mask) {
    return { value, onChange: handleChange }
  }

  return {
    value: isControlled ? applyMask(value, mask) : internalValue,
    onChange: handleChange,
  }
}
