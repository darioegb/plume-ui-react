---
'@plume-ui-react/input': patch
'@plume-ui-react/datepicker': patch
'@plume-ui-react/lib': patch
---

`Input` and `DatePicker` no longer overflow narrow containers.

- The 18rem minimum width now applies only when there is room (`min(18rem, 100%)`), so the fields fit on small screens.
- An `Input` with `addonBefore` / `addonAfter` shrinks its field to keep the addons beside it, and addons no longer wrap.
