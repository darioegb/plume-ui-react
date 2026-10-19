---
'@plume-ui-react/field': minor
'@plume-ui-react/input': minor
'@plume-ui-react/datepicker': minor
'@plume-ui-react/lib': minor
---

New `Field` component, and error styling for `Input` and `DatePicker`.

- `Field` wraps a form control with `label`, `helperText`, `errorText` and `optionalText`, and a required mark when `required` is set. It wires them to the control: the label points to it, the texts describe it through `aria-describedby`, and `invalid`, `required`, `disabled` and `readOnly` reach it. It keeps the control's own `id` or generates one, and `orientation="horizontal"` puts the label beside the control (column width from `--field-label-width`). It works with `Input`, `DatePicker` and any control that accepts those attributes, including inputs registered with react-hook-form.
- `Input` and `DatePicker` accept `aria-invalid` and `aria-describedby`. With `aria-invalid`, the border and focus ring use the `error` color scheme.
