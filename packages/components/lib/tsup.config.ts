// tsup.config.ts
import { defineConfig } from 'tsup'

export default defineConfig((options) => ({
  entry: ['src/index.ts'],
  dts: true,
  sourcemap: false,
  clean: true,
  minify: !options.watch,
  format: ['cjs', 'esm'],
  target: 'es2020',
  tsconfig: 'tsconfig.json',
  external: ['react'],
}))
