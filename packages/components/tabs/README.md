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

   ```javascript
   <Tabs
     tabList={[
       { label: 'Tab 1' },
       { label: 'Tab 2' },
       // Add more tabs as needed
     ]}
     panelList={[
       { content: <div>Tab 1 Content</div> },
       { content: <div>Tab 2 Content</div> },
       // Add more tab panels corresponding to the tabs
     ]}
   />
   ```

## Properties

This component accepts various properties to customize its appearance and behavior. Here are the available properties:

| Property       | Description                                                                                                                                                                       |
| -------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `activeTab`    | The index of the initially active tab. Defaults to `0`.                                                                                                                             |
| `alignment`    | The alignment of the tabs, can be 'left', 'center', or 'right'. Defaults to 'left'.                                                                                                |
| `colorScheme`  | The color scheme to be applied to the tabs. This can be a color from the default palette or a custom color palette key. Defaults to '#d3d3d3'.                                   |
| `isLazy`       | Determines whether the tab panels are lazily loaded. Defaults to `false`.                                                                                                         |
| `onTabChange`  | A callback function triggered when a tab is clicked. It receives the index of the clicked tab as an argument.                                                                     |
| `orientation`  | The orientation of the tabs, can be 'horizontal' or 'vertical'. Defaults to 'horizontal'.                                                                                        |
| `panelList`    | An array of objects representing the content of each tab panel. Each object should have a `content` property containing the ReactNode to be displayed in the corresponding tab panel. |
| `size`         | The size of the tabs, can be 'sm', 'md', or 'lg'. Defaults to 'md'.                                                                                                               |
| `tabList`      | An array of objects representing each tab. Each object should have a `label` property containing the text to be displayed on the tab.                                           |
| `variant`      | The visual style variant of the tabs, can be 'underline', 'rounded', 'enclosed', 'segment', or 'unstyled'. Defaults to 'underline'.                                              |

## Usage Examples

Here are some examples of how you can use this Tabs component in your project:

### Basic Horizontal Tabs

```javascript
<Tabs
  tabList={[
    { label: 'Tab 1' },
    { label: 'Tab 2' },
  ]}
  panelList={[
    { content: <div>Content for Tab 1</div> },
    { content: <div>Content for Tab 2</div> },
  ]}
/>
```

### Vertical Tabs

```javascript
<Tabs
  orientation="vertical"
  tabList={[
    { label: 'Tab 1' },
    { label: 'Tab 2' },
  ]}
  panelList={[
    { content: <div>Content for Tab 1</div> },
    { content: <div>Content for Tab 2</div> },
  ]}
/>
```

### Enclosed Style Tabs

```javascript
<Tabs
  variant="enclosed"
  tabList={[
    { label: 'Tab 1' },
    { label: 'Tab 2' },
  ]}
  panelList={[
    { content: <div>Content for Tab 1</div> },
    { content: <div>Content for Tab 2</div> },
  ]}
/>
```

### Lazy Loading Tabs

```javascript
<Tabs
  isLazy
  tabList={[
    { label: 'Tab 1' },
    { label: 'Tab 2' },
  ]}
  panelList={[
    { content: () => import('./Tab1Content') },
    { content: () => import('./Tab2Content') },
  ]}
/>
```
