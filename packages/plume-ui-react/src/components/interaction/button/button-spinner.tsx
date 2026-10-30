'use client'

import type { CSSProperties, ForwardedRef, ReactNode } from 'react'
import { forwardRef } from 'react'
import { joinClasses } from '../../../overlay/class-names'
import type { ComponentProps } from '../../../theme'
import { Spinner } from '../../presentation/spinner'
import { useButtonContext } from './button-context'
import styles from './button.module.css'

export interface ButtonSpinnerProps extends Omit<ComponentProps, 'index'> {
  /** Accessible name of the spinner. It defaults to the `busy` text of the Button's `labels`. */
  label?: string
}

/**
 * The `Spinner` shown while the Button is busy. It renders nothing otherwise, so a composition can
 * always include it. The `ref` goes to the spinner.
 */
export const ButtonSpinner = forwardRef<HTMLOutputElement, ButtonSpinnerProps>(
  (
    { className, label, style }: ButtonSpinnerProps,
    ref: ForwardedRef<HTMLOutputElement>,
  ): ReactNode => {
    const { busy, busyText, isStyled, labels } = useButtonContext('ButtonSpinner')
    if (!busy) return null

    return (
      <Spinner
        className={joinClasses(isStyled && busyText && styles.spinnerMargin, className)}
        data-plume-button-spinner=""
        label={label ?? labels.busy}
        ref={ref}
        size={isStyled ? 'sm' : undefined}
        style={{ '--spinner-scheme': 'var(--button-contrast-color)', ...style } as CSSProperties}
        variant={isStyled ? 'solid' : 'unstyled'}
      />
    )
  },
)

ButtonSpinner.displayName = 'ButtonSpinner'
