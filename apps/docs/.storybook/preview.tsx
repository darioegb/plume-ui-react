import React from 'react'
import type { Preview } from '@storybook/react-vite'
import { DocsContainer } from '@storybook/addon-docs/blocks'
import { addons } from 'storybook/preview-api'
import { ThemeProvider, useTheme } from 'plume-ui-react'
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
  const colorMode = useToggledMode(globals?.colorMode === 'dark' ? 'dark' : 'light')
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

type ColorMode = 'light' | 'dark'

// The header toggle (see manager.ts) tells the preview through the channel instead of through the
// globals: a change of globals ends up in the URL and reloads the whole preview, which sends the page
// back to the top.
const COLOR_MODE_EVENT = 'plume/color-mode'
let toggledMode: ColorMode | null = null
const modeListeners = new Set<(mode: ColorMode) => void>()
addons.getChannel().on(COLOR_MODE_EVENT, (mode: ColorMode) => {
  toggledMode = mode
  modeListeners.forEach((listener) => listener(mode))
})

const useToggledMode = (fallback: ColorMode): ColorMode => {
  const [mode, setMode] = React.useState<ColorMode | null>(toggledMode)
  React.useEffect(() => {
    modeListeners.add(setMode)
    return () => {
      modeListeners.delete(setMode)
    }
  }, [])
  return mode ?? fallback
}

const preferredColorMode = (): ColorMode => {
  try {
    const stored = localStorage.getItem('plume-colormode')
    if (stored === 'dark' || stored === 'light') return stored
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
  } catch {
    return 'light'
  }
}

const docsColorMode = (): ColorMode | null => {
  try {
    if (window.parent === window || !window.parent.location.pathname.endsWith('iframe.html')) {
      return null
    }
    const mode = window.parent.document.documentElement.getAttribute('data-plume-color-mode')
    return mode === 'dark' || mode === 'light' ? mode : null
  } catch {
    return null
  }
}

// A story shown in an iframe of the docs page doesn't get the globals, so it follows the docs page.
const useColorMode = (globalMode: ColorMode): ColorMode => {
  const [docsMode, setDocsMode] = React.useState<ColorMode | null>(docsColorMode)
  React.useEffect(() => {
    if (!docsColorMode()) return undefined
    const sync = (): void => setDocsMode(docsColorMode())
    sync()
    const observer = new MutationObserver(sync)
    observer.observe(window.parent.document.documentElement, {
      attributeFilter: ['data-plume-color-mode'],
      attributes: true,
    })
    return () => observer.disconnect()
  }, [])
  return docsMode ?? globalMode
}

const storyLink = (event: MouseEvent): HTMLAnchorElement | null => {
  const link = event.target instanceof Element ? event.target.closest('a[href]') : null
  return link instanceof HTMLAnchorElement && link.closest('div[data-plume-color-mode]')
    ? link
    : null
}

// The links of an example must not leave the page: they would take the docs or the canvas to another URL.
const useBlockStoryLinks = (): void => {
  React.useEffect(() => {
    const block = (event: MouseEvent): void => {
      const link = storyLink(event)
      if (link && link.target !== '_blank') event.preventDefault()
    }
    document.addEventListener('click', block)
    return () => document.removeEventListener('click', block)
  }, [])
}

// ThemeProvider only reads its initial mode, so the mode follows the toolbar through setColorMode: a
// `key` would remount every story and the page would lose its height and its scroll position.
const SyncColorMode = ({ colorMode }: { colorMode: ColorMode }): null => {
  const { setColorMode } = useTheme()
  React.useEffect(() => setColorMode(colorMode), [colorMode, setColorMode])
  return null
}

const StoryFrame = ({
  children,
  globalMode,
}: {
  children: React.ReactNode
  globalMode: ColorMode
}): React.ReactElement => {
  const colorMode = useColorMode(useToggledMode(globalMode))
  useBlockStoryLinks()
  React.useEffect(() => {
    document.documentElement.setAttribute('data-plume-color-mode', colorMode)
    document.documentElement.setAttribute('data-bs-theme', colorMode)
  }, [colorMode])
  return (
    <ThemeProvider defaultColorMode={colorMode} style={{ padding: 'clamp(0.5rem, 4vw, 2rem)' }}>
      <SyncColorMode colorMode={colorMode} />
      {/* Bootstrap 5.3 only themes itself through data-bs-theme. */}
      <div data-bs-theme={colorMode}>{children}</div>
    </ThemeProvider>
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
          ['Framework Integration', 'Customizing Styles', 'Internationalization', 'Upgrading to 1.0'],
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
  initialGlobals: { colorMode: preferredColorMode() },
  globalTypes: {
    // Rendered as a toggle in the custom header (see manager.ts), not in the toolbar.
    colorMode: {
      description: 'Plume color mode',
    },
  },
  decorators: [
    (Story, context) => (
      <StoryFrame globalMode={(context.globals.colorMode as ColorMode) ?? 'light'}>
        <Story />
      </StoryFrame>
    ),
  ],
}

export default preview
