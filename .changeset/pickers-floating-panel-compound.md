---
"plume-ui-react": minor
---

`TimePicker` is now a compound component like the `DatePicker`: on its own it works as before, and it also takes `TimePickerInput` (the field and the button that opens the panel) and `TimePickerPanel` (the lists of hours and minutes) as children. With `isPanel` it shows only the lists, always visible and without the input. The `DatePicker` and the `TimePicker` now close with the same `useFloatingPanel` as the Popover, the Dropdown and the Select, so pressing Escape with a picker open inside a `Modal` closes only the picker. Their fields are now built on the `Input`, so they look the same as an `Input` in every variant, size and shape, and the button that opens the picker stays inside the field in the `unstyled` variant too.
