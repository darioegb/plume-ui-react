'use client'

import type { ReactNode } from 'react'
import { Fragment } from 'react'
import { usePaginatorContext } from './paginator-context'
import { PaginatorEllipsis } from './paginator-ellipsis'
import { PaginatorItem } from './paginator-item'
import { PaginatorPage } from './paginator-page'
import type { PaginatorEntry } from './paginator-range'

export interface PaginatorPagesProps {
  children?: (entry: PaginatorEntry, position: number) => ReactNode
}

export function PaginatorPages({ children }: Readonly<PaginatorPagesProps>): ReactNode {
  const { entries } = usePaginatorContext('PaginatorPages')

  return entries.map((entry, position) => (
    <Fragment key={entry}>
      {children ? (
        children(entry, position)
      ) : (
        <PaginatorItem>
          {typeof entry === 'number' ? <PaginatorPage page={entry} /> : <PaginatorEllipsis />}
        </PaginatorItem>
      )}
    </Fragment>
  ))
}
