import { execFileSync } from 'node:child_process'
import { mkdirSync, readdirSync, readFileSync, statSync, writeFileSync } from 'node:fs'
import { createRequire } from 'node:module'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const here = path.dirname(fileURLToPath(import.meta.url))
const exampleDir = path.resolve(here, '../../example-vite')
const output = path.resolve(here, '../src/stackblitz-example.generated.json')
const packageDir = path.resolve(here, '../../../packages/plume-ui-react')
const localsOutput = path.resolve(here, '../src/story-locals.generated.json')
const sandboxOutput = path.resolve(here, '../src/stackblitz-sandbox.generated.json')

const ts = createRequire(path.join(packageDir, 'package.json'))('typescript')

const tracked = execFileSync('git', ['ls-files', '-z', '.'], { cwd: exampleDir, encoding: 'utf8' })
  .split('\0')
  .filter(Boolean)
  .sort()

if (tracked.length === 0) throw new Error(`No tracked files in ${exampleDir}`)

const files = Object.fromEntries(
  tracked.map((file) => [file, readFileSync(path.join(exampleDir, file), 'utf8')]),
)
files['.stackblitzrc'] = JSON.stringify({ installDependencies: true, startCommand: 'npm run dev' })

mkdirSync(path.dirname(output), { recursive: true })
writeFileSync(output, `${JSON.stringify({ files })}\n`)
const manifest = JSON.parse(files['package.json'])
const pick = (source, names) => Object.fromEntries(names.map((name) => [name, source[name]]))
const docsRequire = createRequire(path.join(here, '../package.json'))
const packageRequire = createRequire(path.join(packageDir, 'package.json'))
const themeSource = packageRequire('esbuild').buildSync({
  bundle: true,
  entryPoints: [path.join(packageDir, 'scripts/tailwind-css.ts')],
  format: 'cjs',
  logLevel: 'silent',
  platform: 'node',
  write: false,
}).outputFiles[0].text
const themeModule = { exports: {} }
new Function('module', 'exports', themeSource)(themeModule, themeModule.exports)
const tailwindTheme = themeModule.exports.buildTailwindCss()
writeFileSync(path.resolve(here, '../tailwind-theme.generated.css'), tailwindTheme)
const sandbox = {
  preflight: readFileSync(docsRequire.resolve('tailwindcss/preflight.css'), 'utf8'),
  tailwindTheme,
  dependencies: pick(manifest.dependencies, ['plume-ui-react', 'react', 'react-dom']),
  devDependencies: pick(manifest.devDependencies, ['@vitejs/plugin-react', 'vite']),
}
writeFileSync(sandboxOutput, `${JSON.stringify(sandbox)}\n`)
console.log(`StackBlitz example: ${tracked.length} files`)

const walk = (dir) =>
  readdirSync(dir).flatMap((name) => {
    const file = path.join(dir, name)
    if (statSync(file).isDirectory()) return walk(file)
    return file.endsWith('.stories.tsx') ? [file] : []
  })

const isExported = (statement) =>
  ts.getModifiers?.(statement)?.some((modifier) => modifier.kind === ts.SyntaxKind.ExportKeyword) ?? false

const locals = {}
for (const file of walk(path.join(packageDir, 'src'))) {
  const source = ts.createSourceFile(file, readFileSync(file, 'utf8'), ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX)
  const declared = {}
  for (const statement of source.statements) {
    if (isExported(statement)) continue
    const text = statement.getText(source)
    if (ts.isVariableStatement(statement)) {
      for (const declaration of statement.declarationList.declarations) {
        if (ts.isIdentifier(declaration.name)) declared[declaration.name.text] = text
      }
    } else if (ts.isFunctionDeclaration(statement) && statement.name) {
      declared[statement.name.text] = text
    }
  }
  if (Object.keys(declared).length > 0) locals[path.relative(packageDir, file)] = declared
}
writeFileSync(localsOutput, `${JSON.stringify(locals)}\n`)
console.log(`Story locals: ${Object.keys(locals).length} story files`)
