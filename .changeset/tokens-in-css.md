---
'plume-ui-react': patch
---

The components now take their spacing, transition times and easing, disabled opacity, focus ring, border widths, control heights, backdrop and shadows from the theme tokens instead of literal values, so a custom theme reaches all of them. The transition times move to the nearest of `fast` (0.15s), `normal` (0.2s) and `slow` (0.3s), so the ones that were 0.1s, 0.12s, 0.18s and 0.22s change by at most 50 ms.
