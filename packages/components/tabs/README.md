# `@plume-ui-react/tabs`

Accessible tabs with underline, rounded, enclosed, segment and unstyled variants, horizontal or vertical orientation, alignment and lazy panels.

> Most apps should install [`@plume-ui-react/lib`](https://www.npmjs.com/package/@plume-ui-react/lib), which includes every component and the theme. Use this package when you only need the Tabs.

## Installation

```sh
npm install @plume-ui-react/tabs @plume-ui-react/core
```

`react` and `react-dom` are peer dependencies.

## Usage

Import the stylesheet once and render the component inside `<ThemeProvider>`:

```tsx
import { Tab, TabList, TabPanel, TabPanels, Tabs } from '@plume-ui-react/tabs'
import { ThemeProvider } from '@plume-ui-react/core'
import '@plume-ui-react/tabs/styles.css'

export function App() {
  return (
    <ThemeProvider>
      <Tabs colorScheme="primary">
        <TabList>
          <Tab label="Account" />
          <Tab label="Billing" />
        </TabList>
        <TabPanels>
          <TabPanel>Account settings</TabPanel>
          <TabPanel>Billing details</TabPanel>
        </TabPanels>
      </Tabs>
    </ThemeProvider>
  )
}
```

Props, variants and live examples are in the [Tabs documentation](https://darioegb.github.io/plume-ui-react/?path=/docs/components-tabs--docs).

## License

[MIT](https://github.com/darioegb/plume-ui-react/blob/main/LICENSE)
