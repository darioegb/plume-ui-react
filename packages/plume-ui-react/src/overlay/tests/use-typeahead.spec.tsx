import { act, renderHook } from '@testing-library/react'
import { isTypeaheadKey, matchTypeahead, useTypeahead } from '../use-typeahead'

const labels = ['Apple', 'Apricot', 'Banana', 'Blueberry', 'Cherry']

describe('matchTypeahead', () => {
  it('finds the first label that starts with the text', () => {
    expect(matchTypeahead(labels, 'ban', -1)).toBe(2)
  })

  it('is case insensitive and ignores surrounding spaces', () => {
    expect(matchTypeahead([' Cherry'], 'CH', -1)).toBe(0)
  })

  it('moves to the next match for a single character', () => {
    expect(matchTypeahead(labels, 'a', 0)).toBe(1)
    expect(matchTypeahead(labels, 'a', 1)).toBe(0)
  })

  it('cycles through the matches of a repeated character', () => {
    expect(matchTypeahead(labels, 'bb', 2)).toBe(3)
  })

  it('keeps the current item while the text still matches it', () => {
    expect(matchTypeahead(labels, 'ap', 0)).toBe(0)
  })

  it('skips the disabled items', () => {
    expect(matchTypeahead(labels, 'a', -1, (index) => index === 0)).toBe(1)
  })

  it('returns -1 when nothing matches', () => {
    expect(matchTypeahead(labels, 'x', -1)).toBe(-1)
    expect(matchTypeahead([], 'a', -1)).toBe(-1)
  })
})

describe('useTypeahead', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('accumulates the keys until the timeout', () => {
    const { result } = renderHook(() => useTypeahead(300))
    expect(result.current('b')).toBe('b')
    expect(result.current('a')).toBe('ba')
    act(() => {
      vi.advanceTimersByTime(300)
    })
    expect(result.current('c')).toBe('c')
  })

  it('does not fire after it unmounts', () => {
    const { result, unmount } = renderHook(() => useTypeahead())
    result.current('a')
    unmount()
    expect(() => vi.advanceTimersByTime(1000)).not.toThrow()
  })
})

describe('isTypeaheadKey', () => {
  const key = (value: string, modifiers = {}): Parameters<typeof isTypeaheadKey>[0] => ({
    altKey: false,
    ctrlKey: false,
    key: value,
    metaKey: false,
    ...modifiers,
  })

  it('accepts a printable character', () => {
    expect(isTypeaheadKey(key('a'))).toBe(true)
  })

  it('rejects space, named keys and shortcuts', () => {
    expect(isTypeaheadKey(key(' '))).toBe(false)
    expect(isTypeaheadKey(key('Enter'))).toBe(false)
    expect(isTypeaheadKey(key('a', { ctrlKey: true }))).toBe(false)
    expect(isTypeaheadKey(key('a', { metaKey: true }))).toBe(false)
    expect(isTypeaheadKey(key('a', { altKey: true }))).toBe(false)
  })
})
