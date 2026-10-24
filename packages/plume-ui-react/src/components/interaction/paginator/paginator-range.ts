export type PaginatorEntry = number | 'end-ellipsis' | 'start-ellipsis'

const range = (start: number, end: number): number[] =>
  Array.from({ length: Math.max(end - start + 1, 0) }, (_, offset) => start + offset)

export interface PaginatorRangeOptions {
  boundaryCount: number
  count: number
  page: number
  siblingCount: number
}

export function getPaginatorItems({
  boundaryCount,
  count,
  page,
  siblingCount,
}: PaginatorRangeOptions): PaginatorEntry[] {
  const startPages = range(1, Math.min(boundaryCount, count))
  const endPages = range(Math.max(count - boundaryCount + 1, boundaryCount + 1), count)

  const siblingsStart = Math.max(
    Math.min(page - siblingCount, count - boundaryCount - siblingCount * 2 - 1),
    boundaryCount + 2,
  )
  const siblingsEnd = Math.min(
    Math.max(page + siblingCount, boundaryCount + siblingCount * 2 + 2),
    endPages.length > 0 ? (endPages[0] ?? count) - 2 : count - 1,
  )

  const beforeSiblings: PaginatorEntry[] = []
  if (siblingsStart > boundaryCount + 2) beforeSiblings.push('start-ellipsis')
  else if (boundaryCount + 1 < count - boundaryCount) beforeSiblings.push(boundaryCount + 1)

  const afterSiblings: PaginatorEntry[] = []
  if (siblingsEnd < count - boundaryCount - 1) afterSiblings.push('end-ellipsis')
  else if (count - boundaryCount > boundaryCount) afterSiblings.push(count - boundaryCount)

  return [
    ...startPages,
    ...beforeSiblings,
    ...range(siblingsStart, siblingsEnd),
    ...afterSiblings,
    ...endPages,
  ]
}
