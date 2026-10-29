import * as plume from 'plume-ui-react'
import sandbox from './stackblitz-sandbox.generated.json'

export type SandboxFiles = Record<string, string>

const REACT_HOOKS = ['useCallback', 'useEffect', 'useId', 'useMemo', 'useRef', 'useState']
const FORM_LIBRARY = ['Controller', 'useForm']
const PLUME_NAMES = new Set(Object.keys(plume))

const WRAPPER_NAMES = ['App', 'Example', 'Story', 'Demo']

const TOAST_APP = (name: string): string => `const ${name} = () => {
  const toast = useToast()
  return (
    <Button
      label="Show toast"
      onClick={() => toast.success({ title: 'Saved', description: 'Your changes were saved.' })}
    />
  )
}`

const STUBS: [RegExp, (name: string, code: string) => string][] = [
  [/^App$/, (name, code) => (/\bToastProvider\b/.test(code) ? TOAST_APP(name) : `const ${name} = () => <p>Your app goes here.</p>`)],
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

const SIBLINGS_ROW = '<div style={{ alignItems: "center", display: "flex", flexWrap: "wrap", gap: "1rem" }}>'

const rootOf = (jsx: string): [string, string] =>
  (jsx.match(/^<[A-Za-z]/gm) ?? []).length > 1 ? [SIBLINGS_ROW, '</div>'] : ['<>', '</>']

function wrap(code: string, name: string): string {
  if (/^\{/.test(code) && /\brender\s*:/.test(code)) {
    return `const storyDefinition = ${code}\n\nexport default function ${name}() {\n  return storyDefinition.render(storyDefinition.args ?? {})\n}\n`
  }
  if (/^return\b/m.test(code)) return `export default function ${name}() {\n${code}\n}\n`
  const statements = /^\s*(function|const|let|class)\b/.test(code)
  if (!statements) {
    const [open, close] = rootOf(code)
    return `export default function ${name}() {\n  return (\n${open}\n${code}\n${close}\n  )\n}\n`
  }
  const jsx = code.search(/^<[A-Za-z]/m)
  if (jsx < 0) {
    const component = renderedComponent(code)
    return component
      ? `${code}\nexport default function ${name}() {\n  return <${component} />\n}\n`
      : `${code}\nexport default function ${name}() {\n  return null\n}\n`
  }
  const [open, close] = rootOf(code.slice(jsx))
  return `export default function ${name}() {\n${code.slice(0, jsx)}\n  return (\n${open}\n${code.slice(jsx)}\n${close}\n  )\n}\n`
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

const FILE_MARKER = /^\/\/ [\w.-]+\.\w+$/m

const snippetFiles = (code: string): string[] =>
  FILE_MARKER.test(code.trim().split('\n')[0] ?? '') ? code.split(/^(?=\/\/ [\w.-]+\.\w+$)/m) : []

function componentFile(code: string): string {
  const source = snippetFiles(code)
    .filter((file) => /^\/\/ [\w.-]+\.(tsx|jsx)\b/.test(file))
    .pop()
  return source ? source.replace(/^\/\/ .*\n/, '') : code
}

const stylesOf = (code: string): string =>
  snippetFiles(code)
    .filter((file) => /^\/\/ [\w.-]+\.css\b/.test(file))
    .map((file) => file.replace(/^\/\/ .*\n/, '').trim())
    .join('\n\n')

export function buildApp(original: string, locals: Locals = {}): string {
  const code = componentFile(original)
  const extra = collectLocals(code, locals)
  const all = [code, ...extra].join('\n')
  const used = words(all)
  const wrapperName = WRAPPER_NAMES.find((name) => !used.includes(name)) ?? 'PlumeStoryExample'
  const hooks = REACT_HOOKS.filter((hook) => used.includes(hook))
  const form = FORM_LIBRARY.filter((name) => used.includes(name) && !declares(all, name))
  const stubs = used.flatMap((name) => {
    if (declares(all, name) || PLUME_NAMES.has(name)) return []
    if (!/Icon$/.test(name) && !referenced(code, name)) return []
    const stub = STUBS.find(([pattern]) => pattern.test(name))
    return stub ? [stub[1](name, code)] : []
  })
  const plumeNames = words([all, ...stubs].join('\n')).filter((word) => PLUME_NAMES.has(word) && !declares(all, word))
  const reactImport = used.includes('React') && !declares(all, 'React') ? 'React' : ''
  const reactNames = [reactImport, hooks.length ? `{ ${hooks.join(', ')} }` : ''].filter(Boolean)
  const header = [
    reactNames.length ? `import ${reactNames.join(', ')} from 'react'` : '',
    plumeNames.length ? `import { ${plumeNames.join(', ')} } from 'plume-ui-react'` : '',
    form.length ? `import { ${form.join(', ')} } from 'react-hook-form'` : '',
    ...stubs,
    ...extra,
  ].filter(Boolean)
  return `${header.join('\n')}\n\n${wrap(code.trim(), wrapperName)}`
}

const CLASS_VALUE = /class(?:Name)?\s*[=:]\s*(?:\{\s*)?(?:"([^"]*)"|'([^']*)'|`([^`]*)`)/g

const BOOTSTRAP_TOKEN =
  /^(btn(-[\w-]+)?|form-[\w-]+|d-(flex|block|none|inline|grid)[\w-]*|align-items-\w+|justify-content-\w+|(ms|me)-\d|fw-\w+|text-(body|bg)[\w-]*|list-group[\w-]*|card(-\w+)?|badge|bg-\w+-subtle|input-group[\w-]*|nav(bar)?(-[\w-]+)?|dropdown-[\w-]+|modal-[\w-]+|toast(-[\w-]+)?|alert-[\w-]+|progress(-bar)?|table-[\w-]+|container(-fluid)?|row|col(-\w+)*|border-\w+-subtle|rounded-pill|position-(fixed|absolute|relative)|(start|end|top|bottom)-\d+|translate-middle|visually-hidden|flex-grow-1|show)$/

const TAILWIND_TOKEN =
  /^(?:[a-z-]+:)*-?(flex|grid|block|inline|inline-flex|inline-block|hidden|contents|gap|space-[xy]|items|justify|self|place|p[xytblr]?|m[xytblr]?|w|h|size|min-[wh]|max-[wh]|text|font|leading|tracking|bg|border|rounded|shadow|ring|opacity|transition|duration|overflow|relative|absolute|fixed|sticky|inset|top|left|right|bottom|z|cursor|truncate|sr-only|underline|uppercase|lowercase|capitalize|italic|grow|shrink|basis|col-span|row-span|order|divide|object|aspect|animate|scale|rotate|translate|whitespace|break|list|align)(-[\w./[\]#%]+)*$/

type ColorMode = 'light' | 'dark'

const classTokens = (code: string): string[] =>
  Array.from(code.matchAll(CLASS_VALUE)).flatMap((match) =>
    (match[1] ?? match[2] ?? match[3] ?? '').split(/\s+/).filter(Boolean),
  )

const stylesheetOf = (code: string, name: string): 'bootstrap' | 'tailwind' | null => {
  if (/--bootstrap$/.test(name)) return 'bootstrap'
  if (/--tailwind$/.test(name)) return 'tailwind'
  if (/@apply\b/.test(stylesOf(code))) return 'tailwind'
  const tokens = classTokens(code)
  if (tokens.some((token) => BOOTSTRAP_TOKEN.test(token))) return 'bootstrap'
  return tokens.some((token) => TAILWIND_TOKEN.test(token)) ? 'tailwind' : null
}

const TAILWIND_CDN = 'https://cdn.tailwindcss.com/3.4.17'
const BOOTSTRAP_CSS = 'https://cdn.jsdelivr.net/npm/bootstrap@5/dist/css/bootstrap.min.css'

const mainFor = (colorMode: ColorMode): string => `import { Component, StrictMode } from 'react'
import type { ErrorInfo, ReactNode } from 'react'
import { createRoot } from 'react-dom/client'
import { ThemeProvider, ToastProvider } from 'plume-ui-react'
import './index.css'
import 'plume-ui-react/styles.css'
import App from './App'
import { theme } from './theme'

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
    <ThemeProvider
      defaultColorMode="${colorMode}"
      style={{ minHeight: '100vh', padding: '1.5rem', boxSizing: 'border-box' }}
      theme={theme}
    >
      <ToastProvider>
        <Boundary>
          <App />
        </Boundary>
      </ToastProvider>
    </ThemeProvider>
  </StrictMode>,
)
`

const indexHtml = (stylesheet: 'bootstrap' | 'tailwind' | null, colorMode: ColorMode, styles: string): string => {
  const tailwind =
    stylesheet === 'tailwind'
      ? `    <script src="${TAILWIND_CDN}"></script>
    <script>
      tailwind.config = ${JSON.stringify({ ...sandbox.tailwind, corePlugins: { preflight: false } })}
    </script>
${styles ? `    <style type="text/tailwindcss">\n${styles}\n    </style>\n` : ''}`
      : ''
  return `<!doctype html>
<html lang="en"${stylesheet === 'bootstrap' ? ` data-bs-theme="${colorMode}"` : ''}>
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Plume UI React</title>
${tailwind}  </head>
  <body style="margin: 0">
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
`
}

const indexCss = (stylesheet: 'bootstrap' | 'tailwind' | null, styles: string): string =>
  `@layer reset, base, plume, components, utilities;\n${
    stylesheet ? "@import './reset.css' layer(reset);\n" : ''
  }${stylesheet === 'bootstrap' ? `@import url('${BOOTSTRAP_CSS}');\n` : ''}${styles ? `\n${styles}\n` : ''}`

const themeFile = (): string => `import type { DeepPartial, Theme } from 'plume-ui-react'

export const theme: DeepPartial<Theme> = {
  colors: {
    primary: ${JSON.stringify(plume.defaultTheme.colors.primary, null, 2).replace(/\n/g, '\n    ')},
  },
}
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

export function buildSandbox(
  code: string,
  name: string,
  locals: Locals = {},
  colorMode: ColorMode = 'light',
): SandboxFiles {
  const app = buildApp(code, locals)
  const form = /from 'react-hook-form'/.test(app)
  const stylesheet = stylesheetOf(code, name)
  const styles = stylesOf(code)
  const tailwindStyles = stylesheet === 'tailwind' ? styles : ''
  return {
    ...(stylesheet ? { 'src/reset.css': sandbox.reset } : {}),
    '.stackblitzrc': JSON.stringify({ installDependencies: true, startCommand: 'npm run dev' }),
    'index.html': indexHtml(stylesheet, colorMode, tailwindStyles),
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
    'src/index.css': indexCss(stylesheet, stylesheet === 'tailwind' ? '' : styles),
    'src/main.tsx': mainFor(colorMode),
    'src/theme.ts': themeFile(),
    'tsconfig.json': JSON.stringify(TSCONFIG, null, 2),
    'vite.config.js': VITE_CONFIG,
  }
}
