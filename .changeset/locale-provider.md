---
'plume-ui-react': minor
---

Add `LocaleProvider` and `useLocale`: one place to give the texts of every component (`messages`, typed by `PlumeMessages`) and the `locale`, with the order `labels` prop, then provider, then English default. The messages can change at runtime, and the `DatePicker` takes its language from the `locale`. `Button` and `Spinner` become client components because they read the provider. The single texts of `Spinner` (`label`), `SidebarToggle`, `NavbarToggle` and the close button of the overlays are translatable from the provider too.
