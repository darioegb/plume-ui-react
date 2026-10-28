import { readFileSync } from 'node:fs'
import path from 'node:path'
import { defaultTheme } from '../theme/config'

const stylesheet = (name: string): string =>
  readFileSync(
    path.join(__dirname, '..', 'components', 'navigation', name, `${name}.module.css`),
    'utf8',
  )

describe('breakpoints of the stylesheets', () => {
  const { sm, md, lg } = defaultTheme.breakpoints

  it.each(['navbar', 'sidebar'])('%s only uses the sm, md and lg of the default theme', (name) => {
    const widths = new Set(
      [...stylesheet(name).matchAll(/@media \(width (?:<|>=) ([\d.]+rem)\)/g)].map(
        (match) => match[1],
      ),
    )
    expect(widths.size).toBeGreaterThan(0)
    for (const width of widths) expect([sm, md, lg]).toContain(width)
  })
})
