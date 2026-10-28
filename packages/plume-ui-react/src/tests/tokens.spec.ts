import { existsSync, readdirSync, readFileSync } from 'node:fs'
import { join, relative } from 'node:path'
import { defaultDarkTheme, defaultTheme } from '../theme/config'
import { themeToCssVars } from '../theme/theme-to-css-vars'
import type { Theme } from '../theme/theme.types'
import { deepMerge } from '../utils/merge'

const srcDir = join(__dirname, '..')
const appsDir = join(__dirname, '..', '..', '..', '..', 'apps')

const walk = (dir: string): string[] =>
  readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const path = join(dir, entry.name)
    return entry.isDirectory() ? walk(path) : [path]
  })

const stylesheets = walk(srcDir).filter((file) => file.endsWith('.module.css'))
const exampleStylesheets = readdirSync(appsDir)
  .filter((name) => name.startsWith('example-') && existsSync(join(appsDir, name, 'src')))
  .flatMap((name) => walk(join(appsDir, name, 'src')))
  .filter((file) => file.endsWith('.css'))
const lightTokens = new Set(Object.keys(themeToCssVars(defaultTheme)))
const positionVars = new Set(['--plume-available-height', '--plume-available-width'])
const darkTokens = new Set(
  Object.keys(themeToCssVars(deepMerge<Theme>(defaultTheme, defaultDarkTheme as Theme))),
)

describe('design tokens used by the stylesheets', () => {
  it('finds the stylesheets', () => {
    expect(stylesheets.length).toBeGreaterThan(0)
  })

  const unknownTokens = (file: string): string[] => {
    const used = new Set(readFileSync(file, 'utf8').match(/--plume-[a-z0-9-]+/g) ?? [])
    return [...used].filter(
      (token) => !positionVars.has(token) && (!lightTokens.has(token) || !darkTokens.has(token)),
    )
  }

  it.each(stylesheets.map((file) => [relative(srcDir, file), file]))(
    '%s only uses tokens the theme emits',
    (_, file) => {
      expect(unknownTokens(file)).toEqual([])
    },
  )

  it('finds the stylesheets of the examples', () => {
    expect(exampleStylesheets.length).toBeGreaterThan(0)
  })

  it.each(exampleStylesheets.map((file) => [relative(appsDir, file), file]))(
    'the example %s only uses tokens the theme emits',
    (_, file) => {
      expect(unknownTokens(file)).toEqual([])
    },
  )
})
