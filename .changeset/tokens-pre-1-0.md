---
'plume-ui-react': minor
---

The theme gets `semantic.borderHover`, `overlays` (`hover`, `active`), `targets.min` and `focusRing.inset`, and the components use them: one hover for the rows, the items and the small buttons, a border on hover that gets lighter in dark mode, 24px hit areas from one token, and every focus ring driven by `--plume-focus-ring-offset` (now `0`) or `--plume-focus-ring-inset`. `shadows.raised` and `shadows.panel` are removed: the Slider thumb uses `md` and the panel of the pickers `lg`. `tailwind.css` adds the `tint`, `tint-strong` and `tint-text` colors.
