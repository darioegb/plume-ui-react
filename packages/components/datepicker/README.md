# `@plume-ui-react/datepicker`

A date and date-range picker with a typed input, a calendar popover, locale-aware formats and an optional footer.

> Most apps should install [`@plume-ui-react/lib`](https://www.npmjs.com/package/@plume-ui-react/lib), which includes every component and the theme. Use this package when you only need the DatePicker.

## Installation

```sh
npm install @plume-ui-react/datepicker @plume-ui-react/core
```

`react` and `react-dom` are peer dependencies.

## Usage

Import the stylesheet once and render the component inside `<ThemeProvider>`:

```tsx
import { useState } from 'react'
import { DatePicker, type DateRange } from '@plume-ui-react/datepicker'
import { ThemeProvider } from '@plume-ui-react/core'
import '@plume-ui-react/datepicker/styles.css'

export function BookingDates() {
  const [value, setValue] = useState<DateRange>({ startDate: null, endDate: null })
  return (
    <ThemeProvider>
      <DatePicker isRange onChange={setValue} placeholder="Check-in - Check-out" value={value} />
    </ThemeProvider>
  )
}
```

Props, variants and live examples are in the [DatePicker documentation](https://darioegb.github.io/plume-ui-react/?path=/docs/components-datepicker--docs).

## License

[MIT](https://github.com/darioegb/plume-ui-react/blob/main/LICENSE)
