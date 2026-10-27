---
'plume-ui-react': minor
---

`Paginator` drops the `count` prop (number of pages). Give it the `total` of items and the `pageSize`, and it works the pages out; if you only know the number of pages, pass `total={pages * pageSize}`. A `Paginator` with a `total` of `0` now renders an empty pager (so `PaginatorSummary` can show `0–0 of 0`), and one without a `total` renders nothing.
