---
"plume-ui-react": minor
---

Every component now styles its inner parts through one prop, `classNames`, a record keyed by part (`Partial<Record<<Name>Part, string>>`, with the `<Name>Part` type exported). It is available in `Checkbox`, `Radio`, `Toggle`, `PinInput`, `Input`, `Textarea`, `SelectGroup`, `TimePicker`, `Sidebar`, `AccordionContent`, `Breadcrumb`, `ModalContent` (and `DrawerContent`), `ToastProvider`, `Skeleton`, `Collapse`, `ProgressBar`, `CarouselDots`, `Table`, `TableHead` and `TableEmpty`, next to the ones that already had it. The loose props they replace are deprecated and still work: `inputClassName`, `labelClassName`, `revealClassName`, `countClassName`, `panelClassName`, `backdropClassName`, `bodyClassName`, `listClassName`, `separatorClassName`, `toastClassName`, `lineClassName`, `indicatorClassName`, `valueClassName`, `dotClassName`, `containerClassName`, `loadingClassName`, `sortClassName` and `emptyStateClassName`.
