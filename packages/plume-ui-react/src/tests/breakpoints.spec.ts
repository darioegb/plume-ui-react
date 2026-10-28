import postcss from 'postcss'
import { breakpoints } from '../../scripts/postcss-breakpoints'
import { defaultTheme } from '../theme/config'

const run = async (css: string): Promise<string> =>
  (await postcss([breakpoints()]).process(css, { from: undefined })).css

describe('breakpoints of the stylesheets', () => {
  it.each(Object.entries(defaultTheme.breakpoints))(
    'writes %s as the width of the theme',
    async (name, width) => {
      expect(await run(`@media (--${name}) { a { top: 0 } }`)).toContain(`(width >= ${width})`)
      expect(await run(`@media (--below-${name}) { a { top: 0 } }`)).toContain(`(width < ${width})`)
    },
  )

  it('keeps the rest of the query', async () => {
    expect(await run('@media (--md) and (hover: hover) { a { top: 0 } }')).toContain(
      `(width >= ${defaultTheme.breakpoints.md}) and (hover: hover)`,
    )
  })

  it('fails with a breakpoint that does not exist', async () => {
    await expect(run('@media (--huge) { a { top: 0 } }')).rejects.toThrow('Unknown breakpoint')
  })
})
