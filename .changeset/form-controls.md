---
'plume-ui-react': minor
---

Adds five form components: `Checkbox` (with an `indeterminate` state), `Radio`, `RadioGroup`, `Toggle` (a switch) and `Textarea`. `RadioGroup` owns the value, name, size, color scheme and state of its radios, and inside a `Field` it is named by the Field label. They render the native elements, so they work with forms, labels and the keyboard, and they accept what `Field` passes to its control (`id`, `aria-describedby`, `aria-invalid`, `disabled`, `readOnly`, `required`), so a `Field` can wrap them. `Checkbox` and `Radio` have a `solid` (default) and an `outline` variant, and a `RadioGroup` can set the variant of its radios. `Checkbox`, `Radio` and `Toggle` take their label as children and send `className` and `style` to the label that wraps the input, while `ref` points to the input. They also work with react-hook-form's `register`.
