import { promises as fs } from 'node:fs'
import path from 'node:path'
import postcss from 'postcss'
import postcssModules from 'postcss-modules'

export interface CssUnit {
  /** The CSS of the module files of the unit, with the class names the components use. */
  css: string
  /** The other units the components of this one render, so their CSS has to come with it. */
  imports: string[]
}

const TYPE_ONLY = /(?:import|export)\s+type\s[^;]*?from\s+['"][^'"]+['"]/g
const IMPORT = /(?:import|export)\s(?:[^'"]*?\sfrom\s)?['"]([^'"]+)['"]/g
const SKIPPED = new Set(['tests', 'stories'])

async function listSources(dir: string): Promise<string[]> {
  const entries = await fs.readdir(dir, { withFileTypes: true })
  const nested = await Promise.all(
    entries
      .filter((entry) => !(entry.isDirectory() && SKIPPED.has(entry.name)))
      .map((entry) => {
        const file = path.join(dir, entry.name)
        return entry.isDirectory() ? listSources(file) : [file]
      }),
  )
  return nested.flat().filter((file) => /\.(tsx?|css)$/.test(file) && !file.endsWith('.d.ts'))
}

const exists = (file: string): Promise<boolean> =>
  fs.stat(file).then(
    (stat) => stat.isFile(),
    () => false,
  )

async function resolveModule(from: string, specifier: string): Promise<string | undefined> {
  const base = path.resolve(path.dirname(from), specifier)
  const candidates = [base, `${base}.ts`, `${base}.tsx`, path.join(base, 'index.ts')]
  for (const candidate of candidates) if (await exists(candidate)) return candidate
  return undefined
}

/** `form/button/button.module.css` belongs to `button`, a file of a `shared` folder to itself. */
function unitOf(file: string): string {
  const { dir, name } = path.parse(file)
  const folder = path.basename(dir)
  return folder === 'shared' ? name.replace(/\.module$/, '') : folder
}

async function compileModule(file: string): Promise<string> {
  const source = await fs.readFile(file, 'utf8')
  const result = await postcss([postcssModules({ getJSON: () => undefined })]).process(source, {
    from: file,
  })
  return result.css
}

/**
 * Splits the CSS modules of `src/components` in units (one per component) and finds, from the
 * imports of its components, which other units each one needs.
 */
export async function buildCssUnits(srcDir: string): Promise<Record<string, CssUnit>> {
  const files = await listSources(srcDir)
  const allFiles = new Set(files)
  const componentsDir = path.join(srcDir, 'components') + path.sep
  const rootOf = (file: string): string => unitOf(file)

  const edges = new Map<string, string[]>()
  for (const file of files.filter((candidate) => !candidate.endsWith('.css'))) {
    const source = (await fs.readFile(file, 'utf8')).replace(TYPE_ONLY, '')
    const targets: string[] = []
    for (const [, specifier] of source.matchAll(IMPORT)) {
      if (!specifier.startsWith('.')) continue
      const target = await resolveModule(file, specifier)
      if (target) targets.push(target)
    }
    edges.set(file, targets)
  }

  const units: Record<string, { css: string[]; sources: string[] }> = {}
  for (const file of files.filter((candidate) => candidate.startsWith(componentsDir))) {
    const unit = file.endsWith('.css') ? rootOf(file) : path.basename(path.dirname(file))
    if (path.basename(path.dirname(file)) === 'shared' && !file.endsWith('.css')) continue
    units[unit] ??= { css: [], sources: [] }
    if (file.endsWith('.css')) units[unit].css.push(file)
    else units[unit].sources.push(file)
  }

  const result: Record<string, CssUnit> = {}
  for (const [name, unit] of Object.entries(units)) {
    if (unit.css.length === 0) continue
    const seen = new Set<string>()
    const queue = [...unit.sources]
    const imports = new Set<string>()
    while (queue.length > 0) {
      const file = queue.pop() as string
      if (seen.has(file)) continue
      seen.add(file)
      for (const target of edges.get(file) ?? []) {
        if (target.endsWith('.css')) imports.add(rootOf(target))
        else if (allFiles.has(target)) queue.push(target)
      }
    }
    imports.delete(name)
    const css = (await Promise.all(unit.css.sort().map(compileModule))).join('')
    result[name] = { css, imports: [...imports].sort() }
  }
  return result
}
