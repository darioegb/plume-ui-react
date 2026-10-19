import { deepMerge } from '../../utils/merge'
import { defaultDarkTheme, defaultTheme } from '../config'
import { themeToCssVars } from '../theme-to-css-vars'
import type { Theme } from '../theme.types'

type Ramp = Record<string, string>

const ramp = (color: string, overrides: Ramp = {}): Ramp => ({
  ...Object.fromEntries(
    ['50', '100', '200', '300', '400', '500', '600', '700', '800', '900', '950'].map((key) => [
      key,
      color,
    ]),
  ),
  ...overrides,
})

const withColors = (colors: Record<string, Ramp>, base: Theme = defaultTheme): Theme => ({
  ...base,
  colors: colors as unknown as Theme['colors'],
})

const darkTheme = deepMerge<Theme>(defaultTheme, defaultDarkTheme as Theme)

describe('themeToCssVars', () => {
  it('emits every shade of every color scheme', () => {
    const vars = themeToCssVars(defaultTheme)
    expect(vars['--plume-color-primary-500']).toBe(defaultTheme.colors.primary[500])
    expect(vars['--plume-color-secondary-950']).toBe(defaultTheme.colors.secondary[950])
  })

  it('emits the semantic colors in kebab case', () => {
    const vars = themeToCssVars(defaultTheme)
    expect(vars['--plume-background']).toBe(defaultTheme.semantic.background)
    expect(vars['--plume-surface-muted']).toBe(defaultTheme.semantic.surfaceMuted)
  })

  it('emits the typography, spacing and layout scales', () => {
    const vars = themeToCssVars(defaultTheme)
    expect(vars['--plume-font-family']).toBe(defaultTheme.typography.fontFamily)
    expect(vars['--plume-breakpoint-xl']).toBe(defaultTheme.breakpoints.xl)
    for (const scale of [
      'font-size',
      'font-weight',
      'line-height',
      'space',
      'size',
      'radius',
      'z',
      'shadow',
    ]) {
      expect(Object.keys(vars).some((key) => key.startsWith(`--plume-${scale}-`))).toBe(true)
    }
  })

  it('includes custom color schemes', () => {
    const vars = themeToCssVars(withColors({ salmon: ramp('#fa8072') }))
    expect(vars['--plume-color-salmon-500']).toBe('#fa8072')
  })

  it('pairs dark fills with white text', () => {
    const vars = themeToCssVars(withColors({ ink: ramp('#1e3a8a') }))
    expect(vars['--plume-color-ink-solid']).toBe('#1e3a8a')
    expect(vars['--plume-color-ink-solid-contrast']).toBe('#ffffff')
    expect(vars['--plume-color-ink-solid-hover']).toMatch(/^rgb\(/)
    expect(vars['--plume-color-ink-solid-active']).toMatch(/^rgb\(/)
  })

  it('keeps light fills on the base shade with black text', () => {
    const vars = themeToCssVars(withColors({ sun: ramp('#facc15') }))
    expect(vars['--plume-color-sun-solid']).toBe('#facc15')
    expect(vars['--plume-color-sun-solid-contrast']).toBe('#000000')
  })

  it('uses a darker shade for text when the base fails AA on light surfaces', () => {
    const vars = themeToCssVars(withColors({ sky: ramp('#7dd3fc', { 800: '#075985' }) }))
    expect(vars['--plume-color-sky-text']).toBe('#075985')
    expect(vars['--plume-color-sky-tint']).toBe('#7dd3fc')
  })

  it('falls back to the darkest shade when no shade reaches AA', () => {
    const vars = themeToCssVars(withColors({ gray: ramp('#a1a1aa', { 950: '#b4b4bb' }) }))
    expect(vars['--plume-color-gray-text']).toBe('#b4b4bb')
  })

  it('lightens the text and uses dark tints on dark themes', () => {
    const vars = themeToCssVars(
      withColors({ ink: ramp('#1e3a8a', { 200: '#bfdbfe', 800: '#1e40af', 900: '#1e3a5f' }) }, darkTheme),
    )
    expect(vars['--plume-color-ink-text']).toBe('#bfdbfe')
    expect(vars['--plume-color-ink-text-hover']).toMatch(/^rgb\(/)
    expect(vars['--plume-color-ink-tint']).toBe('#1e3a5f')
    expect(vars['--plume-color-ink-tint-strong']).toBe('#1e40af')
  })

  it('falls back to the lightest shade on dark themes when no shade reaches AA', () => {
    const vars = themeToCssVars(withColors({ dim: ramp('#3f3f46', { 50: '#52525b' }) }, darkTheme))
    expect(vars['--plume-color-dim-text']).toBe('#52525b')
  })
})
