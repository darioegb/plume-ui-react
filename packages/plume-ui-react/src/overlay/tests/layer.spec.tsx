import { renderHook } from '@testing-library/react'
import { useLayer } from '../layer'

describe('useLayer', () => {
  it('is the topmost layer when it is the only active one', () => {
    const { result } = renderHook(() => useLayer(true))
    expect(result.current()).toBe(true)
  })

  it('is never topmost while inactive', () => {
    const { result } = renderHook(() => useLayer(false))
    expect(result.current()).toBe(false)
  })

  it('gives the topmost position to the layer that opened last', () => {
    const first = renderHook(() => useLayer(true))
    const second = renderHook(() => useLayer(true))
    expect(first.result.current()).toBe(false)
    expect(second.result.current()).toBe(true)

    second.unmount()
    expect(first.result.current()).toBe(true)
  })

  it('leaves the stack when it is deactivated and joins on top when it is activated again', () => {
    const first = renderHook(() => useLayer(true))
    const second = renderHook(({ active }) => useLayer(active), { initialProps: { active: true } })

    second.rerender({ active: false })
    expect(second.result.current()).toBe(false)
    expect(first.result.current()).toBe(true)

    second.rerender({ active: true })
    expect(second.result.current()).toBe(true)
    expect(first.result.current()).toBe(false)
  })
})
