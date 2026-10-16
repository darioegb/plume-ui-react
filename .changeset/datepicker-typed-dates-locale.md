---
'@plume-ui-react/date-utils': patch
'@plume-ui-react/datepicker': patch
'@plume-ui-react/lib': patch
---

`DatePicker` reads typed dates in the active format instead of always assuming month/day/year.

- Typing `31/01/2026` with `language: 'es'` (or `31.01.2026` with `de`) now selects January 31, 2026; it used to resolve to a wrong date or an invalid one.
- Dates that don't exist, such as `02/31/2040`, are ignored instead of rolling over to the next month.
- `displayFormat` accepts the `dd`, `mm` and `yyyy` tokens in either case, so `DD/MM/YYYY` works for typing as well as for display.
- `date-utils`: `getDateFromDateString` takes an optional format (default `mm/dd/yyyy`), `validateFormatDate` also checks that the date exists, and `formatDate` accepts lowercase tokens.
