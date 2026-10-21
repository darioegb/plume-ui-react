import { extractTyped, insertAt, removeAt, sanitize } from '../pin-utils'

describe('sanitize', () => {
  it('keeps only digits when numeric', () => {
    expect(sanitize('1a2 3-', 'numeric')).toBe('123')
  })

  it('keeps letters and digits when alphanumeric', () => {
    expect(sanitize('a-1 b_2', 'alphanumeric')).toBe('a1b2')
  })

  it('only drops whitespace for text', () => {
    expect(sanitize('a -1', 'text')).toBe('a-1')
  })
})

describe('extractTyped', () => {
  it('takes the whole text when the cell was empty', () => {
    expect(extractTyped('', '123456')).toBe('123456')
  })

  it('takes the character typed after the current one', () => {
    expect(extractTyped('1', '12')).toBe('2')
  })

  it('takes the character typed before the current one', () => {
    expect(extractTyped('1', '21')).toBe('2')
  })

  it('takes the whole text when more than one character arrives', () => {
    expect(extractTyped('1', '123456')).toBe('123456')
  })
})

describe('insertAt', () => {
  it('appends at the end of the value', () => {
    expect(insertAt('12', 2, '3', 6)).toBe('123')
  })

  it('replaces the character of the cell when one is typed', () => {
    expect(insertAt('1234', 1, '9', 6)).toBe('1934')
  })

  it('appends after the last character when the cell is beyond it', () => {
    expect(insertAt('12', 5, '3', 6)).toBe('123')
  })

  it('replaces everything after the cell when several characters come', () => {
    expect(insertAt('1234', 1, '987', 6)).toBe('1987')
  })

  it('cuts the value to the length', () => {
    expect(insertAt('', 0, '1234567', 4)).toBe('1234')
  })
})

describe('removeAt', () => {
  it('removes a character and closes the gap', () => {
    expect(removeAt('1234', 1)).toBe('134')
  })

  it('leaves the value alone for an index outside of it', () => {
    expect(removeAt('12', -1)).toBe('12')
    expect(removeAt('12', 2)).toBe('12')
  })
})
