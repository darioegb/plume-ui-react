'use client'

import type { ForwardedRef, HTMLAttributes, ReactNode } from 'react'
import { forwardRef } from 'react'
import { joinClasses } from '../../../overlay/class-names'
import type { ComponentProps } from '../../../theme'
import { useButtonContext } from './button-context'
import styles from './button.module.css'

export type ButtonLabelProps = Omit<ComponentProps, 'index'> &
  Pick<HTMLAttributes<HTMLSpanElement>, 'children' | 'id'>

/**
 * The text of the Button. While the Button is busy it shows the `busyText` of the Button or,
 * without one, it is visually hidden (`data-hidden`) and still names the Button.
 */
export const ButtonLabel = forwardRef<HTMLSpanElement, ButtonLabelProps>(
  (
    { children, className, ...rest }: ButtonLabelProps,
    ref: ForwardedRef<HTMLSpanElement>,
  ): ReactNode => {
    const { busy, busyText, isStyled } = useButtonContext('ButtonLabel')
    const isHidden = busy && !busyText

    return (
      <span
        className={joinClasses(isStyled && !isHidden && styles.iconMargin, className)}
        data-hidden={isHidden ? '' : undefined}
        data-plume-button-label=""
        ref={ref}
        {...rest}
      >
        {busy && busyText ? busyText : children}
      </span>
    )
  },
)

ButtonLabel.displayName = 'ButtonLabel'
