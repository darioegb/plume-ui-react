// .storybook/theme.js
import { create } from '@storybook/theming/create'

export default create({
  base: 'light',
  // Typography
  fontBase: '"Open Sans", sans-serif',
  fontCode: 'monospace',
  // Color
  colorPrimary: '#27b868',
  colorSecondary: '#34d399',

  // UI
  appBg: '#ffffff',
  appContentBg: '#ffffff',
  appBorderRadius: 0,

  // Text colors
  textColor: '#102f1a',
  textInverseColor: '#ffffff',

  // Toolbar default and active colors
  barTextColor: '#9E9E9E',
  barSelectedColor: '#34d399',
  barBg: 'ffffff',

  // Form colors
  inputBg: '#ffffff',
  inputBorder: '#102f1a',
  inputTextColor: '#102f1a',
  inputBorderRadius: 2,
})
