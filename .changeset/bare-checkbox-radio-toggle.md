---
'plume-ui-react': minor
---

`Checkbox`, `Radio` and `Toggle` are bare controls: a single `<input>` with no wrapper and no text of their own, so there is one `<label>` per control. The visible text comes from `Field`, which has a new `orientation="inline"` (control first, label after, helper and error text under the label). `className` and `style` go to the `<input>`, and `classNames`, `CheckboxPart`, `RadioPart`, `TogglePart` and the `labelsItself` hook of `Field` are removed. See "Upgrading to 1.0".
