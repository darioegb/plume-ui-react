// Bundles every component's built CSS into a single dist/index.css.
// Each package is resolved through its `./styles.css` export, so this stays in
// sync with the exports map and never relies on fragile relative paths.
import { createRequire } from 'node:module'
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs'

const require = createRequire(import.meta.url)

const packages = ['button', 'spinner', 'input', 'tabs', 'datepicker']

const css = packages
  .map((name) => {
    const cssPath = require.resolve(`@plume-ui-react/${name}/styles.css`)
    return `/* @plume-ui-react/${name} */\n${readFileSync(cssPath, 'utf8')}`
  })
  .join('\n')

mkdirSync('dist', { recursive: true })
writeFileSync('dist/index.css', css)
