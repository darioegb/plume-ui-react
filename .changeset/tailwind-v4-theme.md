---
'plume-ui-react': minor
---

New `plume-ui-react/tailwind.css`, the theme of Plume for Tailwind CSS v4: `@import 'plume-ui-react/tailwind.css'` gives the colors (`bg-primary-solid`, `text-primary-on-solid`, `bg-surface`), the text styles (`text-heading-1`, `text-body`), the radii, shadows, container widths and easings as utilities, and adds `z-modal`, `duration-fast`, `opacity-disabled` and `h-control-md`. They point to the `--plume-*` variables, so they follow the theme and the color mode. With `prefers-reduced-motion: reduce` the duration tokens are 0, so the components and your own `duration-*` utilities stop animating.
