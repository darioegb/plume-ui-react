# `@plume-ui-react/input`

A text input with variants, sizes, shapes, color schemes, addons, inline elements, validation states and an input mask.

> Most apps should install [`@plume-ui-react/lib`](https://www.npmjs.com/package/@plume-ui-react/lib), which includes every component and the theme. Use this package when you only need the Input.

## Installation

```sh
npm install @plume-ui-react/input @plume-ui-react/core
```

`react` and `react-dom` are peer dependencies.

## Usage

Import the stylesheet once and render the component inside `<ThemeProvider>`:

```tsx
import { Input } from '@plume-ui-react/input'
import { ThemeProvider } from '@plume-ui-react/core'
import '@plume-ui-react/input/styles.css'

export function App() {
  return (
    <ThemeProvider>
      <Input addonBefore="https://" placeholder="your-site" />
      <Input mask="##/##/####" placeholder="dd/mm/yyyy" />
    </ThemeProvider>
  )
}
```

Props, variants and live examples are in the [Input documentation](https://darioegb.github.io/plume-ui-react/?path=/docs/components-input--docs).

## License

[MIT](https://github.com/darioegb/plume-ui-react/blob/main/LICENSE)
