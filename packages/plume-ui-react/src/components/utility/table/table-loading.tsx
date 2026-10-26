'use client'

import type { ForwardedRef, HTMLAttributes, ReactNode } from 'react'
import { forwardRef } from 'react'
import { joinClasses } from '../../../overlay/class-names'
import type { ComponentProps } from '../../../theme'
import { Spinner } from '../../presentation/spinner'
import styles from './table.module.css'
import { useTableContext } from './table-context'

export interface TableLoadingOwnProps {
  /** The accessible name of the spinner. By default it is `labels.loading` of the `Table`. */
  label?: string
}

type TableLoadingRootAttributes = Pick<
  HTMLAttributes<HTMLDivElement>,
  'children' | 'hidden' | 'id' | 'title'
>

export type TableLoadingProps = Omit<ComponentProps, 'index'> &
  TableLoadingRootAttributes &
  TableLoadingOwnProps

/**
 * The veil with the `Spinner`, only while the `Table` is `loading`. `children` replace the
 * spinner.
 */
export const TableLoading = forwardRef<HTMLDivElement, TableLoadingProps>(
  (
    { children, className, label, style, ...rest }: TableLoadingProps,
    ref: ForwardedRef<HTMLDivElement>,
  ): ReactNode => {
    const { isStyled, labels, loading } = useTableContext('TableLoading')

    if (!loading) return null

    return (
      <div
        className={joinClasses(isStyled && styles.loading, className)}
        data-plume-table-loading=""
        ref={ref}
        style={style}
        {...rest}
      >
        {children ?? (
          <Spinner
            color="primary"
            label={label ?? labels.loading}
            variant={isStyled ? 'solid' : 'unstyled'}
          />
        )}
      </div>
    )
  },
)

TableLoading.displayName = 'TableLoading'
