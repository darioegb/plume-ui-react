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

   ```javascript
   <Spinner />
   ```

## Properties

This component accepts several properties to customize the appearance and behavior of the spinner. Here are the available properties sorted alphabetically:

| Property            | Description                                                                                  |
| ------------------- | -------------------------------------------------------------------------------------------- |
| `borderColor`       | The color of the spinner's border. Default is "currentColor".                                |
| `borderBottomColor` | The color of the spinner's bottom border. Default is "currentColor".                         |
| `borderLeftColor`   | The color of the spinner's left border. Default is "currentColor".                           |
| `borderRightColor`  | The color of the spinner's right border. Default is "currentColor".                          |
| `borderTopColor`    | The color of the spinner's top border. Default is "transparent".                             |
| `customClasses`     | Additional CSS classes for the spinner.                                                      |
| `customStyles`      | Custom styles for the spinner.                                                               |
| `hidden`            | Indicates whether the spinner should be hidden.                                              |
| `id`                | The unique identifier for the spinner element.                                               |
| `size`              | The size of the spinner. Default is 1.                                                       |
| `speed`             | The animation speed of the spinner. Default is "1s".                                         |
| `tabIndex`          | The tab index of the spinner for keyboard navigation.                                        |
| `thickness`         | The thickness of the spinner's border. Default is 3.                                         |
| `variant`           | The spinner variant, which can be "solid", "dashed", "dotted", "double". Default is "solid". |

## Usage Examples

Here are some examples of how you can use this spinner component in your project:

### Default Spinner

```javascript
<Spinner />
```

### Large Spinner with Custom Border Color

```javascript
<Spinner size={2} borderColor="#FF5733" />
```

### Spinner with empty area

```javascript
<Spinner borderColor="#f6eeee" borderTopColor="red" />
```

### Spinner with multiple border colors

```javascript
<Spinner
  borderTopColor="red"
  borderRightColor="green"
  borderBottomColor="blue"
  borderLeftColor="yellow"
/>
```

### Custom Styles and Classes

```javascript
<Spinner
  style={{ background: 'gray', borderRadius: '50%' }}
  className="my-custom-spinner"
/>
```

> This is a versatile spinner component that allows you to create spinners with different styles and behaviors to suit the needs of your React web application. Use it to indicate loading or processing in a visually appealing way.
