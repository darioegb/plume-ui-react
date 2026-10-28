---
'plume-ui-react': minor
---

New components `Heading` and `Text`, made with the text styles of the theme. `Heading` has a `level` (`h1` to `h6`, the outline of the page) and a `size` (its look, from 1 to 6, which follows the level by default); `Text` has `as` (`p`, `span`, `div`, `label`, `small` or `strong`), `variant` (`body`, `body-sm`, `label`, `caption` or `unstyled`), `muted` and `truncate`. Both take `className`, `style` and `ref`, and `variant="unstyled"` drops the Plume styles. The Tailwind utilities of the text styles are `text-heading-1` to `text-heading-6`, `text-body`, `text-body-sm`, `text-label` and `text-caption`. New tokens `--plume-container-sm/md/lg/xl` (40, 48, 64 and 80rem), `--plume-dialog-width-sm/md/lg` (24, 32 and 48rem) for the width of the `Modal`, and the header of the `Modal` uses the `heading-5` text style (it looks the same).
