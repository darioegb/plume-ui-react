# Tabs

The Tabs component is a versatile and customizable component for creating tabbed interfaces in your React applications.

## Installation

To use this component in your React project, follow these steps:

1. Install the package using npm or yarn:

   ```bash
   npm install @plume-ui-react/tabs
   # Or
   yarn add @plume-ui-react/tabs
   ```

2. Import the component in your JavaScript or TypeScript file:

   ```javascript
   import { Tabs } from '@plume-ui-react/tabs'
   ```

3. Use the component in your application:

   ```html
   <Tabs>
     <TabList>
       <Tab label="Tab 1" />
       <Tab label="Tab 2" />
       <!-- Add more tabs as needed -->
     </TabList>
     <TabPanels>
       <TabPanel>Content for Tab 1</TabPanel>
       <TabPanel>Content for Tab 2</TabPanel>
       <!-- Add more tab panels corresponding to the tabs -->
     </TabPanels>
   </Tabs>
   ```

## Properties

### Tabs

This component accepts various properties to customize its appearance and behavior. Here are the available properties of the parent component:

| Property      | Type                                                                | Description                                                                                                                                    |
| ------------- | ------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------- |
| `alignment`   | `TabsAlignment`                                                     | The alignment of the tabs, can be 'left', 'center', or 'right'. Defaults to 'left'.                                                            |
| `className`   | `string`                                                            | Additional CSS classes for the tabs.                                                                                                           |
| `colorScheme` | `ColorPalette \| keyof CustomColorPalette`                   | The color scheme to be applied to the tabs. This can be a color from the default palette or a custom color palette key. Defaults to '#d3d3d3'. |
| `index`       | `number`                                                            | The index of the initially active tab. Defaults to `0`.                                                                                        |
| `isLazy`      | `boolean`                                                           | Determines whether the tab panels are lazily loaded. Defaults to `false`.                                                                      |
| `onChange`    | `(index: number) => void`                                           | A callback function triggered when a tab is clicked. It receives the index of the clicked tab as an argument.                                  |
| `orientation` | `TabsOrientation`                                                   | The orientation of the tabs, can be 'horizontal' or 'vertical'. Defaults to 'horizontal'.                                                      |
| `size`        | `Size`                                                              | The size of the tabs, can be 'sm', 'md', or 'lg'. Defaults to 'md'.                                                                            |
| `style`       | `CSSProperties`                                                     | Custom styles for the tabs.                                                                                                                    |
| `variant`     | `'underline' \| 'rounded' \| 'enclosed' \| 'segment' \| 'unstyled'` | The visual style variant of the tabs, can be 'underline', 'rounded', 'enclosed', 'segment', or 'unstyled'. Defaults to 'underline'.            |

### Tab

| Property            | Type        | Description                                |
| ------------------- | ----------- | ------------------------------------------ |
| `className`         | `string`    | Additional CSS classes for custom styling. |
| `disabled`          | `boolean`   | Indicates if the tab is disabled.          |
| `extraContentLeft`  | `ReactNode` | Additional left content of the tab.        |
| `extraContentRight` | `ReactNode` | Additional right content of the tab.       |
| `index`             | `number`    | Index of the tab in the set of tabs.       |
| `isActive`          | `boolean`   | Indicates if the tab is active.            |
| `label`             | `string`    | Text of the tab label.                     |

## Usage Examples

Here are some examples of how you can use this Tabs component in your project:

### Basic Horizontal Tabs

```html
<Tabs>
  <TabList>
    <Tab label="Tab 1" />
    <Tab label="Tab 2" />
  </TabList>
  <TabPanels>
    <TabPanel>Content for Tab 1</TabPanel>
    <TabPanel>Content for Tab 2</TabPanel>
  </TabPanels>
</Tabs>
```

### Vertical Tabs

```html
<Tabs orientation="vertical">
  <TabList>
    <Tab label="Tab 1" />
    <Tab label="Tab 2" />
  </TabList>
  <TabPanels>
    <TabPanel>Content for Tab 1</TabPanel>
    <TabPanel>Content for Tab 2</TabPanel>
  </TabPanels>
</Tabs>
```

### Enclosed Style Tabs

```html
<Tabs variant="enclosed">
  <TabList>
    <Tab label="Tab 1" />
    <Tab label="Tab 2" />
  </TabList>
  <TabPanels>
    <TabPanel>Content for Tab 1</TabPanel>
    <TabPanel>Content for Tab 2</TabPanel>
  </TabPanels>
</Tabs>
```

### Lazy Loading Tabs

```html
<Tabs isLazy>
  <TabList>
    <Tab label="Tab 1" />
    <Tab label="Tab 2" />
  </TabList>
  <TabPanels>
    <TabPanel>
      <LazyLoadedContent1 />
    </TabPanel>
    <TabPanel>
      <LazyLoadedContent2 />
    </TabPanel>
  </TabPanels>
</Tabs>
```

> The Tabs component is a versatile solution for creating tabbed interfaces in React applications. It provides a flexible and customizable way to organize and present content in tabbed format, enhancing user experience and navigation.
