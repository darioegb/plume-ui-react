import { getContrastColor, getContrastRatio, getDarkenColor, getLightenColor } from '../colors'

describe('getContrastColor', () => {
  it('returns black on light colors and white on dark ones', () => {
    expect(getContrastColor('#ffffff')).toBe('#000000')
    expect(getContrastColor('#18181b')).toBe('#ffffff')
  })

  it('accepts hex colors without the hash and rgb() strings', () => {
    expect(getContrastColor('rgb(250, 250, 250)')).toBe('#000000')
    expect(getContrastColor('rgb(10, 10, 10)')).toBe('#ffffff')
  })

  it('falls back to black when the color cannot be parsed', () => {
    expect(getContrastColor('transparent')).toBe('#000000')
  })
})

describe('getContrastRatio', () => {
  it('returns the WCAG ratio regardless of the argument order', () => {
    expect(getContrastRatio('#000000', '#ffffff')).toBeCloseTo(21)
    expect(getContrastRatio('#ffffff', '#000000')).toBeCloseTo(21)
  })

  it('returns 1 for identical colors', () => {
    expect(getContrastRatio('#5263ff', '#5263ff')).toBe(1)
  })

  it('treats unparseable colors as black', () => {
    expect(getContrastRatio('currentColor', '#000000')).toBe(1)
  })
})

describe('getLightenColor', () => {
  it('moves every channel towards white', () => {
    expect(getLightenColor('#000000', 50)).toBe('rgb(127.5, 127.5, 127.5)')
  })

  it('lightens by 10% by default', () => {
    expect(getLightenColor('rgb(0, 0, 0)')).toBe('rgb(25.5, 25.5, 25.5)')
  })

  it('returns the input when it cannot be parsed', () => {
    expect(getLightenColor('inherit')).toBe('inherit')
  })
})

describe('getDarkenColor', () => {
  it('moves every channel towards black', () => {
    expect(getDarkenColor('#ffffff', 50)).toBe('rgb(127.5, 127.5, 127.5)')
  })

  it('darkens by 10% by default', () => {
    expect(getDarkenColor('rgb(200, 100, 0)')).toBe('rgb(180, 90, 0)')
  })

  it('returns the input when it cannot be parsed', () => {
    expect(getDarkenColor('inherit')).toBe('inherit')
  })
})
