---
'plume-ui-react': minor
---

`AlertDismiss` is built on `OverlayClose`. **Breaking:** it takes `label` instead of `aria-label` (it defaults to `labels.dismiss`), an element given as `children` becomes the button instead of being placed inside it, and its `ref` is an `HTMLElement`. The `Colors` story of the `Alert` shows every status in the default variant, and `Variants` includes `unstyled`.
