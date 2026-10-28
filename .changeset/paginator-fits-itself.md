---
'plume-ui-react': minor
---

`Paginator` always stays on one line and decides by itself how many pages to show: the current one, one on each side and the first and the last, and fewer when the row has no room (on a phone, next to the page size, in a narrow container). The summary is cut with an ellipsis before the row breaks. The `siblingCount` and `boundaryCount` props are removed; if you passed them, remove them.
