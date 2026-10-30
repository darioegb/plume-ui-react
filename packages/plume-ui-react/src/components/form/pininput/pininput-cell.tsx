'use client'

import type { ForwardedRef, InputHTMLAttributes, ReactNode } from 'react'
import { forwardRef } from 'react'
import { joinClasses } from '../../../overlay/class-names'
import { mergeRefs } from '../../../overlay/trigger'
import type { ComponentProps } from '../../../theme'
import { usePinInputContext } from './pininput-context'
import styles from './pininput.module.css'

export interface PinInputCellOwnProps {
  /** Position of the box in the code, starting from 0. */
  index: number
}

type PinInputCellRootAttributes = Pick<
  InputHTMLAttributes<HTMLInputElement>,
  'aria-label' | 'autoComplete' | 'id' | 'inputMode' | 'placeholder' | 'title'
>

export type PinInputCellProps = Omit<ComponentProps, 'index'> &
  PinInputCellRootAttributes &
  PinInputCellOwnProps

/** One box of the code. It is filled when the position has a character. */
export const PinInputCell = forwardRef<HTMLInputElement, PinInputCellProps>(
  (
    {
      'aria-label': ariaLabel,
      autoComplete,
      className,
      index,
      inputMode,
      placeholder,
      style,
      ...rest
    }: PinInputCellProps,
    ref: ForwardedRef<HTMLInputElement>,
  ): ReactNode => {
    const context = usePinInputContext('PinInputCell')
    const { pin } = context
    const filled = Boolean(pin.value[index])

    return (
      <input
        aria-invalid={context.invalid || undefined}
        aria-label={ariaLabel ?? context.labels.input(index + 1, context.length)}
        aria-required={context.required || undefined}
        autoComplete={autoComplete ?? context.autoComplete}
        className={joinClasses(context.isStyled && styles.cell, className)}
        data-disabled={context.disabled ? '' : undefined}
        data-filled={filled ? '' : undefined}
        data-invalid={context.invalid ? '' : undefined}
        data-plume-pininput-cell=""
        disabled={context.disabled}
        inputMode={inputMode ?? (context.type === 'numeric' ? 'numeric' : 'text')}
        onChange={(event) => pin.onChange(index, event.target.value)}
        onFocus={(event) => event.target.select()}
        onKeyDown={(event) => pin.onKeyDown(index, event)}
        onPaste={(event) => pin.onPaste(index, event)}
        placeholder={placeholder ?? context.placeholder}
        readOnly={context.readOnly}
        ref={mergeRefs<HTMLInputElement>(ref, (element) => {
          pin.cells.current[index] = element
        })}
        style={style}
        tabIndex={index === pin.tabbable ? 0 : -1}
        type={context.mask ? 'password' : 'text'}
        value={pin.value[index] ?? ''}
        {...rest}
      />
    )
  },
)

PinInputCell.displayName = 'PinInputCell'
