const storybook = require('eslint-plugin-storybook')
const react = require('./react')

module.exports = [...react, ...storybook.configs['flat/recommended']]
