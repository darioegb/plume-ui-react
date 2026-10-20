---
'plume-ui-react': minor
---

Adds four presentation components: `Badge` (`solid`, `outline` and `subtle` variants, an optional status `dot`), `Card` (with `CardHeader`, `CardBody` and `CardFooter`; `elevated`, `outline` and `filled` variants), `Icon` (sizes and colors an SVG you bring, and hides it from screen readers unless it has a `label`) and `List` (with `ListItem`, `ListItemButton`, `ListItemIcon`, `ListItemText`, `ListSubheader` and `ListDivider`; `plain`, `bordered` and `filled` variants, bullets or numbers, selected and disabled buttons or links as rows). None of them needs JavaScript on the client, so they can be rendered in a Server Component. `Card` and `List` share their size with their parts through CSS variables instead of a context.

Also adds the `tint-text` token of every color scheme (`--plume-color-<scheme>-tint-text`): text that keeps at least 4.5:1 on the `tint` and `tint-strong` backgrounds in light and dark mode, which `text` doesn't always do. The subtle `Badge` and the selected row of `List` use it.
