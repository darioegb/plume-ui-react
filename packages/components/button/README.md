# Button

This is a custom React button component that allows you to create buttons with various variants and styling options. You can use this button in your React web applications to enhance the user experience.

## Installation

To use this component in your React project, follow these steps:

1. Install the package using npm or yarn:

   ```sh
   npm install @plume-ui-react/button
   # Or
   yarn add @plume-ui-react/button
   ```

2. Import the stylesheet into your root component file:

   ```javascript
   import '@plume-ui-react/button/dist/index.css'
   ```

3. Import the component in your JavaScript or TypeScript file:

   ```javascript
   import { Button } from '@plume-ui-react/button'
   ```

4. Use the component in your application:

   ```javascript
   <Button>Button Text</Button>
   ```

## Properties

This component accepts several properties to customize the appearance and behavior of the button. Here are the available properties sorted alphabetically:

| Property        | Description                                                                                      |
| --------------- | ------------------------------------------------------------------------------------------------ |
| `isBusy`        | Indicates whether the button is in "busy" or loading mode.                                       |
| `busyText`      | The text displayed on the button when it's in a busy (loading) state. By default, it shows "..." |
| `children`      | The content of the button, typically the text displayed on the button.                           |
| `customClasses` | Additional CSS classes for the button.                                                           |
| `customStyles`  | Custom styles for the button.                                                                    |
| `disabled`      | Indicates whether the button is disabled or not.                                                 |
| `iconLeft`      | An icon or component to be displayed to the left of the button text.                             |
| `iconRight`     | An icon or component to be displayed to the right of the button text.                            |
| `label`         | An alternative for `children`. You can use `label` instead of `children` for strings content.    |
| `shape`         | The shape of the button, which can be "pill" or "rounded".                                       |
| `size`          | The size of the button, which can be "sm" (small), "md" (medium), or "lg" (large).               |
| `type`          | The button type, default is "button".                                                            |
| `variant`       | The button variant, which can be "solid", "outline", "link", "icon" or "unstyled".               |

## Usage Examples

Here are some examples of how you can use this button component in your project:

### Basic Button

```javascript
<Button label="Click Me!" />
```

### Button with Icon on the Right

```javascript
<Button iconRight={<RightIcon />}>Save</Button>
```

### Busy (Loading) Button

```javascript
<Button isBusy>Saving...</Button>
```

### Outline Button with Custom Color Scheme

```javascript
<Button variant="outline" colorScheme="#FF5733">
  Cancel
</Button>
```

### Large Pill-shaped Button

```javascript
<Button size="lg" shape="pill">
  Learn More
</Button>
```

### Disabled Button

```javascript
<Button disabled>Disabled</Button>
```

### Button with Custom Styles and Classes

```javascript
<Button customStyles={{ background: 'purple', color: 'white' }} customClasses="my-custom-button">
  Custom Button
</Button>
```

> This is a versatile button component that allows you to create buttons with different styles and behaviors to suit the needs of your React web application. Have fun customizing your buttons!
