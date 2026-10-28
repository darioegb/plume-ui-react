import { defaultTheme } from '../theme/config'
import { themeToCssVars } from '../theme/theme-to-css-vars'

describe('public design tokens', () => {
  it('keeps the names of the --plume-* variables', async () => {
    const names = Object.keys(themeToCssVars(defaultTheme)).sort((a, b) => a.localeCompare(b))
    await expect(`${names.join('\n')}\n`).toMatchFileSnapshot('./token-names.txt')
  })
})
