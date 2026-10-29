const path = require('node:path')

const COMPONENTS = path.resolve(__dirname, '../../packages/plume-ui-react/src') + path.sep

// The stories import the source of the components, whose styles the build of the library puts in the layer
// `plume`. Do the same here, or those rules would have no layer and beat every utility of Tailwind.
const plumeLayer = {
  postcssPlugin: 'plume-layer',
  Once(root, { AtRule, result }) {
    const from = result.opts.from ?? ''
    if (!from.startsWith(COMPONENTS) || !from.endsWith('.module.css')) return
    const layer = new AtRule({ name: 'layer', params: 'plume' })
    const nodes = root.nodes.slice()
    root.removeAll()
    layer.append(nodes)
    root.append(layer)
  },
}

module.exports = {
  plugins: [plumeLayer, require('@tailwindcss/postcss')],
}
