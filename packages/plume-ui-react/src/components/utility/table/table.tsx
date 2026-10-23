'use client'

import type { CSSProperties, ForwardedRef, HTMLAttributes } from 'react'
import { forwardRef, useEffect, useState } from 'react'
import { joinClasses } from '../../../overlay/class-names'
import type { ComponentProps, Size } from '../../../theme'
import { Spinner } from '../../presentation/spinner'
import styles from './table.module.css'

export type TablePart = 'container' | 'loading'

export type TableVariant = 'plain' | 'bordered' | 'striped' | 'unstyled'

export interface TableOwnProps {
  classNames?: Partial<Record<TablePart, string>>
  /** @deprecated Use `classNames.container`. */
  containerClassName?: string
  hoverable?: boolean
  loading?: boolean
  /** @deprecated Use `classNames.loading`. */
  loadingClassName?: string
  loadingLabel?: string
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
      classNames,
      containerClassName,
      hoverable = false,
      loading = false,
      loadingClassName,
      loadingLabel = 'Loading',
      maxHeight,
      size = 'md',
      stickyHeader = false,
      style,
      variant = 'plain',
      ...rest
    }: TableProps,
    ref: ForwardedRef<HTMLTableElement>,
  ) => {
    const isStyled = variant !== 'unstyled'
    const [container, setContainer] = useState<HTMLElement | null>(null)
    const scrollable = useOverflow(container)
    const containerStyle: CSSProperties | undefined =
      maxHeight === undefined ? undefined : { maxHeight }

    return (
      <section
        aria-label={scrollable ? ariaLabel : undefined}
        aria-labelledby={scrollable ? ariaLabelledBy : undefined}
        className={joinClasses(
          isStyled && styles.container,
          containerClassName,
          classNames?.container,
        )}
        data-plume-table-container=""
        ref={setContainer}
        style={containerStyle}
        {...(scrollable && { tabIndex: 0 })}
      >
        {loading ? (
          <div data-plume-table-loading="">
            <Spinner
              aria-label={loadingLabel}
              className={joinClasses(loadingClassName, classNames?.loading)}
              color="primary"
              variant={isStyled ? 'solid' : 'unstyled'}
            />
          </div>
        ) : null}
        <table
          aria-busy={loading ? true : undefined}
          aria-label={ariaLabel}
          aria-labelledby={ariaLabelledBy}
          className={joinClasses(
            isStyled && styles.table,
            isStyled && styles[variant],
            isStyled && styles[size],
            className,
          )}
          data-hoverable={hoverable ? '' : undefined}
          data-loading={loading ? '' : undefined}
          data-plume-table=""
          data-sticky={stickyHeader ? '' : undefined}
          ref={ref}
          style={style}
          {...rest}
        >
          {children}
        </table>
      </section>
    )
  },
)

Table.displayName = 'Table'
