---
'plume-ui-react': minor
---

`Tabs` follows the parts contract. It keeps its state like the other components: `defaultIndex` sets the tab it starts on, and `index` with `onIndexChange` controls it (with `index` set, a click only asks for the change; before, the Tabs also moved by themselves). `Tab`, `TabList`, `TabPanels` and `TabPanel` accept the native attributes they whitelist and `variant="unstyled"` leaves only your classes on all of them: the layout it needs (the row of the tabs, the vertical orientation, the alignment) is kept through zero-specificity rules on `data-plume-tabs-*`, `data-orientation` and `data-alignment`. A selected tab is styled through `data-active` (the `active` class is gone). `TabsVariant`, `TabsOrientation`, `TabsAlignment`, `TabsOwnProps`, `TabOwnProps` and `TabPanelOwnProps` are exported. A `Tab` or a `TabPanel` outside its list throws, instead of taking position 0.
