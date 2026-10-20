---
'plume-ui-react': patch
---

`Icon` with a `label` no longer puts `role="img"` and `aria-label` on its wrapper. The SVG is hidden from assistive technology and the label is rendered as text that only screen readers get, which works in every screen reader and browser combination and needs no ARIA role.
