// .storybook/manager.ts

import { addons } from '@storybook/manager-api'
import theme from './theme'

const isProd = process.env.NODE_ENV === 'prod'

const config = {
  theme,
  ...(isProd && {
    enableShortcuts: false,
    showToolbar: false,
  }),
}

addons.setConfig(config)

// Adding custom styles for production build
if (isProd) {
  const styleSheet =
    document.styleSheets[0] ||
    document.head.appendChild(document.createElement('style')).sheet
  const cssRule = "div[role='main'] div:first-child { box-shadow: none; }"
  styleSheet.insertRule(cssRule, styleSheet.cssRules.length)
}

export default config
