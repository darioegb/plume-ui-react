import * as plume from 'plume-ui-react'
import sandbox from './stackblitz-sandbox.generated.json'

export type SandboxFiles = Record<string, string>

const REACT_HOOKS = ['useCallback', 'useEffect', 'useId', 'useMemo', 'useRef', 'useState']
const FORM_LIBRARY = ['Controller', 'useForm']
const PLUME_NAMES = new Set(Object.keys(plume))

const WRAPPER_NAMES = ['App', 'Example', 'Story', 'Demo']

const STUBS: [RegExp, (name: string) => string][] = [
  [/^App$/, (name) => `const ${name} = () => <p>Your app goes here.</p>`],
  [/^[A-Z]\w*Icon$/, (name) => `const ${name} = () => <span aria-hidden="true">●</span>`],
  [/^[a-z]\w*Icon$/, (name) => `const ${name} = <span aria-hidden="true">●</span>`],
  [/^(handle|on|set)[A-Z]\w*$/, (name) => `const ${name} = (..._args: unknown[]) => undefined`],
  [/^value$/, (name) => `const ${name}: any = undefined`],
]

const declares = (code: string, name: string): boolean =>
  new RegExp(`\\b(const|let|function|class)\\s+${name}\\b|\\[[^\\]]*\\b${name}\\b[^\\]]*\\]\\s*=|\\{[^}]*\\b${name}\\b[^}]*\\}\\s*=[^=>]`).test(
    code,
  )

const referenced = (code: string, name: string): boolean =>
  new RegExp(`(^|[^\\w.'"$-])${name}(?![\\w'"$-]|\\s*[:=]\\s*[^=])`, 'm').test(code)

const words = (code: string): string[] =>
  Array.from(new Set(code.match(/\b[A-Za-z_]\w*\b/g) ?? []))

function renderedComponent(code: string): string | null {
  const jsx = code.search(/^<[A-Za-z]/m)
  if (jsx >= 0) return null
  return /^\s*function\s+([A-Z]\w*)/m.exec(code)?.[1] ?? null
}

function wrap(code: string, name: string): string {
  if (/^return\b/m.test(code)) return `export default function ${name}() {\n${code}\n}\n`
  const statements = /^\s*(function|const|let|class)\b/.test(code)
  if (!statements) return `export default function ${name}() {\n  return (\n<>\n${code}\n</>\n  )\n}\n`
  const jsx = code.search(/^<[A-Za-z]/m)
  if (jsx < 0) {
    const component = renderedComponent(code)
    return component
      ? `${code}\nexport default function ${name}() {\n  return <${component} />\n}\n`
      : `${code}\nexport default function ${name}() {\n  return null\n}\n`
  }
  return `export default function ${name}() {\n${code.slice(0, jsx)}\n  return (\n<>\n${code.slice(jsx)}\n</>\n  )\n}\n`
}

type Locals = Record<string, string>

function collectLocals(code: string, locals: Locals): string[] {
  const included: string[] = []
  const visited = new Set<string>()
  const include = (name: string): void => {
    if (visited.has(name)) return
    visited.add(name)
    const text = locals[name]
    words(text).forEach((word) => {
      if (word !== name && word in locals) include(word)
    })
    if (!included.includes(text)) included.push(text)
  }
  words(code).forEach((name) => {
    if (name in locals && name !== 'meta' && !declares(code, name) && referenced(code, name)) include(name)
  })
  return included
}

export function buildApp(code: string, locals: Locals = {}): string {
  const extra = collectLocals(code, locals)
  const all = [code, ...extra].join('\n')
  const used = words(all)
  const wrapperName = WRAPPER_NAMES.find((name) => !used.includes(name)) ?? 'PlumeStoryExample'
  const plumeNames = used.filter((word) => PLUME_NAMES.has(word) && !declares(all, word))
  const hooks = REACT_HOOKS.filter((hook) => used.includes(hook))
  const form = FORM_LIBRARY.filter((name) => used.includes(name) && !declares(all, name))
  const stubs = used.flatMap((name) => {
    if (declares(all, name) || PLUME_NAMES.has(name)) return []
    if (!/Icon$/.test(name) && !referenced(code, name)) return []
    const stub = STUBS.find(([pattern]) => pattern.test(name))
    return stub ? [stub[1](name)] : []
  })
  const header = [
    hooks.length ? `import { ${hooks.join(', ')} } from 'react'` : '',
    plumeNames.length ? `import { ${plumeNames.join(', ')} } from 'plume-ui-react'` : '',
    form.length ? `import { ${form.join(', ')} } from 'react-hook-form'` : '',
    ...stubs,
    ...extra,
  ].filter(Boolean)
  return `${header.join('\n')}\n\n${wrap(code.trim(), wrapperName)}`
}

const MAIN = `import { Component, StrictMode } from 'react'
import type { ErrorInfo, ReactNode } from 'react'
import { createRoot } from 'react-dom/client'
import { ThemeProvider, ToastProvider } from 'plume-ui-react'
import 'plume-ui-react/styles.css'
import App from './App'

class Boundary extends Component<{ children: ReactNode }, { error: Error | null }> {
  state = { error: null as Error | null }
  static getDerivedStateFromError(error: Error) {
    return { error }
  }
  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error(error, info.componentStack)
  }
  render() {
    const { error } = this.state
    if (!error) return this.props.children
    const missing = /(\\w+) is not defined/.exec(error.message)?.[1]
    return (
      <p role="alert">
        {missing
          ? \`This example uses "\${missing}", which the story defines elsewhere. Define it in src/App.tsx.\`
          : error.message}
      </p>
    )
  }
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ThemeProvider style={{ minHeight: '100vh', padding: '1.5rem', boxSizing: 'border-box' }}>
      <ToastProvider>
        <Boundary>
          <App />
        </Boundary>
      </ToastProvider>
    </ThemeProvider>
  </StrictMode>,
)
`

const INDEX_HTML = `<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Plume UI React</title>
  </head>
  <body style="margin: 0">
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
`

const VITE_CONFIG = `import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({ plugins: [react()] })
`

const TSCONFIG = {
  compilerOptions: {
    target: 'ES2020',
    lib: ['ES2020', 'DOM', 'DOM.Iterable'],
    module: 'ESNext',
    moduleResolution: 'bundler',
    jsx: 'react-jsx',
    skipLibCheck: true,
    noEmit: true,
  },
  include: ['src'],
}

export function buildSandbox(code: string, name: string, locals: Locals = {}): SandboxFiles {
  const app = buildApp(code, locals)
  const form = /from 'react-hook-form'/.test(app)
  return {
    '.stackblitzrc': JSON.stringify({ installDependencies: true, startCommand: 'npm run dev' }),
    'index.html': INDEX_HTML,
    'package.json': JSON.stringify(
      {
        name: `plume-ui-react-${name}`,
        private: true,
        type: 'module',
        scripts: { dev: 'vite' },
        dependencies: { ...sandbox.dependencies, ...(form ? { 'react-hook-form': '^7.0.0' } : {}) },
        devDependencies: sandbox.devDependencies,
      },
      null,
      2,
    ),
    'src/App.tsx': app,
    'src/main.tsx': MAIN,
    'tsconfig.json': JSON.stringify(TSCONFIG, null, 2),
    'vite.config.js': VITE_CONFIG,
  }
}
