---
'plume-ui-react': minor
---

`ToastDismiss` is built on `OverlayClose`. **Breaking:** it takes `label` instead of `aria-label` (it defaults to the `dismiss` label of the `ToastProvider`), an element given as `children` becomes the button instead of being placed inside it, and its `ref` is an `HTMLElement`. A `Toast` given `children` renders them as written, whether they are parts or not: before, children that were not parts were dropped for the default composition. The region of the `ToastProvider` takes no `style`, so nothing overrides its positioning: use `position`, or `className` with `variant="unstyled"`.
