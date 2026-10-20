---
'plume-ui-react': patch
---

Fixes `Checkbox`, `Radio` and `Toggle` inside a `Field`: the input had two `<label>` elements, the one of the Field and the one that wraps the control, which screen readers handle unevenly and axe reports as `form-field-multiple-labels`. The Field no longer ties its label to a control that has text of its own, and the input is named with the Field label followed by that text. A control with no text no longer wraps itself in an empty `<label>`.
