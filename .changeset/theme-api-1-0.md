---
'plume-ui-react': minor
---

The theme API is ready for 1.0. `theme.zIndeces` is now `theme.zIndices` and its keys are names (`sticky`, `overlay`, `modal`, `popover`, `dropdown`, `tooltip`, `toast`) instead of the numbers 0 to 10, in the same order as before; the variables are `--plume-z-<name>` and the Tailwind utilities `z-<name>`. `theme.breakpoints` is in `rem`, the `Sidebar` reads it, and `--plume-breakpoint-*` is no longer emitted (a `var()` does not work in `@media`). `theme.sizes`, `--plume-size-*` and `--plume-color-<scheme>-contrast` are removed because nothing used them; use `--plume-color-<scheme>-solid-contrast`.
