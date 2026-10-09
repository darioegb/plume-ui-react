# `@plume-ui-react/use-mask`

Input mask hook for Plume UI. Formats an input value as the user types, where
`#` matches any single character and every other mask character is a literal
that is auto-inserted.

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