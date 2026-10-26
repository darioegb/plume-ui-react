'use client'

import type { ButtonHTMLAttributes, ForwardedRef, ReactNode } from 'react'
import { forwardRef } from 'react'
import { joinClasses } from '../../../overlay/class-names'
import { CloseIcon } from '../../../overlay/icons'
import type { ComponentProps } from '../../../theme'
import { useSelectContext } from './select-context'
import styles from './select.module.css'

type SelectClearRootAttributes = Pick<ButtonHTMLAttributes<HTMLButtonElement>, 'children'>

export type SelectClearProps = Omit<ComponentProps, 'index'> & SelectClearRootAttributes

/**
 * The button that clears the value. It renders nothing when the select is not `clearable` or has no
 * value.
 */
export const SelectClear = forwardRef<HTMLButtonElement, SelectClearProps>(
  (
    { children, className, style }: SelectClearProps,
    ref: ForwardedRef<HTMLButtonElement>,
  ): ReactNode => {
    const context = useSelectContext('SelectClear')
    if (!context.canClear || context.selected.length === 0) return null

    return (
      <button
        aria-label={context.labels.clear}
        className={joinClasses(context.isStyled && styles.clear, className)}
        data-plume-select-clear=""
        onClick={context.clear}
        ref={ref}
        style={style}
        type="button"
      >
        {children ?? <CloseIcon />}
      </button>
    )
  },
)

SelectClear.displayName = 'SelectClear'
