---
'plume-ui-react': minor
---

Adds the `borderStrong` semantic color and uses it for the boundary of form controls: `Input`, `Textarea`, the `DatePicker` field and the new `Checkbox`, `Radio` and `Toggle`. The default `border` was about 1.5:1 against white, and in dark mode it was the same color as the `filled` background, so the field boundary was hard to see or invisible. `borderStrong` keeps at least 3:1 against the background, surface and muted surface in light and dark mode (WCAG 1.4.11). The decorative dividers of `Tabs` and the `DatePicker` calendar keep using `border`.

The default theme looks different: control borders are darker. If you customized `semantic.border` to change the border of inputs, set `semantic.borderStrong` instead. The `SemanticColors` type has a new `borderStrong` key, so a full `Theme` object needs it.

`Field` is now a client component that gives its label an id, which `RadioGroup` uses to name itself.
