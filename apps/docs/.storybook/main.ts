import { fileURLToPath } from 'node:url'
import type { StorybookConfig } from '@storybook/react-vite'

const config: StorybookConfig = {
  stories: [
    '../stories/**/*.mdx',
    '../stories/**/*.stories.@(js|jsx|mjs|ts|tsx)',
    '../../../packages/plume-ui-react/src/components/**/stories/*.stories.@(js|jsx|mjs|ts|tsx|mdx)',
  ],
  staticDirs: ['../public'],
  addons: [
    '@storybook/addon-links',
    '@storybook/addon-a11y',
    '@storybook/addon-docs',
    '@storybook/addon-themes',
  ],
  framework: {
    name: '@storybook/react-vite',
    options: {},
  },
  async viteFinal(config) {
    return {
      ...config,
      define: { 'process.env': {} },
      resolve: {
        ...config.resolve,
        alias: [
          ...Object.entries(config.resolve?.alias ?? {}).map(([find, replacement]) =>
            Array.isArray(config.resolve?.alias) ? (replacement as never) : { find, replacement },
          ),
          {
            find: /^plume-ui-react$/,
            replacement: fileURLToPath(
              new URL('../../../packages/plume-ui-react/src/index.ts', import.meta.url),
            ),
          },
        ],
      },
      build: {
        ...config.build,
        rollupOptions: {
          ...config.build?.rollupOptions,
          onwarn(warning, warn) {
            const isDirective = warning.code === 'MODULE_LEVEL_DIRECTIVE'
            const isDirectiveSourcemap =
              warning.code === 'SOURCEMAP_ERROR' && warning.message.includes('(1:0)')
            if (!isDirective && !isDirectiveSourcemap) warn(warning)
          },
        },
      },
    }
  },
}

export default config
