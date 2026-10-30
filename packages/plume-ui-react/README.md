# Plume UI React

A lightweight design system for React. Components ship their own scoped styles and are themed entirely through CSS variables, so they adapt to your brand and switch between light and dark without runtime color math.

- **Themeable**: every design token is a CSS variable. The stylesheet declares the defaults and `<ThemeProvider>` changes the ones your theme overrides.
- **Light & dark**: built in, set with `defaultColorMode` and switched with `setColorMode`.
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

To load only the CSS of some components, import `tokens.css` once and then the stylesheet of each component (each one brings the CSS of the components it renders):

```tsx
import 'plume-ui-react/tokens.css'
import 'plume-ui-react/css/button.css'
import 'plume-ui-react/css/input.css'
```

## Components

- [Accordion](https://darioegb.github.io/plume-ui-react/?path=/docs/components-accordion--docs)
- [Alert](https://darioegb.github.io/plume-ui-react/?path=/docs/components-alert--docs)
- [Avatar](https://darioegb.github.io/plume-ui-react/?path=/docs/components-avatar--docs)
- [Badge](https://darioegb.github.io/plume-ui-react/?path=/docs/components-badge--docs)
- [Breadcrumb](https://darioegb.github.io/plume-ui-react/?path=/docs/components-breadcrumb--docs)
- [Button](https://darioegb.github.io/plume-ui-react/?path=/docs/components-button--docs)
- [Card](https://darioegb.github.io/plume-ui-react/?path=/docs/components-card--docs)
- [Carousel](https://darioegb.github.io/plume-ui-react/?path=/docs/components-carousel--docs)
- [Checkbox](https://darioegb.github.io/plume-ui-react/?path=/docs/components-checkbox--docs)
- [Chip](https://darioegb.github.io/plume-ui-react/?path=/docs/components-chip--docs)
- [Collapse](https://darioegb.github.io/plume-ui-react/?path=/docs/components-collapse--docs)
- [DatePicker](https://darioegb.github.io/plume-ui-react/?path=/docs/components-datepicker--docs)
- [Divider](https://darioegb.github.io/plume-ui-react/?path=/docs/components-divider--docs)
- [Drawer](https://darioegb.github.io/plume-ui-react/?path=/docs/components-drawer--docs)
- [Dropdown](https://darioegb.github.io/plume-ui-react/?path=/docs/components-dropdown--docs)
- [EmptyState](https://darioegb.github.io/plume-ui-react/?path=/docs/components-emptystate--docs)
- [Field](https://darioegb.github.io/plume-ui-react/?path=/docs/components-field--docs)
- [FileUpload](https://darioegb.github.io/plume-ui-react/?path=/docs/components-fileupload--docs)
- [Heading](https://darioegb.github.io/plume-ui-react/?path=/docs/components-heading--docs)
- [Icon](https://darioegb.github.io/plume-ui-react/?path=/docs/components-icon--docs)
- [Input](https://darioegb.github.io/plume-ui-react/?path=/docs/components-input--docs)
- [List](https://darioegb.github.io/plume-ui-react/?path=/docs/components-list--docs)
- [Modal](https://darioegb.github.io/plume-ui-react/?path=/docs/components-modal--docs)
- [Navbar](https://darioegb.github.io/plume-ui-react/?path=/docs/components-navbar--docs)
- [NumberInput](https://darioegb.github.io/plume-ui-react/?path=/docs/components-numberinput--docs)
- [Paginator](https://darioegb.github.io/plume-ui-react/?path=/docs/components-paginator--docs)
- [PinInput](https://darioegb.github.io/plume-ui-react/?path=/docs/components-pininput--docs)
- [Popover](https://darioegb.github.io/plume-ui-react/?path=/docs/components-popover--docs)
- [ProgressBar](https://darioegb.github.io/plume-ui-react/?path=/docs/components-progressbar--docs)
- [Radio](https://darioegb.github.io/plume-ui-react/?path=/docs/components-radio--docs)
- [Rating](https://darioegb.github.io/plume-ui-react/?path=/docs/components-rating--docs)
- [Select](https://darioegb.github.io/plume-ui-react/?path=/docs/components-select--docs)
- [Sidebar](https://darioegb.github.io/plume-ui-react/?path=/docs/components-sidebar--docs)
- [Skeleton](https://darioegb.github.io/plume-ui-react/?path=/docs/components-skeleton--docs)
- [Slider](https://darioegb.github.io/plume-ui-react/?path=/docs/components-slider--docs)
- [Spinner](https://darioegb.github.io/plume-ui-react/?path=/docs/components-spinner--docs)
- [Stepper](https://darioegb.github.io/plume-ui-react/?path=/docs/components-stepper--docs)
- [Table](https://darioegb.github.io/plume-ui-react/?path=/docs/components-table--docs)
- [Tabs](https://darioegb.github.io/plume-ui-react/?path=/docs/components-tabs--docs)
- [Text](https://darioegb.github.io/plume-ui-react/?path=/docs/components-text--docs)
- [Textarea](https://darioegb.github.io/plume-ui-react/?path=/docs/components-textarea--docs)
- [TimePicker](https://darioegb.github.io/plume-ui-react/?path=/docs/components-timepicker--docs)
- [Toast](https://darioegb.github.io/plume-ui-react/?path=/docs/components-toast--docs)
- [Toggle](https://darioegb.github.io/plume-ui-react/?path=/docs/components-toggle--docs)
- [Tooltip](https://darioegb.github.io/plume-ui-react/?path=/docs/components-tooltip--docs)
- [Tree](https://darioegb.github.io/plume-ui-react/?path=/docs/components-tree--docs)

The [documentation site](https://darioegb.github.io/plume-ui-react/) has a live playground, props and examples for each one, plus the color palette, design tokens and framework integration guides.

## Links

- [Documentation](https://darioegb.github.io/plume-ui-react/)
- [GitHub repository](https://github.com/darioegb/plume-ui-react)
- [Changelog](https://github.com/darioegb/plume-ui-react/blob/main/packages/plume-ui-react/CHANGELOG.md)
- [Report an issue](https://github.com/darioegb/plume-ui-react/issues)

## License

[MIT](https://github.com/darioegb/plume-ui-react/blob/main/LICENSE)
