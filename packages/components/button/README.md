# `@plume-ui-react/button`

Buttons with solid, outline, link, ghost, icon and unstyled variants, sizes, color schemes, icons and a busy state.

> Most apps should install [`@plume-ui-react/lib`](https://www.npmjs.com/package/@plume-ui-react/lib), which includes every component and the theme. Use this package when you only need the Button.

## Installation

```sh
npm install @plume-ui-react/button @plume-ui-react/core
```

`react` and `react-dom` are peer dependencies.

## Usage

Import the stylesheet once and render the component inside `<ThemeProvider>`:

```tsx
import { Button } from '@plume-ui-react/button'
import { ThemeProvider } from '@plume-ui-react/core'
import '@plume-ui-react/button/styles.css'

export function App() {
  return (
    <ThemeProvider>
      <Button colorScheme="primary" label="Save" />
    </ThemeProvider>
  )
}
```

Props, variants and live examples are in the [Button documentation](https://darioegb.github.io/plume-ui-react/?path=/docs/components-button--docs).

## License

[MIT](https://github.com/darioegb/plume-ui-react/blob/main/LICENSE)
