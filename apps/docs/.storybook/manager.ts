// .storybook/manager.ts

import { addons } from 'storybook/manager-api'
import { GLOBALS_UPDATED, SET_GLOBALS } from 'storybook/internal/core-events'
import { darkTheme, lightTheme } from './theme'

const isProd = process.env.NODE_ENV === 'prod'

// Keep the manager chrome in sync with the `colorMode` global toggle so the
// whole Storybook (sidebar, toolbar, panels) themes together with the preview.
addons.register('plume/theme-sync', (api) => {
  const syncTheme = (colorMode?: string): void => {
    api.setOptions({ theme: colorMode === 'dark' ? darkTheme : lightTheme })
  }

  const onGlobals = ({ globals }: { globals?: { colorMode?: string } }): void => {
    syncTheme(globals?.colorMode)
  }

  const channel = api.getChannel()
  channel?.on(SET_GLOBALS, onGlobals)
  channel?.on(GLOBALS_UPDATED, onGlobals)
})

addons.setConfig({
  theme: lightTheme,
  ...(isProd && {
    enableShortcuts: false,
    showToolbar: false,
  }),
})

// Adding custom styles for production build
if (isProd) {
  const styleSheet =
    document.styleSheets[0] ||
    document.head.appendChild(document.createElement('style')).sheet
  const cssRule = "div[role='main'] div:first-child { box-shadow: none; }"
  styleSheet.insertRule(cssRule, styleSheet.cssRules.length)
}
