'use client'

import type { ForwardedRef, HTMLAttributes, ReactNode } from 'react'
import { forwardRef, useMemo } from 'react'
import { joinClasses } from '../../../overlay/class-names'
import { mergeRefs } from '../../../overlay/trigger'
import type { ComponentProps } from '../../../theme'
import styles from './table.module.css'
import { useTableContext } from './table-context'

type TableElementRootAttributes = Pick<
  HTMLAttributes<HTMLTableElement>,
  'aria-label' | 'aria-labelledby' | 'children' | 'hidden' | 'id' | 'title'
>

export type TableElementProps = Omit<ComponentProps, 'index'> & TableElementRootAttributes

export const TableElement = forwardRef<HTMLTableElement, TableElementProps>(
  (
    {
      'aria-label': ariaLabel,
      'aria-labelledby': ariaLabelledBy,
      children,
      className,
      style,
      ...rest
    }: TableElementProps,
    ref: ForwardedRef<HTMLTableElement>,
  ): ReactNode => {
    const context = useTableContext('TableElement')
    const { hoverable, isStyled, loading, size, stickyHeader, tableRef, variant } = context
    const setRef = useMemo(() => mergeRefs(tableRef, ref), [tableRef, ref])
    const hasName = ariaLabel !== undefined || ariaLabelledBy !== undefined

    return (
      <table
        aria-busy={loading ? true : undefined}
        aria-label={hasName ? ariaLabel : context.ariaLabel}
        aria-labelledby={hasName ? ariaLabelledBy : context.ariaLabelledBy}
        className={joinClasses(
          isStyled && styles.table,
          isStyled && styles[variant],
          isStyled && styles[size],
          className,
        )}
        data-hoverable={hoverable ? '' : undefined}
        data-loading={loading ? '' : undefined}
        data-plume-table-element=""
        data-sticky={stickyHeader ? '' : undefined}
        ref={setRef}
        style={style}
        {...rest}
      >
        {children}
      </table>
    )
  },
)

TableElement.displayName = 'TableElement'
