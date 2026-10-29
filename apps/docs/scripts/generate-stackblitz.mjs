import { execFileSync } from 'node:child_process'
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const here = path.dirname(fileURLToPath(import.meta.url))
const exampleDir = path.resolve(here, '../../example-vite')
const output = path.resolve(here, '../src/stackblitz-example.generated.json')

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
console.log(`StackBlitz example: ${tracked.length} files`)
