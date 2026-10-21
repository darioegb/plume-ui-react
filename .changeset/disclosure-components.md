---
'plume-ui-react': minor
---

Adds `Accordion` (with `AccordionItem`, `AccordionTrigger` and `AccordionContent`): a stack of headings that each show or hide a section, following the WAI-ARIA accordion pattern. Every trigger is a button inside a heading (`headingLevel`, `3` by default) with `aria-expanded` and `aria-controls`, and its panel is a region named by the trigger. <kbd>Enter</kbd> and <kbd>Space</kbd> toggle an item, the arrows, <kbd>Home</kbd> and <kbd>End</kbd> move between the triggers and a disabled one is skipped. With `type="single"` one item is open at a time (`collapsible` lets the user close it) and with `type="multiple"` any number; the open items live in `value` / `defaultValue` / `onValueChange`. The panel animates its height, a closed one is out of reach of the keyboard and of screen readers, and the animation stops with `prefers-reduced-motion`. It has the `outline`, `filled` and `unstyled` variants, three sizes and a color scheme, and an `icon` can replace the chevron.

Adds `Skeleton`: a placeholder for content that is loading, with the `text` (one or several `lines`, the last one shorter), `rect` and `circle` shapes, a `width` and a `height`, and the `pulse` and `wave` animations. It is hidden from screen readers, so mark the container that holds it with `aria-busy`.

Adds `ProgressBar`: a `progressbar` with `value` and `max` (kept in range), `valueText` for the text a screen reader reads, and `indeterminate` for a task of unknown length, which drops the value. It has the `solid`, `striped` (with `animated`) and `unstyled` variants, three thicknesses, two shapes and a color scheme, and `indicatorClassName` styles the bar in every variant.
