import React from 'react'
import type { Preview } from '@storybook/react-vite'
import { DocsContainer } from '@storybook/addon-docs/blocks'
import { ThemeProvider } from 'plume-ui-react'
import 'plume-ui-react/styles.css'
import 'bootstrap/dist/css/bootstrap.min.css'

import '../globals.css'
import DocsTemplate from '../src/docs-template'
import Footer from '../src/footer'
import { darkTheme, lightTheme } from './theme'

// Mirrors the colorMode toggle onto docs pages.
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
  // preview-head.html themes the docs blocks the `theme` prop misses, keyed on this attribute.
  React.useEffect(() => {
    if (typeof document !== 'undefined') {
      document.documentElement.setAttribute('data-plume-color-mode', colorMode)
    }
  }, [colorMode])
  return (
    <DocsContainer context={context} theme={colorMode === 'dark' ? darkTheme : lightTheme}>
      {children}
      <Footer />
    </DocsContainer>
  )
}

const preview: Preview = {
  parameters: {
    a11y: {
      // Stories are isolated fragments, so the page-level "region" rule is a false positive.
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
    options: {
      storySort: {
        method: 'alphabetical',
        order: [
          'Introduction',
          'Theme',
          ['Colors', 'Tokens'],
          'Guides',
          ['Framework Integration', 'Migration'],
          'Components',
        ],
      },
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
          style={{ padding: 'clamp(0.5rem, 4vw, 2rem)' }}
        >
          {/* Bootstrap 5.3 only themes itself through data-bs-theme. */}
          <div data-bs-theme={colorMode}>
            <Story />
          </div>
        </ThemeProvider>
      )
    },
  ],
}

export default preview
