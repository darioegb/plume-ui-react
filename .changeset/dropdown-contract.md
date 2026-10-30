---
'plume-ui-react': minor
---

Dropdown follows the parts contract. **Breaking for CSS that targets the parts:** the attributes are renamed from `data-plume-menu*` to `data-plume-dropdown-*` (`data-plume-menu` → `data-plume-dropdown-menu`, `data-plume-menu-item` → `data-plume-dropdown-item`, `data-plume-menu-item-icon` / `-label` / `-shortcut` → `data-plume-dropdown-item-icon` / `-label` / `-shortcut`). `DropdownTrigger`, `DropdownLabel` and `DropdownSeparator` get `data-plume-dropdown-trigger`, `data-plume-dropdown-label` and `data-plume-dropdown-separator`, the trigger and the menu get `data-open` while it is open, and a disabled item gets `data-disabled`. `DropdownTrigger` takes `style`, and its `className` and `style` are now added to the element it wraps too, not only to the plain `<button>` it renders for text. `DropdownLabel` takes an `id`. `DropdownOwnProps`, `DropdownVariant`, `DropdownItemOwnProps` and `DropdownTriggerOwnProps` are exported.
