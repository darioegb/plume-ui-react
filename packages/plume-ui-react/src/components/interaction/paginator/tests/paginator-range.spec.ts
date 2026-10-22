import { getPaginatorItems } from '../paginator-range'

const items = (page: number, count: number, siblingCount = 1, boundaryCount = 1) =>
  getPaginatorItems({ boundaryCount, count, page, siblingCount })

describe('getPaginatorItems', () => {
  it('lists every page when they all fit', () => {
    expect(items(1, 5)).toEqual([1, 2, 3, 4, 5])
    expect(items(3, 7)).toEqual([1, 2, 3, 4, 5, 6, 7])
  })

  it('lists a single page', () => {
    expect(items(1, 1)).toEqual([1])
  })

  it('folds the end behind an ellipsis near the start', () => {
    expect(items(1, 10)).toEqual([1, 2, 3, 4, 5, 'end-ellipsis', 10])
    expect(items(4, 10)).toEqual([1, 2, 3, 4, 5, 'end-ellipsis', 10])
  })

  it('folds both sides in the middle', () => {
    expect(items(5, 10)).toEqual([1, 'start-ellipsis', 4, 5, 6, 'end-ellipsis', 10])
  })

  it('folds the start behind an ellipsis near the end', () => {
    expect(items(10, 10)).toEqual([1, 'start-ellipsis', 6, 7, 8, 9, 10])
    expect(items(7, 10)).toEqual([1, 'start-ellipsis', 6, 7, 8, 9, 10])
  })

  it('shows a page instead of an ellipsis that would hide only one', () => {
    expect(items(4, 8)).toEqual([1, 2, 3, 4, 5, 'end-ellipsis', 8])
    expect(items(5, 8)).toEqual([1, 'start-ellipsis', 4, 5, 6, 7, 8])
  })

  it('keeps the same number of items on every page', () => {
    const lengths = Array.from({ length: 20 }, (_, index) => items(index + 1, 20).length)
    expect(new Set(lengths).size).toBe(1)
  })

  it('shows more siblings with siblingCount', () => {
    expect(items(10, 20, 2)).toEqual([1, 'start-ellipsis', 8, 9, 10, 11, 12, 'end-ellipsis', 20])
  })

  it('shows more pages at the edges with boundaryCount', () => {
    expect(items(10, 20, 1, 2)).toEqual([1, 2, 'start-ellipsis', 9, 10, 11, 'end-ellipsis', 19, 20])
  })

  it('has no siblings or boundaries to show with zeros', () => {
    expect(items(5, 10, 0, 0)).toEqual(['start-ellipsis', 5, 'end-ellipsis'])
  })
})
