import { readdirSync, readFileSync } from 'node:fs'
import { join, relative } from 'node:path'
import { defaultDarkTheme, defaultTheme } from '../theme/config'
import { themeToCssVars } from '../theme/theme-to-css-vars'
import type { Theme } from '../theme/theme.types'
import { deepMerge } from '../utils/merge'

const srcDir = join(__dirname, '..')

const walk = (dir: string): string[] =>
  readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const path = join(dir, entry.name)
    return entry.isDirectory() ? walk(path) : [path]
  })

const stylesheets = walk(srcDir).filter((file) => file.endsWith('.module.css'))
const lightTokens = new Set(Object.keys(themeToCssVars(defaultTheme)))
const positionVars = new Set(['--plume-available-height', '--plume-available-width'])
const darkTokens = new Set(
  Object.keys(themeToCssVars(deepMerge<Theme>(defaultTheme, defaultDarkTheme as Theme))),
)

describe('design tokens used by the stylesheets', () => {
  it('finds the stylesheets', () => {
    expect(stylesheets.length).toBeGreaterThan(0)
  })

  it.each(stylesheets.map((file) => [relative(srcDir, file), file]))(
    '%s only uses tokens the theme emits',
    (_, file) => {
      const used = new Set(readFileSync(file, 'utf8').match(/--plume-[a-z0-9-]+/g) ?? [])
      const unknown = [...used].filter(
        (token) => !positionVars.has(token) && (!lightTokens.has(token) || !darkTokens.has(token)),
      )
      expect(unknown).toEqual([])
    },
  )
})
