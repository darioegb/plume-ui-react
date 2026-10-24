'use client'

import type { ButtonHTMLAttributes, ForwardedRef, ReactNode } from 'react'
import { forwardRef } from 'react'
import { joinClasses } from '../../../overlay/class-names'
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  ChevronsLeftIcon,
  ChevronsRightIcon,
} from '../../../overlay/icons'
import type { ComponentProps } from '../../../theme'
import { Button } from '../button'
import { type PaginatorContextValue, usePaginatorContext } from './paginator-context'
import styles from './paginator.module.css'

type PaginatorEdgeRootAttributes = Pick<
  ButtonHTMLAttributes<HTMLButtonElement>,
  'aria-label' | 'children' | 'disabled' | 'id' | 'onClick' | 'title'
>

export type PaginatorEdgeProps = Omit<ComponentProps, 'index'> & PaginatorEdgeRootAttributes

type Edge = 'first' | 'last' | 'next' | 'previous'

interface PaginatorEdgeInternalProps extends PaginatorEdgeProps {
  edge: Edge
  part: string
}

const edges: Record<
  Edge,
  {
    icon: ReactNode
    target: (paginator: PaginatorContextValue) => number
    unavailable: (paginator: PaginatorContextValue) => boolean
  }
> = {
  first: {
    icon: <ChevronsLeftIcon />,
    target: () => 1,
    unavailable: ({ current }) => current === 1,
  },
  last: {
    icon: <ChevronsRightIcon />,
    target: ({ pages }) => pages,
    unavailable: ({ current, pages }) => current === pages,
  },
  next: {
    icon: <ChevronRightIcon />,
    target: ({ current }) => current + 1,
    unavailable: ({ current, pages }) => current === pages,
  },
  previous: {
    icon: <ChevronLeftIcon />,
    target: ({ current }) => current - 1,
    unavailable: ({ current }) => current === 1,
  },
}

export const PaginatorEdge = forwardRef<HTMLButtonElement, PaginatorEdgeInternalProps>(
  (
    {
      'aria-label': ariaLabel,
      children,
      className,
      disabled,
      edge,
      onClick,
      part,
      style,
      ...rest
    }: PaginatorEdgeInternalProps,
    ref: ForwardedRef<HTMLButtonElement>,
  ): ReactNode => {
    const paginator = usePaginatorContext(part)
    const { icon, target, unavailable } = edges[edge]

    return (
      <Button
        aria-label={ariaLabel ?? paginator.labels[edge]}
        className={joinClasses(paginator.isStyled && styles.edge, className)}
        colorScheme="secondary"
        disabled={paginator.disabled || disabled || unavailable(paginator)}
        onClick={(event) => {
          onClick?.(event)
          if (!event.defaultPrevented) paginator.go(target(paginator))
        }}
        ref={ref}
        shape={paginator.shape}
        size={paginator.size}
        style={style}
        variant={paginator.variants.other}
        {...rest}
      >
        {children ?? icon}
      </Button>
    )
  },
)

PaginatorEdge.displayName = 'PaginatorEdge'
