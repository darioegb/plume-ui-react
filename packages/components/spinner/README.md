# Spinner

This is a custom React spinner component that allows you to create spinners with various styles and options. You can use this spinner in your React web applications to indicate loading or processing.

## Installation

To use this component in your React project, follow these steps:

1. Install the package using npm or yarn:

   ```sh
   npm install @plume-ui-react/spinner
   # Or
   yarn add @plume-ui-react/spinner
   ```

2. Import the stylesheet into your root component file:

   ```javascript
   import '@plume-ui-react/spinner/dist/index.css'
   ```

3. Import the component in your JavaScript or TypeScript file:

   ```javascript
   import { Spinner } from '@plume-ui-react/spinner'
   ```

4. Use the component in your application:

   ```html
   <Spinner />
   ```

## Properties

This component accepts several properties to customize the appearance and behavior of the spinner. Here are the available properties sorted alphabetically:

| Property      | Type                                                        | Description                                                                             |
| ------------- | ----------------------------------------------------------- | --------------------------------------------------------------------------------------- |
| `className`   | `string`                                                    | Additional CSS classes for the spinner.                                                 |
| `colorScheme` | `DefaultColorPalette \| keyof CustomColorPalette`           | The color scheme to be applied to the spinner.                                          |
| `hidden`      | `boolean`                                                   | Indicates whether the spinner should be hidden.                                         |
| `id`          | `string`                                                    | The unique identifier for the spinner element.                                          |
| `size`        | `Size`                                                      | The size of the spinner.                                                                |
| `speed`       | `string`                                                    | The animation speed of the spinner.                                                     |
| `style`       | `CSSProperties`                                             | Custom styles for the spinner.                                                          |
| `thickness`   | `number`                                                    | The thickness of the spinner's border.                                                  |
| `variant`     | `'solid' \| 'dashed' \| 'dotted' \| 'double' \| 'unstyled'` | The spinner variant, which can be "solid", "dashed", "dotted", "double", or "unstyled". |

## Usage Examples

Here are some examples of how you can use this spinner component in your project:

### Default Spinner

```html
<Spinner />
```

### Large Spinner with Custom Border Color

```html
<Spinner size={2} borderColor="#FF5733" />
```

### Spinner with empty area

```html
<Spinner
  style={{
    borderColor: '#f6eeee',
    borderTopColor: 'red',
  }}
/>
```

### Custom Styles and Classes

```html
<Spinner style={{ background: 'gray', borderRadius: '50%' }} className="my-custom-spinner" />
```

> This is a versatile spinner component that allows you to create spinners with different styles and behaviors to suit the needs of your React web application. Use it to indicate loading or processing in a visually appealing way.
