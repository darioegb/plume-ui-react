// .storybook/manager.ts

import { addons } from 'storybook/manager-api'
import { GLOBALS_UPDATED, SET_GLOBALS } from 'storybook/internal/core-events'
import { darkTheme, lightTheme } from './theme'
import { currentVersion, versions } from './versions'

const isProd = process.env.NODE_ENV === 'prod'

const SUN_ICON = `<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/></svg>`
const MOON_ICON = `<svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor" aria-hidden="true"><path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z"/></svg>`

const STORAGE_KEY = 'plume-colormode'
const COLOR_MODE_EVENT = 'plume/color-mode'

const getStoredMode = (): 'light' | 'dark' | null => {
  try {
    const value = localStorage.getItem(STORAGE_KEY)
    return value === 'dark' || value === 'light' ? value : null
  } catch {
    return null
  }
}

const setStoredMode = (mode: 'light' | 'dark'): void => {
  try {
    localStorage.setItem(STORAGE_KEY, mode)
  } catch {
    // ignore storage errors
  }
}

const prefersDark = (): boolean =>
  typeof window !== 'undefined' && window.matchMedia('(prefers-color-scheme: dark)').matches

// The toggle lives in the header so it stays visible when the production build hides the toolbar.
addons.register('plume/theme-sync', (api) => {
  const channel = api.getChannel()
  let colorMode: 'light' | 'dark' = getStoredMode() ?? (prefersDark() ? 'dark' : 'light')

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
        setMode(colorMode === 'dark' ? 'light' : 'dark')
      })
      links.insertBefore(button, links.firstChild)
      renderToggle()
    }
    const navToggle = document.querySelector<HTMLButtonElement>('.plume-nav-toggle')
    if (navToggle && !navToggle.dataset.wired) {
      navToggle.dataset.wired = 'true'
      navToggle.addEventListener('click', () => {
        // Below 600px Storybook swaps the sidebar for a drawer that toggleNav() doesn't control,
        // so delegate to its own bottom-bar button instead.
        const mobileMenu = document.querySelector<HTMLButtonElement>(
          'button[aria-label="Open navigation menu"]',
        )
        // Its bottom bar is hidden (see manager-head.html), so check the layout, not visibility.
        if (mobileMenu && window.matchMedia('(max-width: 599px)').matches) mobileMenu.click()
        else api.toggleNav()
      })
    }
    // The sidebar filters docs and tokens too, not only components.
    const search = document.querySelector<HTMLInputElement>('#storybook-explorer-searchfield')
    if (search && search.placeholder !== 'Search…') {
      search.placeholder = 'Search…'
      search.setAttribute('aria-label', 'Search')
    }
  }

  const injectVersion = (): void => {
    const start = document.querySelector('header .header-start')
    if (!start || start.querySelector('.plume-version')) return
    if (versions.length === 1) {
      const badge = document.createElement('span')
      badge.className = 'plume-version'
      badge.textContent = currentVersion.label
      badge.title = 'Version of the library these docs describe'
      start.append(badge)
      return
    }
    const menu = document.createElement('select')
    menu.className = 'plume-version'
    menu.setAttribute('aria-label', 'Documentation version')
    for (const version of versions) {
      const option = document.createElement('option')
      option.value = version.href
      option.textContent = version.label
      option.selected = version === currentVersion
      menu.append(option)
    }
    menu.addEventListener('change', () => {
      window.location.assign(menu.value)
    })
    start.append(menu)
  }

  const applyMode = (mode: 'light' | 'dark'): void => {
    colorMode = mode
    api.setOptions({ theme: mode === 'dark' ? darkTheme : lightTheme })
    document.documentElement.setAttribute('data-plume-mode', mode)
    renderToggle()
  }

  // The preview is told through the channel and not through the globals: a change of globals ends up
  // in the URL and reloads the preview, which sends the page back to the top.
  const setMode = (mode: 'light' | 'dark'): void => {
    setStoredMode(mode)
    applyMode(mode)
    channel.emit(COLOR_MODE_EVENT, mode)
  }

  const syncTheme = ({ globals }: { globals?: { colorMode?: string } }): void => {
    applyMode(globals?.colorMode === 'dark' ? 'dark' : 'light')
  }

  const applyPreferredMode = (): void => {
    const target = getStoredMode() ?? (prefersDark() ? 'dark' : 'light')
    if (target !== colorMode) {
      applyMode(target)
      channel.emit(COLOR_MODE_EVENT, target)
    }
  }

  let initialized = false
  channel.on(SET_GLOBALS, (payload: { globals?: { colorMode?: string } }) => {
    syncTheme(payload)
    if (!initialized) {
      initialized = true
      applyPreferredMode()
    }
  })
  channel.on(GLOBALS_UPDATED, syncTheme)

  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => {
    if (!getStoredMode()) applyPreferredMode()
  })

  // Opening the mobile drawer runs showModal(), which focuses its first focusable element: the
  // search field. That pops the on-screen keyboard and swaps the tree for "recently opened", so
  // move that initial focus to the dialog itself (Tab still reaches the search field).
  let openingMobileMenu = false
  document.addEventListener(
    'click',
    (event) => {
      const target = event.target as Element | null
      if (target?.closest('.plume-nav-toggle, button[aria-label="Open navigation menu"]')) {
        openingMobileMenu = true
        setTimeout(() => (openingMobileMenu = false), 500)
      }
    },
    true,
  )
  document.addEventListener('focusin', (event) => {
    const target = event.target as HTMLElement
    const drawer = target.closest<HTMLDialogElement>('#storybook-mobile-menu')
    if (!openingMobileMenu || !drawer || target.id !== 'storybook-explorer-searchfield') return
    openingMobileMenu = false
    drawer.tabIndex = -1
    drawer.focus()
  })

  const observer = new MutationObserver(() => {
    injectToggle()
    injectVersion()
  })
  observer.observe(document.body, { childList: true, subtree: true })
  injectToggle()
  injectVersion()
})

addons.setConfig({
  theme: (getStoredMode() ?? (prefersDark() ? 'dark' : 'light')) === 'dark' ? darkTheme : lightTheme,
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
