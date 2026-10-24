'use client'

import type { ButtonHTMLAttributes, ForwardedRef, ReactNode } from 'react'
import { forwardRef } from 'react'
import { joinClasses } from '../../../overlay/class-names'
import type { ComponentProps } from '../../../theme'
import { Button } from '../button'
import { usePaginatorContext } from './paginator-context'
import styles from './paginator.module.css'

export interface PaginatorPageOwnProps {
  page: number
}

type PaginatorPageRootAttributes = Pick<
  ButtonHTMLAttributes<HTMLButtonElement>,
  'aria-label' | 'children' | 'disabled' | 'id' | 'onClick' | 'title'
>

export type PaginatorPageProps = Omit<ComponentProps, 'index'> &
  PaginatorPageRootAttributes &
  PaginatorPageOwnProps

export const PaginatorPage = forwardRef<HTMLButtonElement, PaginatorPageProps>(
  (
    {
      'aria-label': ariaLabel,
      children,
      className,
      disabled,
      onClick,
      page,
      style,
      ...rest
    }: PaginatorPageProps,
    ref: ForwardedRef<HTMLButtonElement>,
  ): ReactNode => {
    const paginator = usePaginatorContext('PaginatorPage')
    const isCurrent = page === paginator.current

    return (
      <Button
        aria-current={isCurrent ? 'page' : undefined}
        aria-label={ariaLabel ?? paginator.labels.page(page, isCurrent)}
        className={joinClasses(paginator.isStyled && styles.page, className)}
        colorScheme={isCurrent ? paginator.colorScheme : 'secondary'}
        data-current={isCurrent ? '' : undefined}
        data-plume-paginator-page=""
        disabled={paginator.disabled || disabled}
        onClick={(event) => {
          onClick?.(event)
          if (!event.defaultPrevented) paginator.go(page)
        }}
        ref={ref}
        shape={paginator.shape}
        size={paginator.size}
        style={style}
        variant={isCurrent ? paginator.variants.current : paginator.variants.other}
        {...rest}
      >
        {children ?? page}
      </Button>
    )
  },
)

PaginatorPage.displayName = 'PaginatorPage'
