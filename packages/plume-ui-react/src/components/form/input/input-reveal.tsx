'use client'

import type { HTMLInputTypeAttribute, ReactNode } from 'react'
import { useState } from 'react'
import { joinClasses } from '../../../overlay/class-names'
import { EyeIcon, EyeOffIcon } from '../../../overlay/icons'
import styles from './input.module.css'

interface InputRevealProps {
  className?: string
  disabled: boolean
  isStyled: boolean
  label: string
  onToggle: () => void
  visible: boolean
}

export function InputReveal({
  className,
  disabled,
  isStyled,
  label,
  onToggle,
  visible,
}: Readonly<InputRevealProps>): ReactNode {
  return (
    <span className={isStyled ? `${styles.element} ${styles.reveal}` : undefined}>
      <button
        aria-label={label}
        aria-pressed={visible}
        className={joinClasses(isStyled && styles.revealButton, className)}
        data-plume-input-reveal=""
        disabled={disabled}
        onClick={onToggle}
        type="button"
      >
        {visible ? <EyeOffIcon /> : <EyeIcon />}
      </button>
    </span>
  )
}

interface PasswordReveal {
  canReveal: boolean
  inputType: HTMLInputTypeAttribute
  revealed: boolean
  toggle: () => void
}

export function usePasswordReveal(
  type: HTMLInputTypeAttribute,
  revealable: boolean,
): PasswordReveal {
  const [revealed, setRevealed] = useState(false)
  const canReveal = revealable && type === 'password'
  return {
    canReveal,
    inputType: canReveal && revealed ? 'text' : type,
    revealed,
    toggle: () => setRevealed((current) => !current),
  }
}

export const afterElementClass = (isStyled: boolean, canReveal: boolean): string => {
  if (!isStyled) return ''
  return canReveal ? `${styles.element} ${styles.beforeReveal}` : styles.element
}
