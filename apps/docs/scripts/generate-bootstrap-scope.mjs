import { mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import { createRequire } from 'node:module'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const here = path.dirname(fileURLToPath(import.meta.url))
const docsDir = path.resolve(here, '..')
const root = path.resolve(docsDir, '../..')
const output = path.resolve(docsDir, 'bootstrap-scoped.generated.css')

const postcss = createRequire(path.join(root, 'package.json'))('postcss')
const source = createRequire(path.join(docsDir, 'package.json')).resolve(
  'bootstrap/dist/css/bootstrap.min.css',
)

const SCOPE = '.bs-scope'
const ROOT_SELECTOR = /^(:root|html|body)(?![\w-])/

const THEME_PREFIX = /^(\[data-bs-theme=[^\]]+\])(.*)$/

const scoped = (selector) => {
  const trimmed = selector.trim()
  if (ROOT_SELECTOR.test(trimmed)) return [trimmed.replace(ROOT_SELECTOR, SCOPE)]
  const theme = THEME_PREFIX.exec(trimmed)
  if (theme) {
    const [, attribute, rest] = theme
    return [`${SCOPE}${attribute}${rest}`, `${SCOPE} ${attribute}${rest}`, `${attribute} ${SCOPE}${rest}`]
  }
  return [`${SCOPE} ${trimmed}`]
}

const insideKeyframes = (rule) =>
  rule.parent?.type === 'atrule' && /keyframes$/i.test(rule.parent.name)

const root_ = postcss.parse(readFileSync(source, 'utf8'))
root_.walkAtRules('charset', (rule) => rule.remove())
root_.walkRules((rule) => {
  if (insideKeyframes(rule)) return
  rule.selectors = rule.selectors.flatMap(scoped)
})

mkdirSync(path.dirname(output), { recursive: true })
writeFileSync(output, root_.toString())
console.log(`Bootstrap scoped to ${SCOPE}: ${(root_.toString().length / 1024).toFixed(0)} KB`)
