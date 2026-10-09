// .storybook/manager.ts

import { addons } from 'storybook/manager-api'
import { GLOBALS_UPDATED, SET_GLOBALS, UPDATE_GLOBALS } from 'storybook/internal/core-events'
import { darkTheme, lightTheme } from './theme'

const isProd = process.env.NODE_ENV === 'prod'

const SUN = '☀'
const MOON = '☾'

// Keeps the manager chrome in sync with the `colorMode` global and renders the
// color-mode toggle inside the custom header (so it stays visible even when the
// toolbar is hidden in the production build).
addons.register('plume/theme-sync', (api) => {
  const channel = api.getChannel()
  let colorMode: 'light' | 'dark' = 'light'

  const renderToggle = (): void => {
    const toggle = document.querySelector<HTMLButtonElement>('.plume-theme-toggle')
    if (!toggle) return
    toggle.textContent = colorMode === 'dark' ? SUN : MOON
    toggle.title = colorMode === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'
  }

  const injectToggle = (): void => {
    const links = document.querySelector('header .header-links')
    if (!links || links.querySelector('.plume-theme-toggle')) return
    const button = document.createElement('button')
    button.type = 'button'
    button.className = 'plume-theme-toggle'
    button.setAttribute('aria-label', 'Toggle color mode')
    button.addEventListener('click', () => {
      channel.emit(UPDATE_GLOBALS, {
        globals: { colorMode: colorMode === 'dark' ? 'light' : 'dark' },
      })
    })
    links.insertBefore(button, links.firstChild)
    renderToggle()
  }

  const syncTheme = ({ globals }: { globals?: { colorMode?: string } }): void => {
    colorMode = globals?.colorMode === 'dark' ? 'dark' : 'light'
    api.setOptions({ theme: colorMode === 'dark' ? darkTheme : lightTheme })
    renderToggle()
  }
  channel.on(SET_GLOBALS, syncTheme)
  channel.on(GLOBALS_UPDATED, syncTheme)

  // The header is injected via manager-head.html; wait for it to mount.
  const observer = new MutationObserver(injectToggle)
  observer.observe(document.body, { childList: true, subtree: true })
  injectToggle()
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
