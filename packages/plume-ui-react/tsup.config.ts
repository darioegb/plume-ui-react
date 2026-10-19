// tsup.config.ts
import { promises as fsPromises } from 'node:fs'
import path from 'node:path'
import { defineConfig, type Options } from 'tsup'
import postcss from 'postcss'
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

// Every module is its own ESM entry so index.mjs only re-exports and bundlers can drop unused components.
const moduleEntries = [
  'src/index.ts',
  'src/components/*/*/index.ts',
  'src/theme/index.ts',
  'src/hooks/use-*.tsx',
  'src/utils/*.ts',
  '!src/utils/index.ts',
]

async function emitStylesheet(): Promise<void> {
  const cssFiles = (await fsPromises.readdir('dist', { recursive: true })).filter((file) =>
    file.endsWith('.css'),
  )
  await fsPromises.rename('dist/index.css', 'dist/styles.css')
  await Promise.all(
    cssFiles
      .filter((file) => file !== 'index.css')
      .map((file) => fsPromises.rm(path.join('dist', file))),
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
      splitting: true,
      treeshake: true,
      dts: { entry: 'src/index.ts' },
      esbuildPlugins: [cssModulePlugin({ emitCss: true })],
      onSuccess: emitStylesheet,
    },
    {
      ...shared,
      entry: ['src/index.ts'],
      format: ['cjs'],
      dts: { entry: 'src/index.ts' },
      esbuildPlugins: [cssModulePlugin({ emitCss: false })],
    },
  ]
})
