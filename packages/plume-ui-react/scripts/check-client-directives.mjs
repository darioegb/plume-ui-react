import { existsSync, readdirSync, readFileSync } from 'node:fs'
import { join, relative } from 'node:path'

const srcDir = 'src'
const distDir = 'dist'

const serverSafeHooks = new Set(['useId', 'useMemo', 'useCallback', 'useDebugValue'])
const clientOnlyImports = new Set(['createContext', 'Component', 'PureComponent'])

const walk = (dir) =>
  readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const path = join(dir, entry.name)
    return entry.isDirectory() ? walk(path) : [path]
  })

const modules = walk(srcDir).filter(
  (file) => /\.tsx?$/.test(file) && !/[\\/](tests|stories)[\\/]/.test(file),
)

const stripComments = (code) => code.replace(/\/\*[\s\S]*?\*\//g, '').replace(/^\s*\/\/.*$/gm, '')

function clientReason(code) {
  const source = stripComments(code)
  for (const [, specifiers] of source.matchAll(/import\s*\{([^}]*)\}\s*from\s*'react'/g)) {
    const names = specifiers.split(',').map((specifier) => specifier.trim().split(/\s+as\s+/)[0])
    const clientOnly = names.find(
      (name) => clientOnlyImports.has(name) || (/^use[A-Z]/.test(name) && !serverSafeHooks.has(name)),
    )
    if (clientOnly) return `imports ${clientOnly} from react`
  }
  for (const [, hook] of source.matchAll(/\b(use[A-Z]\w*)\s*[(<]/g)) {
    if (!serverSafeHooks.has(hook)) return `calls ${hook}`
  }
  if (/\.Provider\b/.test(source)) return 'renders a context Provider'
  return undefined
}

const hasDirective = (code) => /^\s*(['"])use client\1/.test(code)

const problems = []

for (const file of modules) {
  const code = readFileSync(file, 'utf8')
  const reason = clientReason(code)
  const marked = hasDirective(code)
  if (reason && !marked) problems.push(`${file} ${reason}, so it needs 'use client'`)
  if (!reason && marked) problems.push(`${file} has 'use client' but uses no client-only API`)

  const output = join(distDir, relative(srcDir, file).replace(/\.tsx?$/, '.mjs'))
  if (!existsSync(output)) {
    problems.push(`${output} is missing from the build`)
  } else if (hasDirective(readFileSync(output, 'utf8')) !== marked) {
    problems.push(`${output} ${marked ? 'lost' : 'gained'} the 'use client' directive`)
  }
}

for (const file of walk(distDir).filter((path) => /chunk-.*\.mjs$/.test(path))) {
  if (hasDirective(readFileSync(file, 'utf8'))) problems.push(`${file} is a shared chunk with a directive`)
}

if (problems.length > 0) {
  console.error(`'use client' check failed:\n${problems.map((problem) => `  - ${problem}`).join('\n')}`)
  process.exit(1)
}

console.log(`'use client' check passed for ${modules.length} modules`)
