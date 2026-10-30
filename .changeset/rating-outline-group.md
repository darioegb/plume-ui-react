---
'plume-ui-react': minor
---

`Rating` gets an `outline` variant, which draws the chosen stars as a thicker outline in the color of the rating. A read only `Rating` is now the same `<fieldset>` as the interactive one (a plain group instead of a `<span>`), so it keeps its `aria-label` or the label of its `Field` as its name, and its `aria-describedby` and `aria-invalid`. **Breaking:** the `ref` of `Rating` is typed `HTMLFieldSetElement` instead of `HTMLElement`, and it is the fieldset in both modes. The root also gets `data-disabled`, `data-invalid` and `data-readonly`.
