---
"plume-ui-react": minor
---

`DatePicker` is now a compound component. On its own it works as before, and it also takes `DatePickerInput` (the field and the button that open the calendar) and `DatePickerCalendar` (the calendar) as children to choose what it shows and in which order. The calendar closes with `useDismiss`: with Escape from anywhere, which gives the focus back to the input, and with a press outside (`pointerdown` instead of `mousedown`). `config.labels` sets the name of the calendar and of the button that opens it. `useClickOutside` is marked as deprecated.
