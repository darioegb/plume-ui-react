---
'plume-ui-react': minor
---

Every text the library shows or announces is changed with a typed `labels` prop (`PaginatorLabels`, `SelectLabels`...), and the loose props (`nextLabel`, `getPageLabel`, `revealLabel`, `emptyText`, `statusLabels`, `dismissLabel`...) are removed. `DatePicker` and `TimePicker` take `labels` instead of `config.labels` and `config.footer`, and the calendar navigation texts can be translated. `FileUpload` also translates its prompt, rejections and file sizes, `Carousel` takes one `labels` for all its parts, and `Spinner` takes `label`. See "Upgrading to 1.0" for the full table.
