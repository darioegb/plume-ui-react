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
   * The number of pages. Without it, the pages are worked out from **total** and **pageSize**. With
   * no pages the Paginator renders nothing.
   */
  count?: number
  /**
   * The page that is current first, when the Paginator is not controlled.
   *
   * @default 1
   */
  defaultPage?: number
  /**
   * Disables every button.
   *
   * @default false
   */
  disabled?: boolean
  /**
   * The texts the Paginator adds, to translate them: `previous`, `next`, `first` and `last` name
   * the buttons of the edges, `page(page, current)` names a page button and `pagination` names the
   * navigation when there is no `aria-label` or `aria-labelledby`. Pass only the ones you want to
   * change.
   */
  labels?: Partial<PaginatorLabels>
  /** Called with the new page when the user picks another one. */
  onPageChange?: (page: number) => void
  /**
   * The current page, starting at 1. Makes the Paginator controlled: pass `onPageChange` to update
   * it. It is kept between 1 and the last page.
   */
  page?: number
  /**
   * The number of items in a page, to work the pages out of **total**.
   *
   * @default 10
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
  /** The number of items in all the pages. It is used when there is no **count**. */
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
