'use client'

import type { ButtonHTMLAttributes, ForwardedRef, HTMLInputTypeAttribute, ReactNode } from 'react'
import { forwardRef, useState } from 'react'
import { joinClasses } from '../../../overlay/class-names'
import { EyeIcon, EyeOffIcon } from '../../../overlay/icons'
import type { ComponentProps } from '../../../theme'
import { useInputContext } from './input-context'
import styles from './input.module.css'

export type InputRevealProps = Omit<ComponentProps, 'index'> &
  Pick<ButtonHTMLAttributes<HTMLButtonElement>, 'aria-label' | 'children' | 'disabled' | 'onClick'>

export const InputReveal = forwardRef<HTMLButtonElement, InputRevealProps>(
  (
    { 'aria-label': ariaLabel, children, className, disabled, onClick, style }: InputRevealProps,
    ref: ForwardedRef<HTMLButtonElement>,
  ): ReactNode => {
    const context = useInputContext('InputReveal')
    const { isStyled, labels, revealed, toggleReveal } = context
    const isDisabled = disabled ?? context.disabled

    return (
      <span
        className={joinClasses(
          isStyled && styles.element,
          isStyled && styles.elementAfter,
          isStyled && styles.revealSlot,
        )}
      >
        <button
          aria-label={ariaLabel ?? labels.reveal}
          aria-pressed={revealed}
          className={joinClasses(isStyled && styles.revealButton, className)}
          data-disabled={isDisabled ? '' : undefined}
          data-plume-input-reveal=""
          disabled={isDisabled}
          onClick={(event) => {
            onClick?.(event)
            toggleReveal()
          }}
          ref={ref}
          style={style}
          type="button"
        >
          {children ?? (revealed ? <EyeOffIcon /> : <EyeIcon />)}
        </button>
      </span>
    )
  },
)

InputReveal.displayName = 'InputReveal'

interface PasswordReveal {
  canReveal: boolean
  revealed: boolean
  toggle: () => void
}

export function usePasswordReveal(
  type: HTMLInputTypeAttribute,
  revealable: boolean,
): PasswordReveal {
  const [revealed, setRevealed] = useState(false)
  return {
    canReveal: revealable && type === 'password',
    revealed,
    toggle: () => setRevealed((current) => !current),
  }
}
