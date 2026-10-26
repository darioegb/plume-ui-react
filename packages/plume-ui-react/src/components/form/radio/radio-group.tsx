'use client'

import type { ChangeEvent, ForwardedRef, HTMLAttributes } from 'react'
import { forwardRef, useCallback, useId, useMemo, useState } from 'react'
import type { ColorScheme, ComponentProps, Size } from '../../../theme'
import { useFieldContext } from '../field/field-context'
import type { RadioVariant } from './radio'
import { RadioGroupContext } from './radio-group-context'
import styles from './radio-group.module.css'

export interface RadioGroupOwnProps {
  /** Color scheme for the radios of the group, from the theme palette. */
  colorScheme?: ColorScheme
  /** Value of the radio selected at first, when the group is uncontrolled. */
  defaultValue?: string
  /**
   * Disables every radio of the group.
   * @default false
   */
  disabled?: boolean
  /** Name shared by the radios of the group. A generated one is used when it is not set. */
  name?: string
  /** Called with the value of the radio the user selects. */
  onValueChange?: (value: string, event: ChangeEvent<HTMLInputElement>) => void
  /**
   * Direction in which the radios are laid out.
   * @default 'vertical'
   */
  orientation?: RadioGroupOrientation
  /**
   * Keeps the selection without letting the user change it.
   * @default false
   */
  readOnly?: boolean
  /**
   * Marks the group as required.
   * @default false
   */
  required?: boolean
  /**
   * Size of the radios of the group.
   * @default 'md'
   */
  size?: Size
  /** Value of the selected radio, for a controlled group. Pair it with `onValueChange`. */
  value?: string
  /**
   * Visual variant of the radios of the group.
   * @default 'solid'
   */
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

/**
 * Manages a group of radios in one place: it owns the value and the name, and passes the size,
 * color scheme and variant down to its `Radio` children.
 */
export const RadioGroup = forwardRef<HTMLDivElement, RadioGroupProps>(
  (
    {
      children,
      className = '',
      colorScheme,
      defaultValue,
      disabled = false,
      name,
      onValueChange: onChange,
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
