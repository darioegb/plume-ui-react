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
  /**
   * How many pages are always shown at the start and at the end.
   *
   * @default 1
   */
  boundaryCount?: number
  /**
   * Color scheme from the theme palette, including custom schemes added to it. It colors the
   * current page; the other buttons are neutral.
   *
   * @default 'primary'
   */
  colorScheme?: ColorScheme
  /**
   * The page that is current first, when the Paginator is not controlled.
   *
   * @default 1
   */
  defaultPage?: number
  /**
   * The page size that is chosen first, when the Paginator is not controlled. A
   * `PaginatorPageSize` changes it.
   *
   * @default 10
   */
  defaultPageSize?: number
  /**
   * Disables every button.
   *
   * @default false
   */
  disabled?: boolean
  /**
   * The texts the Paginator adds, to translate them: `previous`, `next`, `first` and `last` name
   * the buttons of the edges, `page(page, current)` names a page button, `pagination` names the
   * navigation when there is no `aria-label` or `aria-labelledby`, `summary(from, to, total)` is
   * the text of a `PaginatorSummary` and `pageSize` names a `PaginatorPageSize`. Pass only the ones
   * you want to change.
   */
  labels?: Partial<PaginatorLabels>
  /** Called with the new page when the user picks another one. */
  onPageChange?: (page: number) => void
  /**
   * Called with the new page size when the user picks another one in a `PaginatorPageSize`. The
   * page changes too, to keep the first item of the old page in view.
   */
  onPageSizeChange?: (pageSize: number) => void
  /**
   * The current page, starting at 1. Makes the Paginator controlled: pass `onPageChange` to update
   * it. It is kept between 1 and the last page.
   */
  page?: number
  /**
   * The number of items in a page, to work the pages out of **total**. Makes the page size
   * controlled: pass `onPageSizeChange` to update it.
   */
  pageSize?: number
  /**
   * Corners of the buttons.
   *
   * @default 'rounded'
   */
  shape?: Shape
  /**
   * Adds the buttons that go to the first and to the last page.
   *
   * @default false
   */
  showEdges?: boolean
  /**
   * How many pages are shown on each side of the current one.
   *
   * @default 1
   */
  siblingCount?: number
  /**
   * Size of the buttons.
   *
   * @default 'md'
   */
  size?: Size
  /**
   * The number of items to page through. The pages are **total** divided by **pageSize**, and a
   * `PaginatorSummary` reads it. Without it the Paginator renders nothing.
   */
  total?: number
  /**
   * Visual variant. `solid` fills the current page and leaves the others flat, `outline` draws a
   * border on every button and tints the current one, and `ghost` has no border or fill: the
   * current page is only tinted. `unstyled` drops the Plume styles so you can bring your own; the
   * layout keeps working.
   *
   * @default 'solid'
   */
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
  pageSize: 'Items per page',
  pagination: 'Pagination',
  previous: 'Previous page',
  summary: (from, to, total) => `${from}–${to} of ${total}`,
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
      defaultPage = 1,
      defaultPageSize = 10,
      disabled = false,
      labels,
      onPageChange,
      onPageSizeChange,
      page: pageProp,
      pageSize: pageSizeProp,
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
    const [pageSize, setSize] = useControllableState({
      defaultValue: defaultPageSize,
      onChange: onPageSizeChange,
      value: pageSizeProp,
    })
    const pages = total === undefined ? 0 : Math.max(1, Math.ceil(total / Math.max(pageSize, 1)))
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
    const setPageSize = useCallback(
      (next: number): void => {
        if (next === pageSize) return
        setSize(next)
        setPage(Math.floor(((current - 1) * pageSize) / next) + 1)
      },
      [current, pageSize, setPage, setSize],
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
        pageSize,
        setPageSize,
        shape,
        showEdges,
        size,
        total: total ?? 0,
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
        pageSize,
        setPageSize,
        shape,
        showEdges,
        size,
        text,
        total,
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
