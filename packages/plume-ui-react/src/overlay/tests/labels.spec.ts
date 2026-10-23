import { describe, expect, it } from 'vitest'
import { mergeLabels } from '../labels'

describe('mergeLabels', () => {
  const defaults = { close: 'Close', page: (n: number) => `Page ${n}` }

  it('returns the defaults when there are no labels', () => {
    expect(mergeLabels(defaults)).toEqual(defaults)
    expect(mergeLabels(defaults)).not.toBe(defaults)
  })

  it('overrides only the keys that are given', () => {
    const merged = mergeLabels(defaults, { close: 'Cerrar' })
    expect(merged.close).toBe('Cerrar')
    expect(merged.page(2)).toBe('Page 2')
  })

  it('keeps the default of a key that is undefined', () => {
    expect(mergeLabels(defaults, { close: undefined }).close).toBe('Close')
  })
})
