'use client'

import type { ForwardedRef, HTMLAttributes, ReactNode } from 'react'
import { forwardRef } from 'react'
import { joinClasses } from '../../../overlay/class-names'
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  ChevronsLeftIcon,
  ChevronsRightIcon,
} from '../../../overlay/icons'
import { useControllableState } from '../../../overlay/use-controllable-state'
import type { ColorScheme, ComponentProps, Shape, Size } from '../../../theme'
import { Button } from '../button'
import styles from './paginator.module.css'
import { getPaginatorItems } from './paginator-range'

export type PaginatorVariant = 'ghost' | 'outline' | 'solid' | 'unstyled'

export type PaginatorPart =
  'ellipsis' | 'first' | 'item' | 'last' | 'list' | 'next' | 'page' | 'previous'

export interface PaginatorOwnProps {
  boundaryCount?: number
  classNames?: Partial<Record<PaginatorPart, string>>
  colorScheme?: ColorScheme
  count?: number
  defaultPage?: number
  disabled?: boolean
  firstLabel?: string
  getPageLabel?: (page: number, current: boolean) => string
  lastLabel?: string
  nextLabel?: string
  onPageChange?: (page: number) => void
  page?: number
  pageSize?: number
  previousLabel?: string
  shape?: Shape
  showEdges?: boolean
  siblingCount?: number
  size?: Size
  total?: number
  variant?: PaginatorVariant
}

type PaginatorRootAttributes = Pick<
  HTMLAttributes<HTMLElement>,
  'aria-label' | 'aria-labelledby' | 'hidden' | 'id' | 'title'
>

export type PaginatorProps = Omit<ComponentProps, 'children' | 'index'> &
  PaginatorRootAttributes &
  PaginatorOwnProps

const defaultPageLabel = (page: number, current: boolean): string =>
  current ? `Page ${page}, current page` : `Page ${page}`

const clamp = (value: number, min: number, max: number): number =>
  Math.min(Math.max(value, min), max)

type ButtonVariant = 'ghost' | 'outline' | 'solid' | 'unstyled'

const buttonVariants: Record<PaginatorVariant, { current: ButtonVariant; other: ButtonVariant }> = {
  ghost: { current: 'ghost', other: 'ghost' },
  outline: { current: 'outline', other: 'outline' },
  solid: { current: 'solid', other: 'ghost' },
  unstyled: { current: 'unstyled', other: 'unstyled' },
}

interface PaginatorItemProps {
  children: ReactNode
  className?: string
  isStyled: boolean
}

function PaginatorListItem({
  children,
  className,
  isStyled,
}: Readonly<PaginatorItemProps>): ReactNode {
  return (
    <li className={joinClasses(isStyled && styles.item, className)} data-plume-paginator-item="">
      {children}
    </li>
  )
}

export const Paginator = forwardRef<HTMLElement, PaginatorProps>(
  (
    {
      'aria-label': ariaLabel,
      'aria-labelledby': labelledBy,
      boundaryCount = 1,
      className,
      classNames,
      colorScheme = 'primary',
      count,
      defaultPage = 1,
      disabled = false,
      firstLabel = 'First page',
      getPageLabel = defaultPageLabel,
      lastLabel = 'Last page',
      nextLabel = 'Next page',
      onPageChange,
      page: pageProp,
      pageSize = 10,
      previousLabel = 'Previous page',
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
    const variants = buttonVariants[variant]

    if (pages < 1) return null

    const go = (target: number): void => {
      if (target !== current) setPage(target)
    }
    const edge = (
      part: 'first' | 'last' | 'next' | 'previous',
      label: string,
      target: number,
      unavailable: boolean,
      icon: ReactNode,
    ): ReactNode => (
      <PaginatorListItem className={classNames?.item} isStyled={isStyled}>
        <Button
          aria-label={label}
          className={joinClasses(isStyled && styles.edge, classNames?.[part])}
          colorScheme="secondary"
          data-plume-paginator-part={part}
          disabled={disabled || unavailable}
          onClick={() => go(target)}
          shape={shape}
          size={size}
          variant={variants.other}
        >
          {icon}
        </Button>
      </PaginatorListItem>
    )

    return (
      <nav
        aria-label={ariaLabel ?? (labelledBy ? undefined : 'Pagination')}
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
        <ul
          className={joinClasses(isStyled && styles.list, classNames?.list)}
          data-plume-paginator-list=""
        >
          {showEdges ? edge('first', firstLabel, 1, current === 1, <ChevronsLeftIcon />) : null}
          {edge('previous', previousLabel, current - 1, current === 1, <ChevronLeftIcon />)}
          {getPaginatorItems({ boundaryCount, count: pages, page: current, siblingCount }).map(
            (item) =>
              typeof item === 'number' ? (
                <PaginatorListItem className={classNames?.item} isStyled={isStyled} key={item}>
                  <Button
                    aria-current={item === current ? 'page' : undefined}
                    aria-label={getPageLabel(item, item === current)}
                    className={joinClasses(isStyled && styles.page, classNames?.page)}
                    colorScheme={item === current ? colorScheme : 'secondary'}
                    data-current={item === current ? '' : undefined}
                    data-plume-paginator-part="page"
                    disabled={disabled}
                    onClick={() => go(item)}
                    shape={shape}
                    size={size}
                    variant={item === current ? variants.current : variants.other}
                  >
                    {item}
                  </Button>
                </PaginatorListItem>
              ) : (
                <PaginatorListItem className={classNames?.item} isStyled={isStyled} key={item}>
                  <span
                    aria-hidden="true"
                    className={joinClasses(isStyled && styles.ellipsis, classNames?.ellipsis)}
                    data-plume-paginator-part="ellipsis"
                  >
                    …
                  </span>
                </PaginatorListItem>
              ),
          )}
          {edge('next', nextLabel, current + 1, current === pages, <ChevronRightIcon />)}
          {showEdges
            ? edge('last', lastLabel, pages, current === pages, <ChevronsRightIcon />)
            : null}
        </ul>
      </nav>
    )
  },
)

Paginator.displayName = 'Paginator'
