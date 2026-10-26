'use client'

import type { ButtonHTMLAttributes, ForwardedRef, ReactNode } from 'react'
import { forwardRef } from 'react'
import { joinClasses } from '../../../overlay/class-names'
import { MinusIcon, PlusIcon } from '../../../overlay/icons'
import type { ComponentProps } from '../../../theme'
import { useNumberInputContext } from './numberinput-context'
import styles from './numberinput.module.css'
import { useHoldRepeat } from './use-hold-repeat'

export interface NumberInputStepperOwnProps {
  /**
   * Accessible name of the button. It defaults to `labels.decrement` or `labels.increment` of the `NumberInput`.
   */
  label?: string
}

type NumberInputStepperRootAttributes = Pick<
  ButtonHTMLAttributes<HTMLButtonElement>,
  'children' | 'disabled' | 'id' | 'title'
>

export type NumberInputStepperProps = Omit<ComponentProps, 'index'> &
  NumberInputStepperRootAttributes &
  NumberInputStepperOwnProps

interface NumberInputStepperInternalProps extends NumberInputStepperProps {
  direction: 1 | -1
  part: string
}

export const NumberInputStepper = forwardRef<HTMLButtonElement, NumberInputStepperInternalProps>(
  (
    {
      children,
      className,
      direction,
      disabled = false,
      label,
      part,
      style,
      ...rest
    }: NumberInputStepperInternalProps,
    ref: ForwardedRef<HTMLButtonElement>,
  ): ReactNode => {
    const context = useNumberInputContext(part)
    const { inputRef, isStyled, labels, number } = context
    const canStep = direction === 1 ? number.canIncrement : number.canDecrement
    const isDisabled = disabled || context.disabled || !canStep
    const hold = useHoldRepeat(() => {
      inputRef.current?.focus()
      number.stepBy(direction)
    }, !isDisabled)
    const name = direction === 1 ? 'increment' : 'decrement'

    return (
      <button
        aria-label={label ?? labels[name]}
        className={joinClasses(isStyled && styles.stepper, className)}
        data-disabled={isDisabled ? '' : undefined}
        data-plume-numberinput-stepper={name}
        disabled={isDisabled}
        onMouseDown={(event) => event.preventDefault()}
        ref={ref}
        style={style}
        tabIndex={-1}
        type="button"
        {...rest}
        {...hold}
      >
        {children ?? (direction === 1 ? <PlusIcon /> : <MinusIcon />)}
      </button>
    )
  },
)

NumberInputStepper.displayName = 'NumberInputStepper'
