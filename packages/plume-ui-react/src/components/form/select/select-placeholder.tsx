'use client'

import type { ForwardedRef, HTMLAttributes, ReactNode } from 'react'
import { forwardRef } from 'react'
import { joinClasses } from '../../../overlay/class-names'
import type { ComponentProps } from '../../../theme'
import { useSelectContext } from './select-context'
import styles from './select.module.css'

type SelectPlaceholderRootAttributes = Pick<HTMLAttributes<HTMLSpanElement>, 'children'>

export type SelectPlaceholderProps = Omit<ComponentProps, 'index'> & SelectPlaceholderRootAttributes

/** What the combobox shows when nothing is chosen. */
export const SelectPlaceholder = forwardRef<HTMLSpanElement, SelectPlaceholderProps>(
  (
    { children, className, style }: SelectPlaceholderProps,
    ref: ForwardedRef<HTMLSpanElement>,
  ): ReactNode => {
    const { isStyled } = useSelectContext('SelectPlaceholder')

    return (
      <span
        className={joinClasses(isStyled && styles.placeholder, className)}
        data-plume-select-placeholder=""
        ref={ref}
        style={style}
      >
        {children}
      </span>
    )
  },
)

SelectPlaceholder.displayName = 'SelectPlaceholder'
