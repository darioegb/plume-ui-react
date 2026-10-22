import { clamp, fractionOf, snap, toValues } from '../slider-math'

describe('slider math', () => {
  it('clamps a value between the limits', () => {
    expect(clamp(5, 0, 10)).toBe(5)
    expect(clamp(-5, 0, 10)).toBe(0)
    expect(clamp(15, 0, 10)).toBe(10)
  })

  it('snaps a value to the nearest step from the minimum', () => {
    expect(snap(23, 0, 100, 5)).toBe(25)
    expect(snap(22, 0, 100, 5)).toBe(20)
    expect(snap(13, 3, 100, 5)).toBe(13)
    expect(snap(14, 3, 100, 5)).toBe(13)
  })

  it('keeps a snapped value inside the limits', () => {
    expect(snap(99, 0, 98, 5)).toBe(95)
    expect(snap(-4, 0, 100, 5)).toBe(0)
  })

  it('avoids floating point noise with decimal steps', () => {
    expect(snap(0.30000000000000004, 0, 1, 0.1)).toBe(0.3)
    expect(snap(0.7, 0, 1, 0.1)).toBe(0.7)
  })

  it('only clamps when the step is not positive', () => {
    expect(snap(3.7, 0, 10, 0)).toBe(3.7)
    expect(snap(30, 0, 10, -1)).toBe(10)
  })

  it('measures the fraction of the range', () => {
    expect(fractionOf(50, 0, 100)).toBe(0.5)
    expect(fractionOf(0, 0, 100)).toBe(0)
    expect(fractionOf(250, 0, 100)).toBe(1)
    expect(fractionOf(5, 5, 5)).toBe(0)
  })

  it('turns a value into a list', () => {
    expect(toValues(3)).toEqual([3])
    expect(toValues([1, 2])).toEqual([1, 2])
  })
})
