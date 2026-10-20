'use client'

import type { ChangeEvent, ForwardedRef, HTMLAttributes } from 'react'
import { forwardRef, useCallback, useId, useMemo, useState } from 'react'
import type { ColorScheme, ComponentProps, Size } from '../../../theme'
import { useFieldContext } from '../field/field-context'
import type { RadioVariant } from './radio'
import { RadioGroupContext } from './radio-group-context'
import styles from './radio-group.module.css'

export interface RadioGroupOwnProps {
  colorScheme?: ColorScheme
  defaultValue?: string
  disabled?: boolean
  name?: string
  onChange?: (value: string, event: ChangeEvent<HTMLInputElement>) => void
  orientation?: RadioGroupOrientation
  readOnly?: boolean
  required?: boolean
  size?: Size
  value?: string
  variant?: RadioVariant
}

export type RadioGroupOrientation = 'vertical' | 'horizontal'

type RadioGroupRootAttributes = Pick<
  HTMLAttributes<HTMLDivElement>,
  'aria-describedby' | 'aria-invalid' | 'aria-label' | 'aria-labelledby' | 'children' | 'id'
>

export type RadioGroupProps = Omit<ComponentProps, 'index'> &
  RadioGroupRootAttributes &
  RadioGroupOwnProps

export const RadioGroup = forwardRef<HTMLDivElement, RadioGroupProps>(
  (
    {
      children,
      className = '',
      colorScheme,
      defaultValue,
      disabled = false,
      name,
      onChange,
      orientation = 'vertical',
      readOnly = false,
      required = false,
      size,
      style,
      value,
      variant,
      ...rest
    }: RadioGroupProps,
    ref: ForwardedRef<HTMLDivElement>,
  ) => {
    const generatedName = useId()
    const field = useFieldContext()
    const [internalValue, setInternalValue] = useState(defaultValue)
    const isControlled = value !== undefined
    const currentValue = isControlled ? value : internalValue
    const isInvalid = rest['aria-invalid'] === true || rest['aria-invalid'] === 'true'
    const labelledBy = rest['aria-labelledby'] ?? (rest['aria-label'] ? undefined : field?.labelId)

    const select = useCallback(
      (next: string, event: ChangeEvent<HTMLInputElement>): void => {
        if (!isControlled) setInternalValue(next)
        onChange?.(next, event)
      },
      [isControlled, onChange],
    )

    const context = useMemo(
      () => ({
        colorScheme,
        disabled,
        invalid: isInvalid,
        name: name ?? generatedName,
        readOnly,
        required,
        select,
        size,
        value: currentValue,
        variant,
      }),
      [
        colorScheme,
        currentValue,
        disabled,
        generatedName,
        isInvalid,
        name,
        readOnly,
        required,
        select,
        size,
        variant,
      ],
    )

    return (
      <RadioGroupContext.Provider value={context}>
        <div
          {...rest}
          aria-disabled={disabled || undefined}
          aria-labelledby={labelledBy}
          aria-readonly={readOnly || undefined}
          aria-required={required || undefined}
          className={`${styles.group} ${styles[orientation]} ${className}`.trim()}
          ref={ref}
          role="radiogroup"
          style={style}
        >
          {children}
        </div>
      </RadioGroupContext.Provider>
    )
  },
)

RadioGroup.displayName = 'RadioGroup'
