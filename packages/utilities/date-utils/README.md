# `@plume-ui-react/date-utils`

Locale-aware date helpers used by the Plume UI DatePicker. They rely on `Intl.DateTimeFormat`; when `language` is omitted the browser language is used.

## Installation

```sh
npm install @plume-ui-react/date-utils
```

## API

| Function | Returns |
| --- | --- |
| `getDateFormatByLanguage(language?)` | The locale's numeric date pattern, e.g. `'dd/mm/yyyy'` for `es` |
| `getDaysOfWeekByLanguage(language?)` | Short weekday names, starting on Monday |
| `getMonthsByLanguage(language?)` | Month names, capitalized |
| `getDateStringByLanguage({ startDate, endDate, isRange, displayFormat, language })` | A date (or `start - end` range) formatted with `displayFormat` or the locale |
| `formatDate(date, displayFormat)` | `date` formatted with `YYYY`, `MM` and `DD` tokens |
| `validateFormatDate(dateString, language, displayFormat?)` | Whether `dateString` matches the format |
| `getDateFromDateString(dateString)` | A `Date` parsed from `MM/DD/YYYY` (or `-` separated) text |

```ts
import { formatDate, getMonthsByLanguage } from '@plume-ui-react/date-utils'

formatDate(new Date(2026, 0, 31), 'DD/MM/YYYY') // '31/01/2026'
getMonthsByLanguage('es')[0] // 'Enero'
```

## License

[MIT](https://github.com/darioegb/plume-ui-react/blob/main/LICENSE)
