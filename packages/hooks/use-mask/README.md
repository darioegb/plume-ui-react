# `@plume-ui-react/use-mask`

Input mask hook for Plume UI. Formats an input value as the user types and
rejects characters that don't fit the mask.

| Mask character | Accepts |
| -------------- | ------- |
| `#` | a digit (`0-9`) |
| `A` | a letter |
| `*` | a letter or a digit |
| `\` | escapes the next character so it is a literal (e.g. `\A`) |
| anything else | a literal, auto-inserted as the user types |

`(###) ###-####` formats a phone number, `AA-####` takes two letters then four digits.

## Installation

```sh
npm install @plume-ui-react/use-mask
```

## Usage

```tsx
import { useMask } from '@plume-ui-react/use-mask'

function DateField() {
  const { value, onChange } = useMask({ mask: '##/##/####', defaultValue: '' })
  return <input onChange={onChange} placeholder="dd/mm/yyyy" value={value} />
}
```

Works for controlled (`value`) and uncontrolled (`defaultValue`) usage. When no
`mask` is provided, the value and handler are passed through untouched.

The pure `applyMask(value, mask)` helper is also exported for formatting a value
outside of React.

## License

[MIT](https://github.com/darioegb/plume-ui-react/blob/main/LICENSE)
