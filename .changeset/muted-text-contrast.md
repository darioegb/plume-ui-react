---
'plume-ui-react': patch
---

Darkens the default `semantic.muted` color in light mode (`#71717a` to `#6e6e77`) and lightens it in dark mode (`#a1a1aa` to `#acacb5`). The placeholder of the `filled` variant of `Input`, `Textarea` and `DatePicker` is `muted` text over `surfaceMuted`, where it reached only 4.39:1 in light mode and 4.07:1 in dark mode, below the 4.5:1 that WCAG AA asks of text. A test now keeps `muted` at 4.5:1 or more on the background, the surface and the muted surface in both modes.
