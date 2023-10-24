// tsup.config.ts
import { defineConfig } from 'tsup'
import { cssModule } from 'esbuild-css-modules'

export default defineConfig((options) => ({
  entry: ['src/index.ts'],
  dts: true,
  treeshake: true,
  splitting: true,
  clean: true,
  minify: !options.watch,
  format: ['cjs', 'esm'],
  target: 'es2020',
  tsconfig: 'tsconfig.json',
  external: ['react'],
  esbuildPlugins: [
    cssModule
  ],
}))
