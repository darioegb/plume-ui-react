'use client'

import type { CSSProperties, ForwardedRef, HTMLAttributes } from 'react'
import { forwardRef, useEffect, useMemo, useState } from 'react'
import { joinClasses } from '../../../overlay/class-names'
import { useLabels } from '../../../locale/locale-provider'
import { hasPart } from '../../../overlay/has-part'
import type { ComponentProps, Size } from '../../../theme'
import styles from './table.module.css'
import { TableContext } from './table-context'
import { TableElement } from './table-element'
import { TableLoading } from './table-loading'

export interface TableLabels {
  loading: string
}

export type TableVariant = 'plain' | 'bordered' | 'striped' | 'unstyled'

export interface TableOwnProps {
  hoverable?: boolean
  labels?: Partial<TableLabels>
  loading?: boolean
  maxHeight?: number | string
  size?: Size
  stickyHeader?: boolean
  variant?: TableVariant
}

type TableRootAttributes = Pick<
  HTMLAttributes<HTMLTableElement>,
  'aria-label' | 'aria-labelledby' | 'children' | 'hidden' | 'id' | 'title'
>

export type TableProps = Omit<ComponentProps, 'index'> & TableRootAttributes & TableOwnProps

const DEFAULT_LABELS: TableLabels = { loading: 'Loading' }

const TABLE_PARTS = [TableElement, TableLoading]

function useOverflow(container: HTMLElement | null): boolean {
  const [overflowing, setOverflowing] = useState(false)

  useEffect(() => {
    if (!container) return undefined
    const measure = (): void =>
      setOverflowing(
        container.scrollWidth > container.clientWidth ||
          container.scrollHeight > container.clientHeight,
      )
    measure()
    if (typeof ResizeObserver === 'undefined') return undefined
    const observer = new ResizeObserver(measure)
    observer.observe(container)
    if (container.firstElementChild) observer.observe(container.firstElementChild)
    return () => observer.disconnect()
  }, [container])

  return overflowing
}

export const Table = forwardRef<HTMLTableElement, TableProps>(
  (
    {
      'aria-label': ariaLabel,
      'aria-labelledby': ariaLabelledBy,
      children,
      className,
      hoverable = false,
      labels,
      loading = false,
      maxHeight,
      size = 'md',
      stickyHeader = false,
      style,
      variant = 'plain',
      ...rest
    }: TableProps,
    ref: ForwardedRef<HTMLTableElement>,
  ) => {
    const text = useLabels('table', DEFAULT_LABELS, labels)
    const isStyled = variant !== 'unstyled'
    const [container, setContainer] = useState<HTMLElement | null>(null)
    const scrollable = useOverflow(container)
    const containerStyle: CSSProperties | undefined =
      maxHeight === undefined ? style : { maxHeight, ...style }
    const context = useMemo(
      () => ({
        ariaLabel,
        ariaLabelledBy,
        hoverable,
        isStyled,
        labels: text,
        loading,
        size,
        stickyHeader,
        tableRef: ref,
        variant,
      }),
      [
        ariaLabel,
        ariaLabelledBy,
        hoverable,
        isStyled,
        loading,
        ref,
        size,
        stickyHeader,
        text,
        variant,
      ],
    )

    return (
      <TableContext.Provider value={context}>
        <section
          aria-label={scrollable ? ariaLabel : undefined}
          aria-labelledby={scrollable ? ariaLabelledBy : undefined}
          className={joinClasses(isStyled && styles.container, className)}
          data-plume-table=""
          ref={setContainer}
          style={containerStyle}
          {...(scrollable && { tabIndex: 0 })}
        >
          {hasPart(children, TABLE_PARTS) ? (
            children
          ) : (
            <>
              <TableLoading />
              <TableElement {...rest}>{children}</TableElement>
            </>
          )}
        </section>
      </TableContext.Provider>
    )
  },
)

Table.displayName = 'Table'
