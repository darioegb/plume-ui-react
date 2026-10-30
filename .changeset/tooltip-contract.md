---
'plume-ui-react': minor
---

`Tooltip` forwards its `ref` to the bubble (the element with `role="tooltip"`) and takes `id`, `dir` and `lang`, together with the `className` and `style` it already had. The bubble carries `data-plume-tooltip` and `data-open`, and the element that triggers it gets `data-plume-tooltip-trigger` and `data-open` while the tooltip is open. An unstyled bubble keeps its `z-index`. `TooltipOwnProps` and `TooltipVariant` are exported.
