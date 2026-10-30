// Type-checks every `parameters.docs.source.code` snippet of the stories, and every tsx block of the
// guides, against the public API,
// so a rename or a removed prop breaks the lint instead of leaving a stale "Show code".
import { readdirSync, readFileSync, statSync } from 'node:fs'
import { dirname, join, relative, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import ts from 'typescript'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const src = join(root, 'src')
const guides = resolve(root, '../../apps/docs/stories')

// Names the snippets use without defining them: sample data and icons the reader brings.
const PLACEHOLDERS = new Set([
  'App',
  'ArrowRightIcon',
  'BellIcon',
  'BookingValues',
  'Controller',
  'FileIcon',
  'FolderIcon',
  'HomeIcon',
  'LanguageSwitch',
  'PromoBanner',
  'Routes',
  'SearchIcon',
  'UserIcon',
  'UsersIcon',
  'Values',
  'inboxIcon',
  'sendIcon',
  'trashIcon',
  'useForm',
])
// Sample data the reader brings; declared so the code that reads it still has a type.
const DATA = {
  en: 'any',
  es: 'any',
  fetchMembers: '(...args: any[]) => Promise<any>',
  members: 'any[]',
  people: 'any[]',
}
const NOT_FOUND = new Set([2304, 2552])
const MISSING_PROP = 2741
const UNKNOWN_PROP = 2353
const REACT_HOOKS = ['useCallback', 'useEffect', 'useId', 'useMemo', 'useRef', 'useState']
const TEMPLATE = /code:\s*`((?:\\`|\\\$|[^`])*)`/g
const FENCE = /^```tsx?\n([\s\S]*?)^```$/gm

const walk = (dir) =>
  readdirSync(dir).flatMap((name) => {
    const path = join(dir, name)
    if (statSync(path).isDirectory()) return walk(path)
    return path.endsWith('.stories.tsx') ? [path] : []
  })

const IMPORT = /^import\s+(type\s+)?(?:([^'\n]*?|\{[^}]*\})\s+from\s+)?'([^']+)'\n?/gm

// A guide shows a whole module: its file name, 'use client' and its imports. The imports of
// plume-ui-react and react stay, and what comes from any other module is declared as `any`. A
// before and after of the upgrade guide is checked from `// After` on.
function guideModule(text) {
  const imports = []
  const imported = new Set()
  const code = text
    .split(/^\/\/ After\n/m)
    .pop()
    .replace(/^(\/\/ .*\n)+/, '')
    .replace(/^'use client'\n+/, '')
    .replace(IMPORT, (_, typeOnly = '', clause, source) => {
      if (!clause) return ''
      const names = clause
        .replace(/[{}]/g, ' ')
        .split(',')
        .map((part) => part.trim().replace(/^type\s+/, '').split(/\s+as\s+/).pop())
        .filter(Boolean)
      names.forEach((name) => imported.add(name))
      if (source === 'plume-ui-react' || source === 'react') imports.push(`import ${typeOnly}${clause} from '${source}'`)
      else names.forEach((name) => imports.push(`declare const ${name}: any\ntype ${name} = any`))
      return ''
    })
    .trim()
  return { code, imported, imports }
}

function collectSnippets() {
  const snippets = []
  for (const file of walk(src)) {
    const text = readFileSync(file, 'utf8')
    for (const match of text.matchAll(TEMPLATE)) {
      const before = text.slice(0, match.index)
      const stories = [...before.matchAll(/export const (\w+): Story/g)]
      snippets.push({
        code: match[1].replaceAll('\\`', '`').replaceAll('\\$', '$'),
        file: relative(root, file),
        story: stories.at(-1)?.[1] ?? '(unknown story)',
      })
    }
  }
  for (const name of readdirSync(guides).filter((file) => file.endsWith('.mdx'))) {
    const text = readFileSync(join(guides, name), 'utf8')
    for (const match of text.matchAll(FENCE)) {
      const before = text.slice(0, match.index)
      const headings = [...before.matchAll(/^#+ (.+)$/gm)]
      snippets.push({
        ...guideModule(match[1]),
        file: relative(root, join(guides, name)),
        guide: true,
        story: headings.at(-1)?.[1] ?? '(top)',
      })
    }
  }
  return snippets
}

const config = ts.getParsedCommandLineOfConfigFile(
  join(root, 'tsconfig.json'),
  {},
  {
    ...ts.sys,
    onUnRecoverableConfigFileDiagnostic: (diagnostic) => {
      throw new Error(ts.flattenDiagnosticMessageText(diagnostic.messageText, '\n'))
    },
  },
)
const options = {
  ...config.options,
  noEmit: true,
  noImplicitAny: false,
  noUnusedLocals: false,
  noUnusedParameters: false,
  skipLibCheck: true,
}
const ambient = config.fileNames.filter((name) => name.endsWith('.d.ts'))
const indexPath = join(src, 'index.ts')
// The guides import from the package, and the module augmentation of a guide reaches the others.
options.paths = { ...options.paths, 'plume-ui-react': [indexPath] }

function wrapGuide(code) {
  const jsx = code.search(/^<[A-Za-z]/m)
  if (jsx >= 0) return `${code.slice(0, jsx)}export const Snippet = (\n<>\n${code.slice(jsx)}\n</>\n)\n`
  if (/^(export|function|const|let|class|type|interface|declare)\b/m.test(code)) return `${code}\n`
  return `export function Snippet() {\n${code}\n}\n`
}

function wrap(code) {
  if (/^return\b/m.test(code)) return `export function Snippet() {\n${code}\n}\n`
  const statements = /^\s*(function|const|let|class)\b/.test(code)
  if (!statements) return `export const Snippet = (\n<>\n${code}\n</>\n)\n`
  const jsx = code.search(/^<[A-Za-z]/m)
  if (jsx < 0) return `${code}\n`
  return `${code.slice(0, jsx)}export const Snippet = (\n<>\n${code.slice(jsx)}\n</>\n)\n`
}

// Snippets that are not one TSX file (a stylesheet, then the markup) cannot be compiled.
const skipped = []
const snippets = collectSnippets().filter((snippet) => {
  const other = /^\s*\/\//.test(snippet.code)
  if (other) skipped.push(snippet)
  return !other
})
const virtual = new Map()
snippets.forEach((snippet, index) => {
  snippet.path = join(src, '__snippets__', `snippet-${String(index).padStart(3, '0')}.tsx`)
  snippet.complete = !snippet.guide && /^\s*function\b/.test(snippet.code)
  snippet.body = snippet.guide ? wrapGuide(snippet.code) : wrap(snippet.code)
  virtual.set(snippet.path, snippet)
})

// First pass: the names the library exports, types included.
const probe = ts.createProgram([indexPath, ...ambient], options)
const checker = probe.getTypeChecker()
const indexModule = checker.getSymbolAtLocation(probe.getSourceFile(indexPath))
const exported = new Set(checker.getExportsOfModule(indexModule).map((symbol) => symbol.name))

for (const snippet of snippets) {
  const words = new Set(snippet.code.match(/\b[A-Za-z_]\w*\b/g))
  const own = snippet.imported ?? new Set()
  const names = [...words].filter((word) => exported.has(word) && !own.has(word))
  const hooks = REACT_HOOKS.filter((hook) => words.has(hook) && !own.has(hook))
  const data = Object.keys(DATA).filter(
    (name) =>
      words.has(name) && !new RegExp(`\\b(const|let|function)\\s+${name}\\b`).test(snippet.code),
  )
  snippet.header = [
    ...(snippet.imports ?? []),
    data.map((name) => `declare const ${name}: ${DATA[name]}`).join('\n'),
    hooks.length ? `import { ${hooks.join(', ')} } from 'react'` : '',
    names.length ? `import { ${names.join(', ')} } from '../index'` : '',
  ].join('\n')
  snippet.text = `${snippet.header}\n${snippet.body}`
  snippet.offset = snippet.header.split('\n').length
}

const host = ts.createCompilerHost(options)
const { fileExists, getSourceFile, readFile } = host
host.fileExists = (name) => virtual.has(name) || fileExists.call(host, name)
host.readFile = (name) => virtual.get(name)?.text ?? readFile.call(host, name)
host.getSourceFile = (name, languageVersion, ...rest) => {
  const snippet = virtual.get(name)
  return snippet
    ? ts.createSourceFile(name, snippet.text, languageVersion, true, ts.ScriptKind.TSX)
    : getSourceFile.call(host, name, languageVersion, ...rest)
}

const program = ts.createProgram([...virtual.keys(), ...ambient], options, host)
const failures = []
for (const [path, snippet] of virtual) {
  const file = program.getSourceFile(path)
  const diagnostics = [
    ...program.getSyntacticDiagnostics(file),
    ...program.getSemanticDiagnostics(file),
  ]
  for (const diagnostic of diagnostics) {
    const message = ts.flattenDiagnosticMessageText(diagnostic.messageText, '\n')
    const name = /'([^']+)'/.exec(message)?.[1]
    // A fragment leaves out its state, handlers and required props: those are not API drift.
    if (NOT_FOUND.has(diagnostic.code) && (PLACEHOLDERS.has(name) || /^[a-z]/.test(name))) continue
    if (diagnostic.code === MISSING_PROP && !snippet.complete) continue
    if (diagnostic.code === UNKNOWN_PROP && name?.startsWith('--')) continue
    const { line } = file.getLineAndCharacterOfPosition(diagnostic.start ?? 0)
    failures.push(
      `${snippet.file} :: ${snippet.story} (snippet line ${line + 1 - snippet.offset}): ${message}`,
    )
  }
}

if (failures.length > 0) {
  console.error(`Story snippets that do not compile against the public API:\n`)
  for (const failure of failures) console.error(`  ${failure}`)
  console.error(
    `\n${failures.length} problem(s). Fix the snippet, or add a name the reader brings to PLACEHOLDERS.`,
  )
  process.exit(1)
}
console.log(
  `Story snippets: ${snippets.length} compile against the public API (${skipped.length} are not a single file and are skipped).`,
)
