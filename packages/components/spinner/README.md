# `@plume-ui-react/spinner`

A loading indicator with sizes, color schemes, border styles, speed and thickness options.

> Most apps should install [`@plume-ui-react/lib`](https://www.npmjs.com/package/@plume-ui-react/lib), which includes every component and the theme. Use this package when you only need the Spinner.

## Installation

```sh
npm install @plume-ui-react/spinner @plume-ui-react/core
```

`react` and `react-dom` are peer dependencies.

## Usage

Import the stylesheet once and render the component inside `<ThemeProvider>`:

```tsx
import { Spinner } from '@plume-ui-react/spinner'
import { ThemeProvider } from '@plume-ui-react/core'
import '@plume-ui-react/spinner/styles.css'

export function App() {
  return (
    <ThemeProvider>
      <Spinner color="primary" size="lg" />
    </ThemeProvider>
  )
}
```

Props, variants and live examples are in the [Spinner documentation](https://darioegb.github.io/plume-ui-react/?path=/docs/components-spinner--docs).

## License

[MIT](https://github.com/darioegb/plume-ui-react/blob/main/LICENSE)
