---
'plume-ui-react': minor
---

`className` and `style` now go to the outermost element a component renders, and `classNames.input` reaches the native control. `Input` with addons, elements or a reveal button, `Textarea` with `showCount`, `DatePicker`, `TimePicker` and the `DatePickerInput` and `TimePickerInput` parts put `className` on the wrapper instead of the `<input>` or `<textarea>`. Use `classNames.input` to style the native control. `DatePicker` also takes `classNames.calendar`.
