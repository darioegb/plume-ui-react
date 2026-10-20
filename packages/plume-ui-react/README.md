# Plume UI React

A lightweight design system for React. Components ship their own scoped styles and are themed entirely through CSS variables, so they adapt to your brand and switch between light and dark without runtime color math.

- **Themeable**: every design token is a CSS variable emitted by `<ThemeProvider>`.
- **Light & dark**: built in, driven by a single `colorMode`.
- **Framework-agnostic**: use the components as they are, or set `variant="unstyled"` and style them with Tailwind or Bootstrap.
- **Typed**: written in TypeScript, with React 18 and 19 support.

## Installation

```sh
npm install plume-ui-react
# or
pnpm add plume-ui-react
# or
yarn add plume-ui-react
```

It includes every component, the theme (`ThemeProvider`, `useTheme`, tokens and types), the hooks and the utilities. `react` and `react-dom` (>= 18) are peer dependencies.

## Usage

Import the stylesheet once and wrap your app in `<ThemeProvider>`:

```tsx
import 'plume-ui-react/styles.css'
import { Button, ThemeProvider } from 'plume-ui-react'

export function App() {
  return (
    <ThemeProvider defaultColorMode="light">
      <Button colorScheme="primary" label="Click me" />
    </ThemeProvider>
  )
}
```

## Components

`Badge`, `Button`, `Card` (with `CardHeader`, `CardBody` and `CardFooter`), `Checkbox`, `DatePicker`, `Field`, `Icon`, `Input`, `List` (with `ListDivider`, `ListItem`, `ListItemButton`, `ListItemIcon`, `ListItemText` and `ListSubheader`), `Modal` (with `ModalBody`, `ModalClose`, `ModalContent`, `ModalFooter`, `ModalHeader` and `ModalTrigger`), `Radio`, `RadioGroup`, `Spinner`, `Tabs` (with `TabList`, `Tab`, `TabPanels` and `TabPanel`), `Textarea` and `Toggle`.

The [documentation site](https://darioegb.github.io/plume-ui-react/) has a live playground, props and examples for each one, plus the color palette, design tokens and framework integration guides.

## Links

- [Documentation](https://darioegb.github.io/plume-ui-react/)
- [GitHub repository](https://github.com/darioegb/plume-ui-react)
- [Changelog](https://github.com/darioegb/plume-ui-react/blob/main/packages/plume-ui-react/CHANGELOG.md)
- [Report an issue](https://github.com/darioegb/plume-ui-react/issues)

## License

[MIT](https://github.com/darioegb/plume-ui-react/blob/main/LICENSE)
