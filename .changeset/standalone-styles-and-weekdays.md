---
'@plume-ui-react/tabs': patch
'@plume-ui-react/input': patch
'@plume-ui-react/datepicker': patch
'@plume-ui-react/date-utils': patch
---

Components no longer depend on a global CSS reset (e.g. Tailwind preflight) to render correctly.

- `Tabs`: reset the `<button>` defaults (gray background, outset border) on tabs.
- `Input` and `DatePicker`: set `box-sizing: border-box` so the field no longer overflows its container.
- `DatePicker`: reset the calendar day and month/year buttons (they showed the browser's default border and background).
- `date-utils`: `getDaysOfWeekByLanguage` returned the weekday headers shifted (e.g. `Thu Fri Sat…`) depending on the year and timezone; it now always returns Monday to Sunday.
