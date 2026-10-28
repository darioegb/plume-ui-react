import { buildTokensCss } from '../../scripts/tokens-css'
import { defaultTheme } from '../theme/config'

describe('tokens.css', () => {
  const css = buildTokensCss()

  it('declares the light tokens on :root and the dark ones on the dark mode', () => {
    expect(css).toContain(`:root,[data-plume-color-mode='light']{--plume-color-primary-50:`)
    expect(css).toContain(`[data-plume-color-mode='dark']{--plume-color-primary-text:`)
  })

  it('stops the motion when the user asks for less', () => {
    const reduced = css.slice(css.indexOf('@media(prefers-reduced-motion:reduce)'))
    for (const name of Object.keys(defaultTheme.motion.durations)) {
      expect(reduced).toContain(`--plume-duration-${name}:0s!important`)
    }
    expect(reduced).toContain('[data-plume-color-mode]')
  })

  it('leaves the other tokens alone in that query', () => {
    const reduced = css.slice(css.indexOf('@media(prefers-reduced-motion:reduce)'))
    expect(reduced).not.toContain('--plume-space-')
  })
})
