---
'plume-ui-react': minor
---

`Paginator` always stays on one line: `siblingCount` and `boundaryCount` are now the most pages it shows, and when the row has no room (on a phone, next to the page size, in a narrow container) it shows fewer instead of wrapping. The summary is cut with an ellipsis before the row breaks.
