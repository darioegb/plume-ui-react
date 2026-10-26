'use client'

import type { ForwardedRef, ReactNode } from 'react'
import { forwardRef } from 'react'
import { joinClasses } from '../../../overlay/class-names'
import { mergeRefs } from '../../../overlay/trigger'
import type { ComponentProps } from '../../../theme'
import type { NumberInputFieldAttributes } from './numberinput-context'
import { useNumberInputContext } from './numberinput-context'
import styles from './numberinput.module.css'

export type NumberInputFieldProps = Omit<ComponentProps, 'index'> & NumberInputFieldAttributes

/**
 * The `<input>`. It takes the attributes of the `NumberInput`, and the ones it gets itself win. The `ref` of the `NumberInput` goes to it.
 */
export const NumberInputField = forwardRef<HTMLInputElement, NumberInputFieldProps>(
  (
    { className, onBlur, style, ...rest }: NumberInputFieldProps,
    ref: ForwardedRef<HTMLInputElement>,
  ): ReactNode => {
    const {
      disabled,
      fieldProps,
      forwardedRef,
      inputRef,
      invalid,
      isStyled,
      max,
      min,
      number,
      precision,
      readOnly,
    } = useNumberInputContext('NumberInputField')
    const handleBlur = onBlur ?? fieldProps.onBlur

    return (
      <input
        aria-valuemax={max}
        aria-valuemin={min}
        aria-valuenow={number.value ?? undefined}
        aria-valuetext={number.valueText}
        autoComplete="off"
        className={joinClasses(isStyled && styles.input, className)}
        data-disabled={disabled ? '' : undefined}
        data-invalid={invalid ? '' : undefined}
        data-plume-numberinput-field=""
        disabled={disabled}
        inputMode={precision === 0 ? 'numeric' : 'decimal'}
        onChange={(event) => number.onTextChange(event.target.value)}
        onKeyDown={number.onKeyDown}
        readOnly={readOnly}
        ref={mergeRefs<HTMLInputElement>(inputRef, forwardedRef, ref)}
        role="spinbutton"
        style={style}
        type="text"
        value={number.display}
        {...fieldProps}
        {...rest}
        onBlur={(event) => {
          number.commit()
          handleBlur?.(event)
        }}
      />
    )
  },
)

NumberInputField.displayName = 'NumberInputField'
