'use client'

import type { ForwardedRef, HTMLAttributes, ReactNode } from 'react'
import { forwardRef, useCallback, useMemo } from 'react'
import { joinClasses } from '../../../overlay/class-names'
import { useLabels } from '../../../locale/locale-provider'
import { useControllableState } from '../../../overlay/use-controllable-state'
import type { ColorScheme, ComponentProps, Shape, Size } from '../../../theme'
import { PaginatorContext, type PaginatorLabels, type PaginatorVariant } from './paginator-context'
import { PaginatorList } from './paginator-list'
import styles from './paginator.module.css'
import { getPaginatorItems } from './paginator-range'

export interface PaginatorOwnProps {
  boundaryCount?: number
  colorScheme?: ColorScheme
  count?: number
  defaultPage?: number
  disabled?: boolean
  labels?: Partial<PaginatorLabels>
  onPageChange?: (page: number) => void
  page?: number
  pageSize?: number
  shape?: Shape
  showEdges?: boolean
  siblingCount?: number
  size?: Size
  total?: number
  variant?: PaginatorVariant
}

type PaginatorRootAttributes = Pick<
  HTMLAttributes<HTMLElement>,
  'aria-label' | 'aria-labelledby' | 'children' | 'hidden' | 'id' | 'title'
>

export type PaginatorProps = Omit<ComponentProps, 'index'> &
  PaginatorRootAttributes &
  PaginatorOwnProps

const DEFAULT_LABELS: PaginatorLabels = {
  first: 'First page',
  last: 'Last page',
  next: 'Next page',
  page: (page, current) => (current ? `Page ${page}, current page` : `Page ${page}`),
  pagination: 'Pagination',
  previous: 'Previous page',
}

const clamp = (value: number, min: number, max: number): number =>
  Math.min(Math.max(value, min), max)

const buttonVariants: Record<
  PaginatorVariant,
  { current: PaginatorVariant; other: PaginatorVariant }
> = {
  ghost: { current: 'ghost', other: 'ghost' },
  outline: { current: 'outline', other: 'outline' },
  solid: { current: 'solid', other: 'ghost' },
  unstyled: { current: 'unstyled', other: 'unstyled' },
}

export const Paginator = forwardRef<HTMLElement, PaginatorProps>(
  (
    {
      'aria-label': ariaLabel,
      'aria-labelledby': labelledBy,
      boundaryCount = 1,
      children,
      className,
      colorScheme = 'primary',
      count,
      defaultPage = 1,
      disabled = false,
      labels,
      onPageChange,
      page: pageProp,
      pageSize = 10,
      shape = 'rounded',
      showEdges = false,
      siblingCount = 1,
      size = 'md',
      total,
      variant = 'solid',
      ...rest
    }: PaginatorProps,
    ref: ForwardedRef<HTMLElement>,
  ): ReactNode => {
    const [page, setPage] = useControllableState({
      defaultValue: defaultPage,
      onChange: onPageChange,
      value: pageProp,
    })
    const pages = count ?? Math.ceil((total ?? 0) / Math.max(pageSize, 1))
    const isStyled = variant !== 'unstyled'
    const current = clamp(page, 1, Math.max(pages, 1))
    const text = useLabels('paginator', DEFAULT_LABELS, labels)
    const entries = useMemo(
      () =>
        pages < 1
          ? []
          : getPaginatorItems({ boundaryCount, count: pages, page: current, siblingCount }),
      [boundaryCount, current, pages, siblingCount],
    )
    const go = useCallback(
      (target: number): void => {
        if (target !== current) setPage(target)
      },
      [current, setPage],
    )
    const context = useMemo(
      () => ({
        colorScheme,
        current,
        disabled,
        entries,
        go,
        isStyled,
        labels: text,
        pages,
        shape,
        showEdges,
        size,
        variants: buttonVariants[variant],
      }),
      [
        colorScheme,
        current,
        disabled,
        entries,
        go,
        isStyled,
        pages,
        shape,
        showEdges,
        size,
        text,
        variant,
      ],
    )

    if (pages < 1) return null

    return (
      <PaginatorContext.Provider value={context}>
        <nav
          aria-label={ariaLabel ?? (labelledBy ? undefined : text.pagination)}
          aria-labelledby={labelledBy}
          className={joinClasses(
            isStyled && styles.paginator,
            isStyled && styles[variant],
            isStyled && styles[size],
            className,
          )}
          data-plume-paginator=""
          ref={ref}
          {...rest}
        >
          {children ?? <PaginatorList />}
        </nav>
      </PaginatorContext.Provider>
    )
  },
)

Paginator.displayName = 'Paginator'
