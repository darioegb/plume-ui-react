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
import styles from './toggle.module.css'

export type TogglePart = 'input' | 'label'

export interface ToggleOwnProps {
  classNames?: Partial<Record<TogglePart, string>>
  /** @deprecated Use `classNames.input`. */
  inputClassName?: string
  /** @deprecated Use `classNames.label`. */
  labelClassName?: string
  colorScheme?: ColorScheme
  readOnly?: boolean
  size?: Size
  variant?: ToggleVariant
}

export type ToggleVariant = 'solid' | 'outline' | 'raised' | 'unstyled'

type ToggleRootAttributes = Pick<
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

export type ToggleProps = Omit<ComponentProps, 'index'> & ToggleRootAttributes & ToggleOwnProps

const toggleColorVars = (colorScheme: ColorScheme, style?: CSSProperties): CSSProperties =>
  ({
    '--toggle-solid': `var(--plume-color-${colorScheme}-solid)`,
    '--toggle-contrast': `var(--plume-color-${colorScheme}-solid-contrast)`,
    '--toggle-text': `var(--plume-color-${colorScheme}-text)`,
    ...style,
  }) as CSSProperties

const ToggleControl = forwardRef<HTMLInputElement, ToggleProps>(
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
      readOnly = false,
      size = 'md',
      style,
      variant = 'solid',
      ...rest
    }: ToggleProps,
    ref: ForwardedRef<HTMLInputElement>,
  ) => {
    const isStyled = variant !== 'unstyled'
    const { labelledBy, textId } = useControlLabelledBy({
      hasText: Boolean(children),
      id: rest.id,
      labelledBy: rest['aria-labelledby'],
    })
    const Wrapper = children ? 'label' : 'span'
    const isInvalid = rest['aria-invalid'] === true || rest['aria-invalid'] === 'true'
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
        isStyled && styles.toggle,
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
        style={toggleColorVars(isInvalid ? 'error' : colorScheme, style)}
      >
        <input
          aria-readonly={readOnly || undefined}
          className={inputClasses}
          disabled={disabled}
          onChange={onChange ? ignoreWhenReadOnly : undefined}
          onClick={preventWhenReadOnly}
          ref={ref}
          role="switch"
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

ToggleControl.displayName = 'Toggle'

export const Toggle = Object.assign(ToggleControl, { labelsItself: true })
