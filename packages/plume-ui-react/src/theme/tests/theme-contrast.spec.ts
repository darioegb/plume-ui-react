import { getContrastRatio } from '../../utils/colors'
import { deepMerge } from '../../utils/merge'
import { defaultDarkTheme, defaultTheme } from '../config'
import { themeToCssVars } from '../theme-to-css-vars'
import type { Theme } from '../theme.types'

const themes = [
  ['light', defaultTheme],
  ['dark', deepMerge<Theme>(defaultTheme, defaultDarkTheme as Theme)],
] as const

describe.each(themes)('default %s theme contrast', (_, theme) => {
  const { semantic } = theme
  const surfaces = [semantic.background, semantic.surface, semantic.surfaceMuted]

  it.each(surfaces)(
    'keeps borderStrong at 3:1 or more against %s, as WCAG asks of a control boundary',
    (surface) => {
      expect(getContrastRatio(semantic.borderStrong, surface)).toBeGreaterThanOrEqual(3)
    },
  )

  it.each(surfaces)('keeps muted text at 4.5:1 or more against %s', (surface) => {
    expect(getContrastRatio(semantic.muted, surface)).toBeGreaterThanOrEqual(4.5)
  })

  it.each(surfaces)('keeps the foreground at 4.5:1 or more against %s', (surface) => {
    expect(getContrastRatio(semantic.foreground, surface)).toBeGreaterThanOrEqual(4.5)
  })

  it('keeps the text of every color scheme at 4.5:1 or more on its tints', () => {
    const vars = themeToCssVars(theme)
    for (const scheme of Object.keys(theme.colors)) {
      const text = vars[`--plume-color-${scheme}-tint-text`]
      for (const tint of ['tint', 'tint-strong']) {
        const ratio = getContrastRatio(text, vars[`--plume-color-${scheme}-${tint}`])
        expect(ratio, `${scheme} on ${tint}`).toBeGreaterThanOrEqual(4.5)
      }
    }
  })
})
