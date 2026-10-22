---
"plume-ui-react": minor
---

Adds `useTableState`, a hook that keeps the sort, the filters, the page and the selection of a `Table`. In client mode it returns the rows of the current page already filtered and sorted. With `manual` (server side) it only keeps the params to send and takes the rows and the total from you. `getSortProps(column)` gives the props for a `TableHead`, and the page, `pageCount` and `setPage` feed a `Paginator`. `Table` also gets a `loading` prop (`aria-busy`, a translucent veil and a `Spinner` named by `loadingLabel`) and a `TableEmpty` row for when there is nothing to show.
