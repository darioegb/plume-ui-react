import React from 'react'
import type { Preview } from '@storybook/react-vite'
import { DocsContainer } from '@storybook/addon-docs/blocks'
import { ThemeProvider } from '@plume-ui-react/core'
import '@plume-ui-react/lib/styles.css'
import 'bootstrap/dist/css/bootstrap.min.css'

import '../globals.css'
import DocsTemplate from '../src/docs-template'
import { darkTheme, lightTheme } from './theme'

// Themes the docs page chrome to match the `colorMode` toggle so docs pages
// follow the same light/dark mode as the rest of Storybook.
const PlumeDocsContainer = ({
  context,
  children,
}: {
  context: React.ComponentProps<typeof DocsContainer>['context']
  children: React.ReactNode
}): React.ReactElement => {
  const globals = (context as { store?: { userGlobals?: { globals?: Record<string, unknown> } } })
    .store?.userGlobals?.globals
  const colorMode = globals?.colorMode === 'dark' ? 'dark' : 'light'
  // Expose the mode on <html> so preview-head.html can theme Storybook's own
  // docs blocks (body, preview blocks, args table) that the theme prop misses.
  React.useEffect(() => {
    if (typeof document !== 'undefined') {
      document.documentElement.setAttribute('data-plume-color-mode', colorMode)
    }
  }, [colorMode])
  return (
    <DocsContainer context={context} theme={colorMode === 'dark' ? darkTheme : lightTheme}>
      {children}
    </DocsContainer>
  )
}

const preview: Preview = {
  parameters: {
    a11y: {
      // Stories render isolated fragments, not full pages, so the landmark
      // "region" rule reports false positives; the real app embeds components
      // inside its own landmarks.
      config: {
        rules: [{ id: 'region', enabled: false }],
      },
    },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/,
      },
      sort: 'requiredFirst',
    },
    docs: {
      container: PlumeDocsContainer,
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
    // Rendered as a toggle in the custom header (see manager.ts), not in the toolbar.
    colorMode: {
      description: 'Plume color mode',
      defaultValue: 'light',
    },
  },
  decorators: [
    (Story, context) => {
      const colorMode = (context.globals.colorMode as 'light' | 'dark') ?? 'light'
      return (
        <ThemeProvider
          key={colorMode}
          defaultColorMode={colorMode}
          style={{ padding: '2rem' }}
        >
          <Story />
        </ThemeProvider>
      )
    },
  ],
}

export default preview
