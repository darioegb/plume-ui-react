---
"plume-ui-react": minor
---

The `variant`, `size` and `shape` of the `DatePicker` now go on the `DatePicker` itself, also when it has children, and style the input and the calendar together: `outline` has a bordered calendar, `filled` a tinted one with an accent line, `underline` a square one with an accent line, `unstyled` none of them, and `size` scales the days. The always visible calendar (`isCalendar`) now stays in the page flow and shrinks to the width of its container. New `TimePicker`: a field and a popup with lists of hours and minutes (optionally `hour12` with AM/PM and a `minuteStep`) whose value is a `HH:mm` string, with `variant`, `size`, `shape`, `colorScheme` and `config.labels`.
