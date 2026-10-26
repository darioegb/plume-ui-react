---
'plume-ui-react': minor
---

`Paginator` gets two new parts and the props to drive them.

- `PaginatorSummary` shows the range of the current page, such as `11–20 of 54`, and needs `total`. Its text is `labels.summary(from, to, total)`.
- `PaginatorPageSize` is a `Select` to choose how many items a page has (`options`, `labels.pageSize`). The page changes with it, to keep the first item of the old page in view.
- `pageSize` is now controllable: `onPageSizeChange` and `defaultPageSize` join it. A `Paginator` that only passed `pageSize` works as before.

Without children the `Paginator` still renders only the list, so nothing changes for existing code.
