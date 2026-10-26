'use client'

import type { ForwardedRef, HTMLAttributes, ReactNode } from 'react'
import { forwardRef } from 'react'
import { joinClasses } from '../../../overlay/class-names'
import { CheckIcon } from '../../../overlay/icons'
import type { ComponentProps } from '../../../theme'
import { useSelectContext } from './select-context'
import { useSelectOptionContext } from './select-option-context'
import styles from './select.module.css'

type SelectOptionCheckRootAttributes = Pick<HTMLAttributes<HTMLSpanElement>, 'children'>

export type SelectOptionCheckProps = Omit<ComponentProps, 'index'> & SelectOptionCheckRootAttributes

/**
 * The check at the end of an option, shown while it is chosen. Its `children` replace the check.
 */
export const SelectOptionCheck = forwardRef<HTMLSpanElement, SelectOptionCheckProps>(
  (
    { children, className, style }: SelectOptionCheckProps,
    ref: ForwardedRef<HTMLSpanElement>,
  ): ReactNode => {
    const { isStyled } = useSelectContext('SelectOptionCheck')
    const { selected } = useSelectOptionContext('SelectOptionCheck')
    if (!selected) return null

    return (
      <span
        aria-hidden="true"
        className={joinClasses(isStyled && styles.check, className)}
        data-plume-select-option-check=""
        ref={ref}
        style={style}
      >
        {children ?? <CheckIcon />}
      </span>
    )
  },
)

SelectOptionCheck.displayName = 'SelectOptionCheck'
