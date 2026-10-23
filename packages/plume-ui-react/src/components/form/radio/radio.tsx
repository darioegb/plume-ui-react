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
import { useControlLabelledBy } from '../field/use-control-labelled-by'
import { useRadioGroupContext } from './radio-group-context'
import styles from './radio.module.css'

export type RadioPart = 'input' | 'label'

export interface RadioOwnProps {
  classNames?: Partial<Record<RadioPart, string>>
  /** Alias of `classNames.input`, kept until the next major. */
  inputClassName?: string
  /** Alias of `classNames.label`, kept until the next major. */
  labelClassName?: string
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
  | 'children'
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

const RadioControl = forwardRef<HTMLInputElement, RadioProps>(
  (
    {
      checked,
      children,
      className = '',
      classNames,
      inputClassName = '',
      labelClassName = '',
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
    const { labelledBy, textId } = useControlLabelledBy({
      hasText: Boolean(children),
      id: rest.id,
      labelledBy: rest['aria-labelledby'],
    })
    const Wrapper = children ? 'label' : 'span'
    const isStyled = resolvedVariant !== 'unstyled'
    const isInvalid =
      rest['aria-invalid'] === true || rest['aria-invalid'] === 'true' || Boolean(group?.invalid)
    const isDisabled = disabled || Boolean(group?.disabled)
    const isReadOnly = readOnly || Boolean(group?.readOnly)
    const resolvedSize = size ?? group?.size ?? 'md'
    const resolvedColorScheme = colorScheme ?? group?.colorScheme ?? 'primary'
    const rootClasses = [
      isStyled && styles.root,
      isStyled && styles[resolvedSize],
      isDisabled && styles.disabled,
      className,
    ]
      .filter(Boolean)
      .join(' ')
    const inputClasses =
      [
        isStyled && styles.radio,
        isStyled && styles[resolvedVariant],
        isStyled && isInvalid && styles.invalid,
        inputClassName,
        classNames?.input,
      ]
        .filter(Boolean)
        .join(' ') || undefined

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
      <Wrapper
        className={rootClasses}
        style={radioColorVars(isInvalid ? 'error' : resolvedColorScheme, style)}
      >
        <input
          className={inputClasses}
          disabled={isDisabled}
          onChange={onChange || group ? handleChange : undefined}
          onClick={preventWhenReadOnly}
          ref={ref}
          type="radio"
          value={value}
          {...stateProps}
          {...rest}
          aria-labelledby={labelledBy}
        />
        {children ? (
          <span
            className={
              [isStyled && styles.label, labelClassName, classNames?.label]
                .filter(Boolean)
                .join(' ') || undefined
            }
            id={textId}
          >
            {children}
          </span>
        ) : null}
      </Wrapper>
    )
  },
)

RadioControl.displayName = 'Radio'

export const Radio = Object.assign(RadioControl, { labelsItself: true })
