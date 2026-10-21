'use client'

import type { ReactNode } from 'react'
import { MinusIcon, PlusIcon } from '../../../overlay/icons'
import { useHoldRepeat } from './use-hold-repeat'

interface NumberInputStepperProps {
  className: string | undefined
  direction: 1 | -1
  disabled: boolean
  label: string
  onStep: () => void
}

export function NumberInputStepper({
  className,
  direction,
  disabled,
  label,
  onStep,
}: Readonly<NumberInputStepperProps>): ReactNode {
  const hold = useHoldRepeat(onStep, !disabled)

  return (
    <button
      aria-label={label}
      className={className}
      data-plume-numberinput-stepper={direction === 1 ? 'increment' : 'decrement'}
      disabled={disabled}
      onMouseDown={(event) => event.preventDefault()}
      tabIndex={-1}
      type="button"
      {...hold}
    >
      {direction === 1 ? <PlusIcon /> : <MinusIcon />}
    </button>
  )
}
