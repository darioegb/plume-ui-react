'use client'

import type { ForwardedRef, HTMLAttributes, ReactNode } from 'react'
import { forwardRef } from 'react'
import { joinClasses } from '../../../overlay/class-names'
import type { ComponentProps } from '../../../theme'
import { useInputContext } from './input-context'
import styles from './input.module.css'

export type InputSide = 'before' | 'after'

export interface InputAddonOwnProps {
  /**
   * Which side of the field the addon goes on.
   *
   * @default 'before'
   */
  position?: InputSide
}

export type InputAddonProps = Omit<ComponentProps, 'index'> &
  Pick<HTMLAttributes<HTMLSpanElement>, 'children'> &
  InputAddonOwnProps

/** A block with a border and a background beside the field, like a currency or a domain. */
export const InputAddon = forwardRef<HTMLSpanElement, InputAddonProps>(
  (
    { children, className, position = 'before', style }: InputAddonProps,
    ref: ForwardedRef<HTMLSpanElement>,
  ): ReactNode => {
    const { isStyled } = useInputContext('InputAddon')

    return (
      <span
        className={joinClasses(
          isStyled && styles.addOn,
          isStyled && (position === 'before' ? styles.addOnBefore : styles.addOnAfter),
          className,
        )}
        data-plume-input-addon=""
        data-position={position}
        ref={ref}
        style={style}
      >
        {children}
      </span>
    )
  },
)

InputAddon.displayName = 'InputAddon'
