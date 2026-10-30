---
'plume-ui-react': patch
---

The context of the `ProgressBar` is no longer rebuilt on every render, so its parts re-render only when a value they read changes.
