---
'plume-ui-react': patch
---

`Tabs` and `Field` generate their ids with React's `useId` only. The module counter they fell back to is gone, since React 18 is the minimum supported version.
