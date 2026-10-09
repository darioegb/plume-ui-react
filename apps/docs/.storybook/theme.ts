// .storybook/theme.js
import { create } from 'storybook/theming'

const shared = {
  fontBase: '"Open Sans", sans-serif',
  fontCode: 'monospace',
  colorSecondary: '#34d399',
  appBorderRadius: 8,
  inputBorderRadius: 4,
}

// Manager chrome themes that mirror Plume's light/dark semantic tokens.
export const lightTheme = create({
  ...shared,
  base: 'light',
  colorPrimary: '#5263ff',
  appBg: '#ffffff',
  appContentBg: '#ffffff',
  appPreviewBg: '#ffffff',
  appBorderColor: '#d4d4d8',
  textColor: '#18181b',
  textInverseColor: '#ffffff',
  barTextColor: '#71717a',
  barSelectedColor: '#5263ff',
  barBg: '#ffffff',
  inputBg: '#ffffff',
  inputBorder: '#d4d4d8',
  inputTextColor: '#18181b',
})

export const darkTheme = create({
  ...shared,
  base: 'dark',
  colorPrimary: '#738bff',
  appBg: '#18181b',
  appContentBg: '#27272a',
  appPreviewBg: '#18181b',
  appBorderColor: '#3f3f46',
  textColor: '#fafafa',
  textInverseColor: '#18181b',
  barTextColor: '#a1a1aa',
  barSelectedColor: '#738bff',
  barBg: '#18181b',
  inputBg: '#27272a',
  inputBorder: '#3f3f46',
  inputTextColor: '#fafafa',
})

export default lightTheme
