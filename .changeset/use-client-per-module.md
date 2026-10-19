---
'plume-ui-react': minor
---

Components can be imported directly from React Server Components. The build used to drop every `'use client'` directive, so a Server Component importing `Tabs`, `Input` or `DatePicker` failed with `createContext is not a function` unless the app wrapped it in its own client boundary. The ESM build now emits one file per module and keeps the directive on the modules that need it, so `<ThemeProvider>` also works in a root layout, while `Button`, `Spinner`, `Field` and the utilities stay usable on the server. The stylesheet and the public API are unchanged, and importing a single component still leaves the rest out of the bundle.
