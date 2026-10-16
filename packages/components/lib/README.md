# Plume UI React

A lightweight design system for React. Components ship their own scoped styles and are themed entirely through CSS variables, so they adapt to your brand and switch between light and dark without runtime color math.

- **Themeable**: every design token is a CSS variable emitted by `<ThemeProvider>`.
- **Light & dark**: built in, driven by a single `colorMode`.
- **Framework-agnostic**: use the components as they are, or set `variant="unstyled"` and style them with Tailwind or Bootstrap.
- **Typed**: written in TypeScript, with React 18 and 19 support.

## Installation

```sh
npm install @plume-ui-react/lib
# or
pnpm add @plume-ui-react/lib
# or
yarn add @plume-ui-react/lib
```

This package includes every component and re-exports `@plume-ui-react/core` (`ThemeProvider`, `useTheme`, tokens and types), so it is the only one you need. `react` and `react-dom` are peer dependencies.

## Usage

Import the stylesheet once and wrap your app in `<ThemeProvider>`:

```tsx
import '@plume-ui-react/lib/styles.css'
import { Button, ThemeProvider } from '@plume-ui-react/lib'

export function App() {
  return (
    <ThemeProvider defaultColorMode="light">
      <Button colorScheme="primary" label="Click me" />
    </ThemeProvider>
  )
}
```

## Components

`Button`, `DatePicker`, `Input`, `Spinner` and `Tabs` (with `TabList`, `Tab`, `TabPanels` and `TabPanel`).

The [documentation site](https://darioegb.github.io/plume-ui-react/) has a live playground, props and examples for each one, plus the color palette, design tokens and framework integration guides.

## Links

- [Documentation](https://darioegb.github.io/plume-ui-react/)
- [GitHub repository](https://github.com/darioegb/plume-ui-react)
- [Changelog](https://github.com/darioegb/plume-ui-react/blob/main/packages/components/lib/CHANGELOG.md)
- [Report an issue](https://github.com/darioegb/plume-ui-react/issues)

## License

[MIT](https://github.com/darioegb/plume-ui-react/blob/main/LICENSE)
