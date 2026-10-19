import { deepMerge } from '../merge'

describe('deepMerge', () => {
  it('merges nested objects without mutating the inputs', () => {
    const base = { colors: { primary: { 500: '#000', 600: '#111' } }, radius: 4 }
    const override = { colors: { primary: { 500: '#fff' } } }

    const result = deepMerge(base, override)

    expect(result).toEqual({ colors: { primary: { 500: '#fff', 600: '#111' } }, radius: 4 })
    expect(base.colors.primary[500]).toBe('#000')
    expect(result.colors).not.toBe(base.colors)
  })

  it('lets later sources win and skips undefined ones', () => {
    expect(deepMerge({ a: 1, b: 1 }, { a: 2 }, undefined, { b: 3 })).toEqual({ a: 2, b: 3 })
  })

  it('replaces arrays and primitives instead of merging them', () => {
    expect(deepMerge<{ list: number[] | string }>({ list: [1, 2] }, { list: [3] })).toEqual({
      list: [3],
    })
    expect(deepMerge<{ list: number[] | string }>({ list: [1, 2] }, { list: 'none' })).toEqual({
      list: 'none',
    })
  })

  it('adds keys that only exist in the source', () => {
    expect(deepMerge<Record<string, unknown>>({ a: 1 }, { b: { c: 2 } })).toEqual({
      a: 1,
      b: { c: 2 },
    })
  })

  it('returns non-object targets as they are when there are no sources', () => {
    expect(deepMerge('value')).toBe('value')
  })
})
