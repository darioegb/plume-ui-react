'use client'

import type {
  ChangeEvent,
  CSSProperties,
  ForwardedRef,
  InputHTMLAttributes,
  MouseEvent,
} from 'react'
import { forwardRef, useEffect, useImperativeHandle, useRef } from 'react'
import type { ColorScheme, ComponentProps, Size } from '../../../theme'
import { useControlLabelledBy } from '../field/use-control-labelled-by'
import styles from './checkbox.module.css'

export type CheckboxPart = 'input' | 'label'

export interface CheckboxOwnProps {
  classNames?: Partial<Record<CheckboxPart, string>>
  /** @deprecated Use `classNames.input`. */
  inputClassName?: string
  /** @deprecated Use `classNames.label`. */
  labelClassName?: string
  colorScheme?: ColorScheme
  indeterminate?: boolean
  readOnly?: boolean
  size?: Size
  variant?: CheckboxVariant
}

export type CheckboxVariant = 'solid' | 'outline' | 'unstyled'

type CheckboxRootAttributes = Pick<
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

export type CheckboxProps = Omit<ComponentProps, 'index'> &
  CheckboxRootAttributes &
  CheckboxOwnProps

const checkboxColorVars = (colorScheme: ColorScheme, style?: CSSProperties): CSSProperties =>
  ({
    '--checkbox-solid': `var(--plume-color-${colorScheme}-solid)`,
    '--checkbox-contrast': `var(--plume-color-${colorScheme}-solid-contrast)`,
    '--checkbox-text': `var(--plume-color-${colorScheme}-text)`,
    ...style,
  }) as CSSProperties

const CheckboxControl = forwardRef<HTMLInputElement, CheckboxProps>(
  (
    {
      children,
      className = '',
      classNames,
      inputClassName = '',
      labelClassName = '',
      colorScheme = 'primary',
      disabled = false,
      onChange,
      indeterminate = false,
      readOnly = false,
      size = 'md',
      style,
      variant = 'solid',
      ...rest
    }: CheckboxProps,
    ref: ForwardedRef<HTMLInputElement>,
  ) => {
    const inputRef = useRef<HTMLInputElement>(null)
    const isStyled = variant !== 'unstyled'
    const { labelledBy, textId } = useControlLabelledBy({
      hasText: Boolean(children),
      id: rest.id,
      labelledBy: rest['aria-labelledby'],
    })
    const Wrapper = children ? 'label' : 'span'
    const isInvalid = rest['aria-invalid'] === true || rest['aria-invalid'] === 'true'

    useImperativeHandle(ref, () => inputRef.current as HTMLInputElement)

    useEffect(() => {
      if (inputRef.current) inputRef.current.indeterminate = indeterminate
    }, [indeterminate])

    const rootClasses = [
      isStyled && styles.root,
      isStyled && styles[size],
      disabled && styles.disabled,
      className,
    ]
      .filter(Boolean)
      .join(' ')
    const inputClasses =
      [
        isStyled && styles.checkbox,
        isStyled && styles[variant],
        isStyled && isInvalid && styles.invalid,
        inputClassName,
        classNames?.input,
      ]
        .filter(Boolean)
        .join(' ') || undefined

    const preventWhenReadOnly = (event: MouseEvent<HTMLInputElement>): void => {
      if (readOnly) event.preventDefault()
    }

    const ignoreWhenReadOnly = (event: ChangeEvent<HTMLInputElement>): void => {
      if (!readOnly) onChange?.(event)
    }

    return (
      <Wrapper
        className={rootClasses}
        style={checkboxColorVars(isInvalid ? 'error' : colorScheme, style)}
      >
        <input
          aria-readonly={readOnly || undefined}
          className={inputClasses}
          disabled={disabled}
          onChange={onChange ? ignoreWhenReadOnly : undefined}
          onClick={preventWhenReadOnly}
          ref={inputRef}
          type="checkbox"
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

CheckboxControl.displayName = 'Checkbox'

export const Checkbox = Object.assign(CheckboxControl, { labelsItself: true })
