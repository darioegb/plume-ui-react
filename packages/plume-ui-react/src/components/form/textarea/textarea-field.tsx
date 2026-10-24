'use client'

import type { ChangeEvent, ForwardedRef, ReactNode } from 'react'
import { forwardRef, useMemo } from 'react'
import { useIsomorphicLayoutEffect } from '../../../overlay/use-isomorphic-layout-effect'
import { mergeRefs } from '../../../overlay/trigger'
import type { ComponentProps } from '../../../theme'
import { useTextarea } from './textarea-context'
import { isTextareaInvalid, textareaFieldClasses } from './textarea-styles'
import type { TextareaFieldAttributes } from './textarea-types'

export type TextareaFieldProps = Omit<ComponentProps, 'index'> & TextareaFieldAttributes

export const TextareaField = forwardRef<HTMLTextAreaElement, TextareaFieldProps>(
  (
    { className, onChange, style, ...own }: TextareaFieldProps,
    ref: ForwardedRef<HTMLTextAreaElement>,
  ): ReactNode => {
    const context = useTextarea('TextareaField')
    const { registerField, setTyped } = context
    const { defaultValue, maxLength, value } = own
    const hasOwnMeta = defaultValue !== undefined || maxLength !== undefined || value !== undefined
    const { fieldRef } = context
    const mergedRef = useMemo(() => mergeRefs(fieldRef, ref), [fieldRef, ref])
    const merged = { ...context.fieldProps, ...own }
    const disabled = merged.disabled ?? context.disabled
    const invalid = isTextareaInvalid(merged['aria-invalid']) || context.invalid
    const describedBy =
      [merged['aria-describedby'], context.countMounted ? context.countId : null]
        .filter(Boolean)
        .join(' ') || undefined
    const handleChange = (event: ChangeEvent<HTMLTextAreaElement>): void => {
      setTyped(event.target.value.length)
      ;(onChange ?? context.fieldProps.onChange)?.(event)
    }

    useIsomorphicLayoutEffect(() => {
      if (hasOwnMeta) registerField({ defaultValue, maxLength, value })
    }, [defaultValue, hasOwnMeta, maxLength, registerField, value])

    return (
      <textarea
        {...merged}
        aria-describedby={describedBy}
        className={textareaFieldClasses({
          className,
          disabled: Boolean(disabled),
          invalid,
          resize: context.resize,
          shape: context.shape,
          size: context.size,
          variant: context.variant,
        })}
        data-disabled={disabled ? '' : undefined}
        data-invalid={invalid ? '' : undefined}
        data-plume-textarea-field=""
        disabled={disabled}
        onChange={handleChange}
        ref={mergedRef}
        style={style}
      />
    )
  },
)

TextareaField.displayName = 'TextareaField'
