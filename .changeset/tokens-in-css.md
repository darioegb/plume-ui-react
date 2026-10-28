---
'plume-ui-react': patch
---

The components now take their spacing, transition times and easing, disabled opacity, focus ring, border widths, control heights, backdrop and shadows from the theme tokens instead of literal values, so a custom theme reaches all of them. Two sizes move to the nearest token: the large `Rating` stars are 2.25rem (before 2.5rem), and the shadow of the pickers and of the `Slider` thumb follows `shadow-md` and `shadow-sm`.
