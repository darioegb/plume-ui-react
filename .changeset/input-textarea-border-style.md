---
'plume-ui-react': patch
---

Keep `border-style: solid` in the base reset of `Input` and `Textarea` (`border: 0 solid` instead of `border: none`), so the `border` utility of Tailwind v3 draws a border on an `unstyled` field even when the preflight sits in a layer before `plume`.
