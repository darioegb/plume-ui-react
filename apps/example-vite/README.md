# Plume UI React — Vite Playground

A minimal [Vite](https://vite.dev) + React app that consumes the **published npm
package** (`plume-ui-react`), not the workspace
sources. Use it to try the components in a real app and tweak the code live.

[![Open in StackBlitz](https://developer.stackblitz.com/img/open_in_stackblitz.svg)](https://stackblitz.com/github/darioegb/plume-ui-react/tree/main/apps/example-vite)

## Run locally

```bash
npm install
npm run dev
```

## What it shows

- `<ThemeProvider>` with a light/dark toggle via `useTheme()`.
- `Button`, `Input` (incl. masked), `Tabs` and `DatePicker` from `plume-ui-react`.
- The bundled stylesheet imported from `plume-ui-react/styles.css`.
- A custom theme in `src/theme.ts`, passed to `<ThemeProvider theme={theme}>`: it overrides the `primary` palette and adds a `salmon` color scheme.
- `src/plume-ui.d.ts` extends `ColorPalette` so TypeScript accepts `colorScheme="salmon"` (see [Colors › Customization](https://darioegb.github.io/plume-ui-react/?path=/docs/theme-colors--docs)).
