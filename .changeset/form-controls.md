---
'plume-ui-react': minor
---

Adds four form controls: `Checkbox` (with an `indeterminate` state), `Radio`, `Toggle` (a switch) and `Textarea`. They render the native elements, so they work with forms, labels and the keyboard, and they accept what `Field` passes to its control (`id`, `aria-describedby`, `aria-invalid`, `disabled`, `readOnly`, `required`), so a `Field` can wrap them. `Checkbox`, `Radio` and `Toggle` take their label as children and send `className` and `style` to the label that wraps the input, while `ref` points to the input. They also work with react-hook-form's `register`.
