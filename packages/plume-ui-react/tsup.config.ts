// tsup.config.ts
import { promises as fsPromises } from 'node:fs'
import path from 'node:path'
import { transform } from 'esbuild'
import { defineConfig, type Options } from 'tsup'
import postcss from 'postcss'
import { buildCssUnits } from './scripts/component-css'
import { buildTokensCss } from './scripts/tokens-css'
import postcssModules from 'postcss-modules'

type Plugin = NonNullable<Options['esbuildPlugins']>[number]

function cssModulePlugin({ emitCss }: { emitCss: boolean }): Plugin {
  return {
    name: 'css-module',
    setup(build): void {
      build.onResolve({ filter: /\.module\.css$/, namespace: 'file' }, (args) => ({
        path: `${args.path}#css-module`,
        namespace: 'css-module',
        pluginData: {
          pathDir: path.join(args.resolveDir, args.path),
        },
      }))
      build.onLoad({ filter: /#css-module$/, namespace: 'css-module' }, async (args) => {
        const { pluginData } = args as {
          pluginData: { pathDir: string }
        }
        const source = await fsPromises.readFile(pluginData.pathDir, 'utf8')
        let cssModule = {}
        const result = await postcss([
          postcssModules({
            getJSON(_, json) {
              cssModule = json
            },
          }),
        ]).process(source, { from: pluginData.pathDir })
        const cssImport = emitCss ? `import "${pluginData.pathDir}"; ` : ''
        return {
          pluginData: { css: result.css },
          contents: `${cssImport}export default ${JSON.stringify(cssModule)}`,
        }
      })
      build.onResolve({ filter: /\.module\.css$/, namespace: 'css-module' }, (args) => ({
        path: path.join(args.resolveDir, args.path, '#css-module-data'),
        namespace: 'css-module',
        pluginData: args.pluginData as { css: string },
      }))
      build.onLoad({ filter: /#css-module-data$/, namespace: 'css-module' }, (args) => ({
        contents: (args.pluginData as { css: string }).css,
        loader: 'css',
      }))
    },
  }
}

function preserveModulesPlugin(): Plugin {
  return {
    name: 'preserve-modules',
    setup(build): void {
      build.onResolve({ filter: /^\.\.?\// }, async (args) => {
        if (args.kind === 'entry-point' || args.path.endsWith('.css') || args.pluginData) return undefined
        const resolved = await build.resolve(args.path, {
          kind: args.kind,
          resolveDir: args.resolveDir,
          pluginData: true,
        })
        if (resolved.errors.length > 0) return { errors: resolved.errors }
        const relative = path
          .relative(args.resolveDir, resolved.path)
          .replace(/\.tsx?$/, '.mjs')
          .split(path.sep)
          .join('/')
        return { path: relative.startsWith('.') ? relative : `./${relative}`, external: true }
      })
    },
  }
}

const moduleEntries = ['src/**/*.{ts,tsx}', '!src/**/tests/**', '!src/**/stories/**']

async function emitStylesheet(): Promise<void> {
  const css = await fsPromises.readFile('dist/index.css', 'utf8')
  const tokens = buildTokensCss()
  await fsPromises.writeFile('dist/tokens.css', `@layer base,plume,components,utilities;@layer plume{${tokens}}`)
  await fsPromises.writeFile(
    'dist/styles.css',
    `@layer base,plume,components,utilities;@layer plume{${tokens}${css}}`,
  )
  await fsPromises.rm('dist/index.css')
  await emitComponentStylesheets()
}

async function emitComponentStylesheets(): Promise<void> {
  const units = await buildCssUnits(path.resolve('src'))
  await fsPromises.mkdir('dist/css', { recursive: true })
  await Promise.all(
    Object.entries(units).map(async ([name, unit]) => {
      const { code } = await transform(unit.css, { loader: 'css', minify: true })
      const imports = ['../tokens.css', ...unit.imports.map((dep) => `./${dep}.css`)]
        .map((file) => `@import '${file}';`)
        .join('')
      await fsPromises.writeFile(
        `dist/css/${name}.css`,
        `@layer base,plume,components,utilities;${imports}@layer plume{${code}}`,
      )
    }),
  )
}

export default defineConfig((options) => {
  const shared: Options = {
    minify: !options.watch,
    target: 'es2020',
    tsconfig: 'tsconfig.json',
    external: ['react', 'react-dom'],
  }

  return [
    {
      ...shared,
      entry: moduleEntries,
      format: ['esm'],
      dts: { entry: 'src/index.ts' },
      esbuildPlugins: [cssModulePlugin({ emitCss: false }), preserveModulesPlugin()],
    },
    {
      ...shared,
      entry: ['src/index.ts'],
      format: ['cjs'],
      dts: { entry: 'src/index.ts' },
      esbuildPlugins: [cssModulePlugin({ emitCss: true })],
      onSuccess: emitStylesheet,
    },
  ]
})
