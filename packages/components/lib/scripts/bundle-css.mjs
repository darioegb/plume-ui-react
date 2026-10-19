// Resolves each package via its `./styles.css` export so the bundle follows the exports map.
import { createRequire } from 'node:module'
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs'

const require = createRequire(import.meta.url)

const packages = ['button', 'spinner', 'input', 'tabs', 'datepicker', 'field']

const css = packages
  .map((name) => {
    const cssPath = require.resolve(`@plume-ui-react/${name}/styles.css`)
    return `/* @plume-ui-react/${name} */\n${readFileSync(cssPath, 'utf8')}`
  })
  .join('\n')

mkdirSync('dist', { recursive: true })
writeFileSync('dist/index.css', css)
