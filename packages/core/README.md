# Plume UI React Core

The foundation of Plume UI: the theme tokens, the `<ThemeProvider>` and the shared types used by every component.

> Most apps should install `@plume-ui-react/lib`, which already includes and re-exports everything in this package. Install `@plume-ui-react/core` on its own only when you use individual component packages (e.g. `@plume-ui-react/button`).

## Installation

```sh
npm install @plume-ui-react/core
# Or
yarn add @plume-ui-react/core
# Or
pnpm add @plume-ui-react/core
```

`react` and `react-dom` (>= 16.11) are peer dependencies.

## Usage

Wrap your app in `<ThemeProvider>`. It serializes every design token to CSS variables (server-rendered, no per-request global state) and drives light/dark mode.

```tsx
import { ThemeProvider } from '@plume-ui-react/core'

export function App({ children }) {
  return (
    <ThemeProvider defaultColorMode="system" theme={{ colors: { primary: { 500: '#5263ff' } } }}>
      {children}
    </ThemeProvider>
  )
}
```

`theme` and `darkTheme` are deep-partials of the default theme, so you only override what you need. Read or switch the mode at runtime with `useTheme()`:

```tsx
import { useTheme } from '@plume-ui-react/core'

const { colorMode, setColorMode } = useTheme() // setColorMode('light' | 'dark' | 'system')
```

## Exports

- `ThemeProvider`, `useTheme`, `themeToCssVars`
- `defaultTheme`, `defaultDarkTheme`
- Types: `Theme`, `DeepPartial`, `ColorPalette`, `ShadeLevel`, `ComponentProps`, `Size`, `Shape`, `ColorScheme`, ...
