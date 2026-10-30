'use client'

import type { ForwardedRef, HTMLAttributes, ReactNode } from 'react'
import { forwardRef } from 'react'
import { joinClasses } from '../../../overlay/class-names'
import type { ComponentProps } from '../../../theme'
import { useButtonContext } from './button-context'
import styles from './button.module.css'

export type ButtonIconProps = Omit<ComponentProps, 'index'> &
  Pick<HTMLAttributes<HTMLSpanElement>, 'aria-hidden' | 'children'>

/** The box of an icon of the Button, before or after its label. */
export const ButtonIcon = forwardRef<HTMLSpanElement, ButtonIconProps>(
  ({ className, ...rest }: ButtonIconProps, ref: ForwardedRef<HTMLSpanElement>): ReactNode => {
    const { isStyled } = useButtonContext('ButtonIcon')

    return (
      <span
        className={joinClasses(isStyled && styles.iconMargin, className)}
        data-plume-button-icon=""
        ref={ref}
        {...rest}
      />
    )
  },
)

ButtonIcon.displayName = 'ButtonIcon'
