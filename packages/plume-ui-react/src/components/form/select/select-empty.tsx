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
 * The message when the search finds nothing. Its `children` replace the text of `labels.empty`. It is
 * always in the page, as a live region, so a screen reader announces the message when it appears.
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
    const isEmpty = Boolean(query) && !hasMatches

    return (
      <div
        className={joinClasses(isStyled && isEmpty && styles.empty, className)}
        data-plume-select-empty=""
        ref={ref}
        role="status"
        style={style}
      >
        {isEmpty ? (children ?? labels.empty) : null}
      </div>
    )
  },
)

SelectEmpty.displayName = 'SelectEmpty'
