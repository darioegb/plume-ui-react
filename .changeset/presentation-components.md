---
'plume-ui-react': minor
---

Adds four presentation components: `Badge` (`solid`, `outline` and `subtle` variants, an optional status `dot`), `Card` (with `CardHeader`, `CardBody` and `CardFooter`; `elevated`, `outline` and `filled` variants), `Icon` (sizes and colors an SVG you bring, and hides it from screen readers unless it has a `label`) and `List` (with `ListItem` and `ListIcon`; `unordered`, `ordered` and `plain` variants). None of them needs JavaScript on the client, so they can be rendered in a Server Component. `Card` and `List` share their size and spacing with their parts through CSS variables instead of a context.
