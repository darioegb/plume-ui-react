---
'plume-ui-react': minor
---

`ChipRemove` is built on `OverlayClose`. **Breaking:** it takes `label` instead of `aria-label` (without it the name is still `Remove` followed by the text of the Chip, or `labels.remove`), an element given as `children` becomes the button instead of being placed inside it, and its `ref` is an `HTMLElement`. `ChipOwnProps` is exported. The `Colors` story of the `Chip` shows every color of the theme in the default variant.
