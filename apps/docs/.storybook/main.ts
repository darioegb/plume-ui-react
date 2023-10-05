import type { StorybookConfig } from '@storybook/react-vite'

const config: StorybookConfig = {
  stories: [
    '../stories/**/*.mdx',
    '../../../packages/**/stories/*.stories.@(js|jsx|mjs|ts|tsx|mdx)',
  ],
  addons: [
    '@storybook/addon-links',
    '@storybook/addon-essentials',
    '@storybook/addon-interactions',
    '@storybook/addon-a11y',
    '@storybook/addon-styling',
    {
      name: '@storybook/preset-scss',
      options: {
        cssLoaderOptions: {
          modules: true,
          localIdentName: '[name]__[local]--[hash:base64:5]',
        },
      },
    },
  ],
  docs: {
    autodocs: 'tag',
  },
  framework: {
    name: '@storybook/react-vite',
    options: {},
  },
  core: {},
  async viteFinal(config) {
    return {
      ...config,
      define: { 'process.env': {} },
    }
  },
}

export default config
