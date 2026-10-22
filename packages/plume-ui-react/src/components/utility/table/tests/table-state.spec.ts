import {
  compareValues,
  filterRows,
  isEmptyFilter,
  matchesFilter,
  nextSort,
  sortRows,
} from '../table-state'

interface Person {
  age: number | null
  name: string
  role: string
}

const people: Person[] = [
  { age: 36, name: 'Ada', role: 'admin' },
  { age: 45, name: 'Grace', role: 'editor' },
  { age: null, name: 'Linus', role: 'admin' },
  { age: 28, name: 'Alan', role: 'viewer' },
]

const getValue = (row: Person, column: string): unknown =>
  (row as unknown as Record<string, unknown>)[column]

describe('isEmptyFilter', () => {
  it.each([undefined, null, '', []])('treats %j as empty', (value) => {
    expect(isEmptyFilter(value)).toBe(true)
  })

  it.each([0, false, 'a', ['a']])('treats %j as a value', (value) => {
    expect(isEmptyFilter(value)).toBe(false)
  })
})

describe('compareValues', () => {
  it('compares numbers, dates and strings', () => {
    expect(compareValues(1, 3)).toBeLessThan(0)
    expect(compareValues(new Date(2024, 0, 2), new Date(2024, 0, 1))).toBeGreaterThan(0)
    expect(compareValues('b', 'a')).toBeGreaterThan(0)
  })

  it('orders digits inside text as numbers and ignores case', () => {
    expect(compareValues('item 2', 'item 10')).toBeLessThan(0)
    expect(compareValues('a', 'A')).toBe(0)
  })
})

describe('matchesFilter', () => {
  it('matches a text anywhere in the cell, ignoring case and outer spaces', () => {
    expect(matchesFilter('Grace Hopper', ' hop ')).toBe(true)
    expect(matchesFilter('Grace', 'xyz')).toBe(false)
    expect(matchesFilter(null, 'a')).toBe(false)
  })

  it('matches a list by membership and the rest by equality', () => {
    expect(matchesFilter('admin', ['admin', 'editor'])).toBe(true)
    expect(matchesFilter('viewer', ['admin'])).toBe(false)
    expect(matchesFilter(36, 36)).toBe(true)
    expect(matchesFilter(36, 40)).toBe(false)
  })
})

describe('filterRows', () => {
  it('returns every row when no filter has a value', () => {
    expect(filterRows(people, { name: '', role: [] }, getValue, {})).toEqual(people)
  })

  it('combines the filters with and', () => {
    const result = filterRows(people, { name: 'a', role: ['admin'] }, getValue, {})
    expect(result.map(({ name }) => name)).toEqual(['Ada'])
  })

  it('uses the filter function of a column', () => {
    const result = filterRows(people, { minAge: 40 }, getValue, {
      minAge: (row, value) => (row.age ?? 0) >= (value as number),
    })
    expect(result.map(({ name }) => name)).toEqual(['Grace'])
  })
})

describe('sortRows', () => {
  it('keeps the order when there is no sort and does not change the input', () => {
    expect(sortRows(people, null, getValue, {})).toEqual(people)
  })

  it('sorts ascending and descending', () => {
    const ascending = sortRows(people, { column: 'name', direction: 'ascending' }, getValue, {})
    const descending = sortRows(people, { column: 'name', direction: 'descending' }, getValue, {})
    expect(ascending.map(({ name }) => name)).toEqual(['Ada', 'Alan', 'Grace', 'Linus'])
    expect(descending.map(({ name }) => name)).toEqual(['Linus', 'Grace', 'Alan', 'Ada'])
    expect(people[0].name).toBe('Ada')
  })

  it('puts the empty values last in both directions', () => {
    const ascending = sortRows(people, { column: 'age', direction: 'ascending' }, getValue, {})
    const descending = sortRows(people, { column: 'age', direction: 'descending' }, getValue, {})
    expect(ascending.map(({ name }) => name)).toEqual(['Alan', 'Ada', 'Grace', 'Linus'])
    expect(descending.map(({ name }) => name)).toEqual(['Grace', 'Ada', 'Alan', 'Linus'])
  })

  it('uses the sort function of a column', () => {
    const byLength = (first: Person, second: Person): number =>
      first.name.length - second.name.length
    const result = sortRows(people, { column: 'name', direction: 'descending' }, getValue, {
      name: byLength,
    })
    expect(result[result.length - 1].name).toBe('Ada')
  })
})

describe('nextSort', () => {
  it('goes ascending, descending and off, and starts again on another column', () => {
    const first = nextSort(null, 'name')
    expect(first).toEqual({ column: 'name', direction: 'ascending' })
    const second = nextSort(first, 'name')
    expect(second).toEqual({ column: 'name', direction: 'descending' })
    expect(nextSort(second, 'name')).toBeNull()
    expect(nextSort(second, 'age')).toEqual({ column: 'age', direction: 'ascending' })
  })
})
