// .storybook/manager.ts

import { addons } from 'storybook/manager-api'
import { GLOBALS_UPDATED, SET_GLOBALS, UPDATE_GLOBALS } from 'storybook/internal/core-events'
import { darkTheme, lightTheme } from './theme'

const isProd = process.env.NODE_ENV === 'prod'

const SUN_ICON = `<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/></svg>`
const MOON_ICON = `<svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor" aria-hidden="true"><path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z"/></svg>`

// Keeps the manager chrome in sync with the `colorMode` global and renders the
// color-mode toggle inside the custom header (so it stays visible even when the
// toolbar is hidden in the production build).
addons.register('plume/theme-sync', (api) => {
  const channel = api.getChannel()
  let colorMode: 'light' | 'dark' = 'light'

  const renderToggle = (): void => {
    const toggle = document.querySelector<HTMLButtonElement>('.plume-theme-toggle')
    if (!toggle) return
    toggle.innerHTML = colorMode === 'dark' ? SUN_ICON : MOON_ICON
    toggle.title = colorMode === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'
  }

  const injectToggle = (): void => {
    const links = document.querySelector('header .header-links')
    if (links && !links.querySelector('.plume-theme-toggle')) {
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
    // The hamburger lives in manager-head.html; wire it to the sidebar toggle.
    const navToggle = document.querySelector<HTMLButtonElement>('.plume-nav-toggle')
    if (navToggle && !navToggle.dataset.wired) {
      navToggle.dataset.wired = 'true'
      navToggle.addEventListener('click', () => api.toggleNav())
    }
  }

  const syncTheme = ({ globals }: { globals?: { colorMode?: string } }): void => {
    colorMode = globals?.colorMode === 'dark' ? 'dark' : 'light'
    api.setOptions({ theme: colorMode === 'dark' ? darkTheme : lightTheme })
    // Expose the mode on <html> so the custom header (manager-head.html) can theme itself.
    document.documentElement.setAttribute('data-plume-mode', colorMode)
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
