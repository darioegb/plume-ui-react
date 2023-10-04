import type { Preview } from '@storybook/react'
import '@plume-ui-react/lib/dist/index.css'
import 'bootstrap/dist/css/bootstrap.min.css'

import '../globals.css'
import DocsTemplate from '../src/docs-template'

const preview: Preview = {
  parameters: {
    actions: { argTypesRegex: '^on[A-Z].*' },
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
}

export default preview
