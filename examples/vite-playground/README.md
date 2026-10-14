# Plume UI React — Vite Playground

A minimal [Vite](https://vite.dev) + React app that consumes the **published npm
packages** (`@plume-ui-react/lib` and `@plume-ui-react/core`) — not the workspace
sources. Use it to try the components in a real app and tweak the code live.

[![Open in StackBlitz](https://developer.stackblitz.com/img/open_in_stackblitz.svg)](https://stackblitz.com/github/darioegb/plume-ui-react/tree/main/examples/vite-playground)

## Run locally

```bash
npm install
npm run dev
```

## What it shows

- `<ThemeProvider>` with a light/dark toggle via `useTheme()`.
- `Button`, `Input` (incl. masked), `Tabs` and `DatePicker` from `@plume-ui-react/lib`.
- The bundled stylesheet imported from `@plume-ui-react/lib/styles.css`.
