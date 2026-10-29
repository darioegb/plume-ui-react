import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const packageDir = join(root, 'packages/plume-ui-react')
const templatesDir = join(root, 'scripts/component-templates')

const categories = ['form', 'interaction', 'presentation', 'navigation', 'overlay', 'utility']
const usage = `Usage: pnpm new:component <Name> <category> [--compound]

  Name        PascalCase component name, e.g. Badge
  category    ${categories.join(' | ')}
  --compound  Scaffold a root with a context and a <Name>Content part instead of a single component`

function fail(message) {
  console.error(`${message}\n\n${usage}`)
  process.exit(1)
}

const args = process.argv.slice(2)
const compound = args.includes('--compound')
const [name, category] = args.filter((arg) => !arg.startsWith('--'))

if (!name || !category) fail('Missing arguments.')
if (!/^[A-Z][A-Za-z0-9]*$/.test(name)) fail(`"${name}" is not a PascalCase name.`)
if (!categories.includes(category)) fail(`Unknown category "${category}".`)

const slug = name.toLowerCase()
const camel = name[0].toLowerCase() + name.slice(1)
const componentDir = join(packageDir, 'src/components', category, slug)

if (existsSync(componentDir)) fail(`${componentDir} already exists.`)

const render = (text) =>
  text.replaceAll('__Name__', name).replaceAll('__slug__', slug).replaceAll('__camel__', camel)

const files = compound
  ? {
      'component.tsx.tpl': `${slug}.tsx`,
      'part.tsx.tpl': `${slug}-content.tsx`,
      'context.ts.tpl': `${slug}-context.ts`,
      'module.css.tpl': `${slug}.module.css`,
      'index.ts.tpl': 'index.ts',
      'stories.tsx.tpl': `stories/${slug}.stories.tsx`,
      'spec.tsx.tpl': `tests/${slug}.spec.tsx`,
    }
  : {
      'component.tsx.tpl': `${slug}.tsx`,
      'module.css.tpl': `${slug}.module.css`,
      'index.ts.tpl': 'index.ts',
      'stories.tsx.tpl': `stories/${slug}.stories.tsx`,
      'spec.tsx.tpl': `tests/${slug}.spec.tsx`,
    }

const templateSet = join(templatesDir, compound ? 'compound' : 'atomic')
for (const [template, target] of Object.entries(files)) {
  const targetPath = join(componentDir, target)
  mkdirSync(dirname(targetPath), { recursive: true })
  writeFileSync(targetPath, render(readFileSync(join(templateSet, template), 'utf8')))
}

function update(path, transform) {
  const current = readFileSync(path, 'utf8')
  const next = transform(current)
  if (next === current) throw new Error(`Could not register ${name} in ${path}`)
  writeFileSync(path, next)
}

const exportLine = (categoryName, componentSlug) =>
  `export * from './components/${categoryName}/${componentSlug}'`
const componentSlugOf = (line) => line.slice(line.lastIndexOf('/') + 1, -1)

update(join(packageDir, 'src/index.ts'), (text) => {
  const lines = text.trimEnd().split('\n')
  const prefix = "export * from './components/"
  const components = lines.filter((line) => line.startsWith(prefix))
  const others = lines.filter((line) => !line.startsWith(prefix))
  const sorted = [...components, exportLine(category, slug)].sort((a, b) =>
    componentSlugOf(a).localeCompare(componentSlugOf(b)),
  )
  return `${[...others, ...sorted].join('\n')}\n`
})

const publicExports = compound ? [name, `${name}Content`] : [name]
update(join(packageDir, 'src/tests/index.spec.ts'), (text) =>
  text.replace(/(toEqual\(\[\n)([\s\S]*?)(\n\s*\]\))/, (_, open, body, close) => {
    const names = [...body.matchAll(/'([^']+)'/g)].map((match) => match[1])
    const sorted = [...names, ...publicExports].sort()
    return `${open}${sorted.map((item) => `      '${item}',`).join('\n')}${close}`
  }),
)

update(join(root, 'README.md'), (text) => {
  const row = `| ${name} | [${name}](https://darioegb.github.io/plume-ui-react/?path=/docs/components-${slug}--docs) |`
  const lines = text.split('\n')
  const rowPattern = /^\| ([A-Za-z0-9]+) \| \[\1\]\(/
  const rows = lines.map((line, index) => ({ line, index })).filter(({ line }) => rowPattern.test(line))
  const nameOf = (line) => rowPattern.exec(line)[1]
  const next = rows.find(({ line }) => nameOf(line).localeCompare(name) > 0)
  const insertAt = next ? next.index : rows[rows.length - 1].index + 1
  lines.splice(insertAt, 0, row)
  return lines.join('\n')
})

update(join(packageDir, 'README.md'), (text) => {
  const item = `- [${name}](https://darioegb.github.io/plume-ui-react/?path=/docs/components-${slug}--docs)`
  const lines = text.split('\n')
  const itemPattern = /^- \[([A-Za-z0-9]+)\]\(https:\/\/darioegb\.github\.io\/plume-ui-react\/\?path=\/docs\/components-/
  const items = lines.map((line, index) => ({ line, index })).filter(({ line }) => itemPattern.test(line))
  const nameOf = (line) => itemPattern.exec(line)[1]
  const next = items.find(({ line }) => nameOf(line).localeCompare(name) > 0)
  const insertAt = next ? next.index : items[items.length - 1].index + 1
  lines.splice(insertAt, 0, item)
  return lines.join('\n')
})

console.log(`Created ${name} (${compound ? 'compound' : 'atomic'}) in packages/plume-ui-react/src/components/${category}/${slug}

Registered it in src/index.ts, src/tests/index.spec.ts, the root README table and the component list of the package README.

Still to do by hand (see AUTHORING.md):
  - replace the placeholder styles, props and stories
  - run the checklist, then add a changeset with \`pnpm changeset\``)
