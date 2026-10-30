---
'plume-ui-react': minor
---

`FileUploadRemove` is built on `OverlayClose`. **Breaking:** it takes `label` instead of `aria-label` (it defaults to `labels.remove(file)`), an element given as `children` becomes the button instead of being placed inside it, and its `ref` is an `HTMLElement`. The context of the `FileUpload` is no longer rebuilt on every render.
