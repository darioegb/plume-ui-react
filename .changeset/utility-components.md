---
'plume-ui-react': minor
---

Adds the utility components of the 1.0 catalog.

`Collapse` is a box that opens and closes with a height animation, driven by its `open` prop. Its content sits in a box with `filled`, `outline` and `accent` variants, a `colorScheme` and a `size`. A closed one is hidden from assistive technology and can't be focused, and the animation is turned off with `prefers-reduced-motion`. `AccordionContent` is built on it.

`Table` (with `TableCaption`, `TableHeader`, `TableBody`, `TableFooter`, `TableRow`, `TableHead` and `TableCell`) is a semantic table with `plain`, `bordered` and `striped` variants, three densities, `hoverable` rows, a `selected` row and a `stickyHeader` with `maxHeight`. A `TableHead` with `onSort` becomes a button and `sort` sets `aria-sort`. When the table doesn't fit, its box becomes a focusable region named like the table so the keyboard can scroll it.

`Carousel` (with `CarouselSlides`, `CarouselSlide`, `CarouselPrev`, `CarouselNext`, `CarouselDots` and `CarouselPlayPause`) follows the WAI-ARIA carousel pattern. The slides use the browser's scroll snapping, so swipe, wheel and keyboard scrolling stay in sync with the buttons and the dots, and only the visible slide can be reached. It can be controlled (`index`, `defaultIndex`, `onIndexChange`), `loop`, and `autoplay` with a pause on hover and focus, a play and pause button, and no motion with `prefers-reduced-motion`. It has `solid`, `outline`, `ghost` and `overlay` variants.

`FileUpload` is a real file input with a dropzone for drag and drop and a list of the chosen files with a button to remove each one. `accept`, `maxSize` and `maxFiles` leave out the files that don't fit and say why (`onReject`, `formatRejection`). It takes the `FieldControlProps` of `Field`, forwards the ref to the input and keeps the input in sync with the list, so it works with react-hook-form and in a plain form. `progress` shows a `ProgressBar` under each file that has a value. It has `outline`, `bordered` and `filled` variants.

Every one of them has an `unstyled` variant that keeps the structure and drops the Plume styles, and takes a class for each part.
