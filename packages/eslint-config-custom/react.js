const globals = require('globals')
const jsxA11y = require('eslint-plugin-jsx-a11y')
const react = require('eslint-plugin-react')
const reactHooks = require('eslint-plugin-react-hooks')
const base = require('./base')

module.exports = [
  ...base,
  react.configs.flat.recommended,
  react.configs.flat['jsx-runtime'],
  jsxA11y.flatConfigs.recommended,
  {
    files: ['**/*.{ts,tsx,js,jsx}'],
    plugins: { 'react-hooks': reactHooks },
    languageOptions: {
      globals: globals.browser,
    },
    settings: {
      react: { version: 'detect' },
    },
    rules: {
      'react-hooks/rules-of-hooks': 'error',
      'react-hooks/exhaustive-deps': 'warn',
      // Props are typed with TypeScript.
      'react/prop-types': 'off',
    },
  },
]
