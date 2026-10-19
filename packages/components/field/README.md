# `@plume-ui-react/field`

Wraps a form control with a label, a required or optional mark, helper text and an error message, and wires them to the control for assistive technology.

> Most apps should install [`@plume-ui-react/lib`](https://www.npmjs.com/package/@plume-ui-react/lib), which includes every component and the theme. Use this package when you only need the Field.

## Installation

```sh
npm install @plume-ui-react/field @plume-ui-react/input @plume-ui-react/core
```

`react` and `react-dom` are peer dependencies.

## Usage

Import the stylesheets once and render the component inside `<ThemeProvider>`:

```tsx
import { Field } from '@plume-ui-react/field'
import { Input } from '@plume-ui-react/input'
import { ThemeProvider } from '@plume-ui-react/core'
import '@plume-ui-react/field/styles.css'
import '@plume-ui-react/input/styles.css'

export function App() {
  return (
    <ThemeProvider>
      <Field helperText="We'll never share your email." label="Email" required>
        <Input type="email" />
      </Field>
    </ThemeProvider>
  )
}
```

Props, examples and a react-hook-form integration are in the [Field documentation](https://darioegb.github.io/plume-ui-react/?path=/docs/components-field--docs).

## License

[MIT](https://github.com/darioegb/plume-ui-react/blob/main/LICENSE)
