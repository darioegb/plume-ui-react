'use client'

import type { ForwardedRef, ReactNode } from 'react'
import { forwardRef, useCallback, useId, useRef, useState } from 'react'
import { useLabels } from '../../../locale/locale-provider'
import type { ColorScheme, Shape, Size } from '../../../theme'
import { TextareaContext } from './textarea-context'
import type { TextareaContextValue, TextareaFieldMeta } from './textarea-context'
import { TextareaCount } from './textarea-count'
import { TextareaField } from './textarea-field'
import { TextareaStatus } from './textarea-status'
import { isTextareaInvalid, textareaColorVars } from './textarea-styles'
import type {
  TextareaLabels,
  TextareaProps,
  TextareaResize,
  TextareaVariant,
} from './textarea-types'

export type TextareaRootProps = Omit<
  TextareaProps,
  'colorScheme' | 'resize' | 'shape' | 'size' | 'variant'
> & {
  colorScheme: ColorScheme
  resize: TextareaResize
  shape: Shape
  size: Size
  variant: TextareaVariant
}

const DEFAULT_LABELS: TextareaLabels = {
  count: (count, max) => (max === undefined ? String(count) : `${count} / ${max}`),
  remaining: (remaining) => `${remaining} ${remaining === 1 ? 'character' : 'characters'} left`,
}

const sameMeta = (a: TextareaFieldMeta | undefined, b: TextareaFieldMeta): boolean =>
  a?.value === b.value && a?.defaultValue === b.defaultValue && a?.maxLength === b.maxLength

export const TextareaRoot = forwardRef<HTMLTextAreaElement, TextareaRootProps>(
  (
    {
      children,
      className,
      colorScheme,
      disabled = false,
      labels,
      resize,
      shape,
      size,
      style,
      variant,
      ...fieldProps
    }: TextareaRootProps,
    ref: ForwardedRef<HTMLTextAreaElement>,
  ): ReactNode => {
    const isDefault = children === undefined
    const text = useLabels('textarea', DEFAULT_LABELS, labels)
    const countId = useId()
    const touched = useRef(false)
    const [typed, setTypedState] = useState(() => String(fieldProps.defaultValue ?? '').length)
    const [override, setOverride] = useState<TextareaFieldMeta>()
    const [countMounted, setCountMounted] = useState(isDefault)
    const meta = override ?? {
      defaultValue: fieldProps.defaultValue,
      maxLength: fieldProps.maxLength,
      value: fieldProps.value,
    }
    const count = meta.value === undefined ? typed : String(meta.value).length
    const remaining = meta.maxLength === undefined ? undefined : meta.maxLength - count
    const invalid = isTextareaInvalid(fieldProps['aria-invalid'])

    const setTyped = useCallback((length: number): void => {
      touched.current = true
      setTypedState(length)
    }, [])
    const registerField = useCallback((next: TextareaFieldMeta): void => {
      setOverride((previous) => (sameMeta(previous, next) ? previous : next))
      if (next.value === undefined && next.defaultValue !== undefined && !touched.current) {
        setTypedState(String(next.defaultValue).length)
      }
    }, [])

    const context: TextareaContextValue = {
      colorScheme,
      count,
      countId,
      countMounted,
      disabled,
      fieldProps,
      fieldRef: ref,
      invalid,
      labels: text,
      maxLength: meta.maxLength,
      registerCount: setCountMounted,
      registerField,
      remaining,
      resize,
      setTyped,
      shape,
      size,
      variant,
    }

    return (
      <TextareaContext.Provider value={context}>
        <div
          className={className}
          data-disabled={disabled ? '' : undefined}
          data-invalid={invalid ? '' : undefined}
          data-plume-textarea-group=""
          style={textareaColorVars(invalid ? 'error' : colorScheme, style)}
        >
          {isDefault ? (
            <>
              <TextareaField />
              <TextareaCount />
              <TextareaStatus />
            </>
          ) : (
            children
          )}
        </div>
      </TextareaContext.Provider>
    )
  },
)

TextareaRoot.displayName = 'TextareaRoot'
