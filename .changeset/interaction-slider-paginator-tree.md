---
'plume-ui-react': minor
---

Adds `Paginator`, `Slider` and `Tree`.

`Paginator` is a navigation landmark with buttons for the pages, the previous and the next one, and with `showEdges` the first and the last. It takes `count` (or `total` and `pageSize`), and folds long lists behind an ellipsis around the current page with `siblingCount` and `boundaryCount`, always showing the same number of items. The current page has `aria-current="page"`, every text can be translated (`previousLabel`, `nextLabel`, `firstLabel`, `lastLabel` and `getPageLabel`), and it is built on `Button`. It has `solid`, `outline` and `ghost` variants.

`Slider` is built on native `<input type="range">` inputs, so it keeps the browser's keyboard, touch and form behavior, and draws the track, the filled part and the marks around them. It takes a number or a pair for a range with two thumbs that can't cross (pressing the track moves the nearest one), `min`, `max`, `step`, `marks` with optional labels, `orientation`, `formatValue` for the value text, `onValueChange` while dragging and `onValueCommit` for the final value. It takes the `FieldControlProps` of `Field` and forwards the ref to the input. It has `solid` and `outline` variants.

`Tree` (with `TreeItem`, `TreeItemLabel` and `TreeItemGroup`) follows the WAI-ARIA tree view pattern: `role="tree"`, `aria-level`, `aria-expanded` and `aria-selected`, a roving tab stop, arrow keys, `Home`, `End`, `Enter`, `Space` and typeahead. It selects one item, several or none (`selection`), or shows a checkbox on every item with `selection="checkbox"`, which uses `aria-checked`, shows the mixed state of a branch and cascades between a branch and its items (`cascade`), for lists such as permissions. The open branches can be controlled (`expanded`, `defaultExpanded`, `onExpandedChange`). It has `solid`, `ghost` and `accent` variants.

`Button` accepts `aria-current`. Every one of them has an `unstyled` variant that keeps the structure and drops the Plume styles.
