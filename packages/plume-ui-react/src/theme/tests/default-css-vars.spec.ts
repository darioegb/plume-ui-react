import { getCssVarOverrides, getDefaultCssVars } from '../default-css-vars'

describe('default css vars', () => {
  it('gives dark values of its own to the semantic colors', () => {
    expect(getDefaultCssVars('dark')['--plume-background']).not.toBe(
      getDefaultCssVars('light')['--plume-background'],
    )
  })

  it('keeps the values that differ and the ones that point to another variable', () => {
    const defaults = { '--a': '1', '--b': '2', '--c': 'var(--a)' }
    expect(getCssVarOverrides({ '--a': '1', '--b': '3', '--c': 'var(--a)' }, defaults)).toEqual({
      '--b': '3',
      '--c': 'var(--a)',
    })
  })

  it('emits nothing for the default theme but the variables that point to another one', () => {
    const light = getDefaultCssVars('light')
    const overrides = getCssVarOverrides(light, light)
    expect(Object.values(overrides).every((value) => value.includes('var('))).toBe(true)
    expect(Object.keys(overrides).length).toBeGreaterThan(0)
  })
})
