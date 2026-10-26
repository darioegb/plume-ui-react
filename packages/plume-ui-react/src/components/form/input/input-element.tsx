'use client'

import type { ForwardedRef, HTMLAttributes, ReactNode } from 'react'
import { forwardRef } from 'react'
import { joinClasses } from '../../../overlay/class-names'
import type { ComponentProps } from '../../../theme'
import { useInputContext } from './input-context'
import type { InputSide } from './input-addon'
import styles from './input.module.css'

export interface InputElementOwnProps {
  /**
   * Which side of the field the element goes on.
   *
   * @default 'before'
   */
  position?: InputSide
}

export type InputElementProps = Omit<ComponentProps, 'index'> &
  Pick<HTMLAttributes<HTMLSpanElement>, 'children'> &
  InputElementOwnProps

/** An icon or a small piece of content inside the field. */
export const InputElement = forwardRef<HTMLSpanElement, InputElementProps>(
  (
    { children, className, position = 'before', style }: InputElementProps,
    ref: ForwardedRef<HTMLSpanElement>,
  ): ReactNode => {
    const { isStyled } = useInputContext('InputElement')

    return (
      <span
        className={joinClasses(
          isStyled && styles.element,
          isStyled && (position === 'before' ? styles.elementBefore : styles.elementAfter),
          className,
        )}
        data-plume-input-element=""
        data-position={position}
        ref={ref}
        style={style}
      >
        {children}
      </span>
    )
  },
)

InputElement.displayName = 'InputElement'
