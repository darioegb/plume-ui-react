---
"plume-ui-react": minor
---

`Tab` and `TabPanel` now get their position from context instead of having it injected into their props, so a tab or a panel wrapped by another component (a tooltip, for example) keeps working, and a conditional tab doesn't shift the ones after it. Pass `index` to each tab or panel when one wrapper holds several of them. The internal `isActive` prop of `Tab` is gone: the active tab is the one at the `index` of `Tabs`.
