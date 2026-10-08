import React from 'react'
import type { Preview } from '@storybook/react-vite'
import { ThemeProvider } from '@plume-ui-react/core'
import '@plume-ui-react/lib/dist/index.css'
import 'bootstrap/dist/css/bootstrap.min.css'

import '../globals.css'
import DocsTemplate from '../src/docs-template'

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/,
      },
      sort: 'requiredFirst',
    },
    docs: {
      page: () => DocsTemplate(),
      controls: {
        sort: 'requiredFirst',
      },
      source: {
        language: 'tsx',
      },
    },
  },
  globalTypes: {
    colorMode: {
      description: 'Plume color mode',
      defaultValue: 'light',
      toolbar: {
        title: 'Color mode',
        icon: 'contrast',
        items: [
          { value: 'light', title: 'Light', icon: 'sun' },
          { value: 'dark', title: 'Dark', icon: 'moon' },
        ],
        dynamicTitle: true,
      },
    },
  },
  decorators: [
    (Story, context) => {
      const colorMode = (context.globals.colorMode as 'light' | 'dark') ?? 'light'
      return (
        <ThemeProvider
          key={colorMode}
          defaultColorMode={colorMode}
          style={{ padding: '2rem', minHeight: '100vh' }}
        >
          <Story />
        </ThemeProvider>
      )
    },
  ],
}

export default preview
