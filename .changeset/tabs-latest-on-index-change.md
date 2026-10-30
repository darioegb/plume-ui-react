---
'plume-ui-react': patch
---

`Tabs` calls the latest `onIndexChange` it was given, instead of the first one, when its other props stay the same.
