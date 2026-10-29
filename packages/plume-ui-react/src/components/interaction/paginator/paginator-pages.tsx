'use client'

import type { ReactNode } from 'react'
import { Fragment } from 'react'
import { usePaginatorContext } from './paginator-context'
import { PaginatorEllipsis } from './paginator-ellipsis'
import { PaginatorItem } from './paginator-item'
import { PaginatorPage } from './paginator-page'
import type { PaginatorEntry } from './paginator-range'

export interface PaginatorPagesProps {
  /**
   * A function that gets each entry (a page or an ellipsis) and its position and returns what to
   * render, usually a `PaginatorItem`. Without it each entry is a page button or an ellipsis.
   */
  children?: (entry: PaginatorEntry, position: number) => ReactNode
}

/**
 * Renders the entries of the current range, with no element of its own. Children is a function that
 * gets the entry and its position, and returns what to render (usually a `PaginatorItem`). Without
 * it, each entry is a page button or an ellipsis.
 */
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

PaginatorPages.displayName = 'PaginatorPages'
