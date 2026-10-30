---
'plume-ui-react': minor
---

`PinInput` sends every prop of a `Field` to its `<fieldset>`, the element its `ref` already pointed to. **Breaking:** `id` goes to the fieldset instead of the first box (give a `PinInputCell` its own `id` to target a box), and the fieldset also gets `aria-invalid` and `data-readonly`. Clicking the label of a `Field` still focuses the next box to fill. `PinInputOwnProps` is exported.
