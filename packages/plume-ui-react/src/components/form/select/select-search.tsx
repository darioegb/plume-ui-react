'use client'

import type { ForwardedRef, HTMLAttributes, ReactNode } from 'react'
import { forwardRef } from 'react'
import { joinClasses } from '../../../overlay/class-names'
import type { ComponentProps } from '../../../theme'
import { useSelectContext } from './select-context'
import styles from './select.module.css'

type SelectSearchRootAttributes = Pick<HTMLAttributes<HTMLDivElement>, 'children'>

export type SelectSearchProps = Omit<ComponentProps, 'index'> & SelectSearchRootAttributes

/** The box around the search input. It renders nothing when the select is not `searchable`. */
export const SelectSearch = forwardRef<HTMLDivElement, SelectSearchProps>(
  (
    { children, className, style }: SelectSearchProps,
    ref: ForwardedRef<HTMLDivElement>,
  ): ReactNode => {
    const { isStyled, searchable } = useSelectContext('SelectSearch')
    if (!searchable) return null

    return (
      <div
        className={joinClasses(isStyled && styles.search, className)}
        data-plume-select-search=""
        ref={ref}
        style={style}
      >
        {children}
      </div>
    )
  },
)

SelectSearch.displayName = 'SelectSearch'
