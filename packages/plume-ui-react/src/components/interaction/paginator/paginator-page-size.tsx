'use client'

import type { ForwardedRef, HTMLAttributes, ReactNode } from 'react'
import { forwardRef, useMemo } from 'react'
import { joinClasses } from '../../../overlay/class-names'
import type { ComponentProps } from '../../../theme'
import { Select, SelectContent, SelectOption, SelectTrigger } from '../../form/select'
import { usePaginatorContext } from './paginator-context'
import styles from './paginator.module.css'

type PaginatorPageSizeRootAttributes = Pick<
  HTMLAttributes<HTMLSpanElement>,
  'aria-label' | 'children' | 'id'
>

export interface PaginatorPageSizeOwnProps {
  /**
   * The page sizes to choose from. The current one is added when it is not in the list.
   *
   * @default [10, 20, 50]
   */
  options?: number[]
}

export type PaginatorPageSizeProps = Omit<ComponentProps, 'index'> &
  PaginatorPageSizeRootAttributes &
  PaginatorPageSizeOwnProps

const DEFAULT_OPTIONS = [10, 20, 50]

/**
 * A `Select` to choose how many items a page has. Its accessible name is `labels.pageSize`. Pair
 * it with `onPageSizeChange` in the `Paginator`; the page changes with it, to keep the first item
 * in view. Given `children`, the parts of the `Select` (`SelectTrigger`, `SelectContent` and
 * `SelectOption`, whose value is the page size as a string), they replace the default ones.
 */
export const PaginatorPageSize = forwardRef<HTMLSpanElement, PaginatorPageSizeProps>(
  (
    {
      'aria-label': ariaLabel,
      children,
      className,
      options = DEFAULT_OPTIONS,
      style,
      ...rest
    }: PaginatorPageSizeProps,
    ref: ForwardedRef<HTMLSpanElement>,
  ): ReactNode => {
    const { colorScheme, disabled, isStyled, labels, pageSize, setPageSize, shape, size } =
      usePaginatorContext('PaginatorPageSize')
    const sizes = useMemo(
      () => Array.from(new Set([...options, pageSize])).sort((a, b) => a - b),
      [options, pageSize],
    )

    return (
      <span
        className={joinClasses(isStyled && styles.pageSize, className)}
        data-disabled={disabled ? '' : undefined}
        data-plume-paginator-page-size=""
        ref={ref}
        style={style}
        {...rest}
      >
        <Select
          colorScheme={colorScheme}
          disabled={disabled}
          onValueChange={(value) => setPageSize(Number(value))}
          shape={shape}
          size={size}
          value={String(pageSize)}
          variant={isStyled ? 'outline' : 'unstyled'}
        >
          {children ?? (
            <>
              <SelectTrigger aria-label={ariaLabel ?? labels.pageSize} />
              <SelectContent>
                {sizes.map((option) => (
                  <SelectOption key={option} value={String(option)}>
                    {option}
                  </SelectOption>
                ))}
              </SelectContent>
            </>
          )}
        </Select>
      </span>
    )
  },
)

PaginatorPageSize.displayName = 'PaginatorPageSize'
