import { readFileSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const here = path.dirname(fileURLToPath(import.meta.url))
const api = JSON.parse(readFileSync(path.resolve(here, '../src/api.generated.json'), 'utf8'))
const filter = process.argv[2]
const MAIN_EXCEPTIONS = { toast: 'ToastProvider' }

const missing = []
for (const [folder, components] of Object.entries(api)) {
  if (filter && folder !== filter) continue
  const main = MAIN_EXCEPTIONS[folder] ?? components.find((c) => c.name.toLowerCase() === folder)?.name
  for (const component of components) {
    if (component.name !== main && !component.description) {
      missing.push(`${folder}: ${component.name} has no description`)
    }
    for (const prop of component.props) {
      if (!prop.description) missing.push(`${folder}: ${component.name}.${prop.name} has no description`)
    }
  }
}

if (missing.length > 0) {
  console.log(missing.join('\n'))
  console.log(`\n${missing.length} missing descriptions`)
  process.exit(1)
}
console.log('API reference: every part and prop is described')
