import { act, renderHook } from '@testing-library/react'
import { useControllableState } from '../use-controllable-state'

describe('useControllableState', () => {
  it('starts with the default value', () => {
    const { result } = renderHook(() => useControllableState({ defaultValue: 3 }))
    expect(result.current[0]).toBe(3)
  })

  it('keeps its own state when it is not controlled', () => {
    const { result } = renderHook(() => useControllableState({ defaultValue: 3 }))
    act(() => result.current[1](5))
    expect(result.current[0]).toBe(5)
  })

  it('calls onChange with the new value', () => {
    const onChange = vi.fn()
    const { result } = renderHook(() => useControllableState({ defaultValue: 3, onChange }))
    act(() => result.current[1](5))
    expect(onChange).toHaveBeenCalledWith(5)
  })

  it('does not call onChange when the value is the same', () => {
    const onChange = vi.fn()
    const { result } = renderHook(() => useControllableState({ defaultValue: 3, onChange }))
    act(() => result.current[1](3))
    expect(onChange).not.toHaveBeenCalled()
  })

  it('follows the value when it is controlled', () => {
    const onChange = vi.fn()
    const { result, rerender } = renderHook(
      ({ value }) => useControllableState({ defaultValue: 0, onChange, value }),
      { initialProps: { value: 1 } },
    )
    act(() => result.current[1](9))
    expect(onChange).toHaveBeenCalledWith(9)
    expect(result.current[0]).toBe(1)
    rerender({ value: 9 })
    expect(result.current[0]).toBe(9)
  })

  it('treats null as a controlled value', () => {
    const { result } = renderHook(() =>
      useControllableState<number | null>({ defaultValue: 4, value: null }),
    )
    expect(result.current[0]).toBeNull()
  })

  it('keeps the same setter between renders', () => {
    const { result, rerender } = renderHook(() => useControllableState({ defaultValue: 1 }))
    const first = result.current[1]
    rerender()
    expect(result.current[1]).toBe(first)
  })
})
