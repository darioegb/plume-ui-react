'use client'

import type { ForwardedRef, HTMLAttributes, ReactNode } from 'react'
import { forwardRef } from 'react'
import { joinClasses } from '../../../overlay/class-names'
import type { ComponentProps } from '../../../theme'
import { useSelectContext } from './select-context'
import styles from './select.module.css'

type SelectEmptyRootAttributes = Pick<HTMLAttributes<HTMLDivElement>, 'children'>

export type SelectEmptyProps = Omit<ComponentProps, 'index'> & SelectEmptyRootAttributes

/**
 * The message when the search finds nothing. Its `children` replace the text of `labels.empty`.
 */
export const SelectEmpty = forwardRef<HTMLDivElement, SelectEmptyProps>(
  (
    { children, className, style }: SelectEmptyProps,
    ref: ForwardedRef<HTMLDivElement>,
  ): ReactNode => {
    const { isStyled, labels, options, query } = useSelectContext('SelectEmpty')
    const needle = query.toLowerCase()
    const hasMatches = options.some(
      (option) => !query || option.label.toLowerCase().includes(needle),
    )
    if (!query || hasMatches) return null

    return (
      <div
        className={joinClasses(isStyled && styles.empty, className)}
        data-plume-select-empty=""
        ref={ref}
        style={style}
      >
        {children ?? labels.empty}
      </div>
    )
  },
)

SelectEmpty.displayName = 'SelectEmpty'
