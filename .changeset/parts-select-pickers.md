---
'plume-ui-react': minor
---

`Select`, `DatePicker` and `TimePicker` are made of exported parts (`SelectField`, `SelectCombobox`, `SelectChips`, `SelectChip`, `SelectOptionIcon`, `DatePickerField`, `DatePickerTrigger`, `DatePickerHeader`, `DatePickerGrid`, `DatePickerDay`, `DatePickerFooter`, `TimePickerHours`, `TimePickerMinutes`, `TimePickerOption`, `TimePickerTrigger`...), each with its own `className`, `style` and `ref`, and `classNames` is removed from them. Without children they render the same default composition as before, and the data-driven parts (chips, days, months, years, time options) take a render function. See "Upgrading to 1.0".
