'use client'

import type {
  ChangeEvent,
  CSSProperties,
  ForwardedRef,
  InputHTMLAttributes,
  MouseEvent,
} from 'react'
import { forwardRef } from 'react'
import type { ColorScheme, ComponentProps, Size } from '../../../theme'
import { joinClasses } from '../../../overlay/class-names'
import { useRadioGroupContext } from './radio-group-context'
import styles from './radio.module.css'

export interface RadioOwnProps {
  colorScheme?: ColorScheme
  readOnly?: boolean
  size?: Size
  variant?: RadioVariant
}

export type RadioVariant = 'solid' | 'outline' | 'unstyled'

type RadioRootAttributes = Pick<
  InputHTMLAttributes<HTMLInputElement>,
  | 'aria-describedby'
  | 'aria-invalid'
  | 'aria-label'
  | 'aria-labelledby'
  | 'checked'
  | 'defaultChecked'
  | 'disabled'
  | 'id'
  | 'name'
  | 'onBlur'
  | 'onChange'
  | 'onFocus'
  | 'required'
  | 'value'
>

export type RadioProps = Omit<ComponentProps, 'index'> & RadioRootAttributes & RadioOwnProps

const radioColorVars = (colorScheme: ColorScheme, style?: CSSProperties): CSSProperties =>
  ({
    '--radio-solid': `var(--plume-color-${colorScheme}-solid)`,
    '--radio-contrast': `var(--plume-color-${colorScheme}-solid-contrast)`,
    '--radio-text': `var(--plume-color-${colorScheme}-text)`,
    ...style,
  }) as CSSProperties

export const Radio = forwardRef<HTMLInputElement, RadioProps>(
  (
    {
      checked,
      className,
      colorScheme,
      defaultChecked,
      disabled = false,
      name,
      onChange,
      readOnly = false,
      required = false,
      size,
      style,
      value,
      variant,
      ...rest
    }: RadioProps,
    ref: ForwardedRef<HTMLInputElement>,
  ) => {
    const group = useRadioGroupContext()
    const resolvedVariant = variant ?? group?.variant ?? 'solid'
    const isStyled = resolvedVariant !== 'unstyled'
    const isInvalid =
      rest['aria-invalid'] === true || rest['aria-invalid'] === 'true' || Boolean(group?.invalid)
    const isDisabled = disabled || Boolean(group?.disabled)
    const isReadOnly = readOnly || Boolean(group?.readOnly)
    const resolvedSize = size ?? group?.size ?? 'md'
    const resolvedColorScheme = colorScheme ?? group?.colorScheme ?? 'primary'
    const preventWhenReadOnly = (event: MouseEvent<HTMLInputElement>): void => {
      if (isReadOnly) event.preventDefault()
    }

    const handleChange = (event: ChangeEvent<HTMLInputElement>): void => {
      if (isReadOnly) return
      onChange?.(event)
      group?.select(String(value ?? ''), event)
    }

    const stateProps = group
      ? {
          checked: group.value === String(value ?? ''),
          name: group.name,
          required: group.required || required,
        }
      : { checked, defaultChecked, name, required }

    return (
      <input
        className={joinClasses(
          isStyled && styles.radio,
          isStyled && styles[resolvedSize],
          isStyled && styles[resolvedVariant],
          isStyled && isInvalid && styles.invalid,
          className,
        )}
        disabled={isDisabled}
        onChange={onChange || group ? handleChange : undefined}
        onClick={preventWhenReadOnly}
        ref={ref}
        style={radioColorVars(isInvalid ? 'error' : resolvedColorScheme, style)}
        type="radio"
        value={value}
        {...stateProps}
        {...rest}
      />
    )
  },
)

Radio.displayName = 'Radio'
