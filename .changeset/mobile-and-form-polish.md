---
'plume-ui-react': minor
---

Makes the floating panels fit a phone. The `Select`, the `Dropdown`, the `Popover` and the `DatePicker` now measure the room they have next to their trigger and never grow past it: a long list scrolls inside the panel (`overscroll-behavior: contain`, so the page behind does not move) instead of running off the bottom of the screen, where it could not be reached. The room is exposed as the `--plume-available-height` and `--plume-available-width` custom properties on the panel. The `DatePicker` calendar is now placed with the same logic, so it no longer overflows the right edge of a narrow screen, and a range picker stacks its two months in a column on a small screen.

Changes how the `Select` marks the options of a `multiple` select: a chosen option now shows the same check at its end as in a single select, instead of a checkbox. The `checkbox` part of `SelectOption` `classNames` is gone; style `check`, which now applies to both.

Adds `showCount` to the `Textarea`: it shows how many characters there are under the field (`12`, or `12 / 200` with `maxLength`), links the count to the textarea for screen readers, announces how many characters are left when few remain, and marks the count at the limit. `formatCount` and `formatRemaining` change the texts and `countClassName` styles the count.

The remove button of a `Chip` keeps its look but has a hit area of at least 24px, so it can be pressed with a finger.
