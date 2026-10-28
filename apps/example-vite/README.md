# Plume UI React — Vite example

A client-only [Vite](https://vite.dev) + React SPA that consumes the **published npm
package** (`plume-ui-react`), not the workspace sources. It demonstrates a slice of
the same simulated Plume Projects product as the Next.js example, without a server
or authentication. Storybook is the component gallery.

[![Open in StackBlitz](https://developer.stackblitz.com/img/open_in_stackblitz.svg)](https://stackblitz.com/github/darioegb/plume-ui-react/tree/main/apps/example-vite)

## Run locally

```bash
npm install
npm run dev
```

Run `npm run build` to type-check and create the production build, and
`npm run preview` to serve it locally. When deploying the SPA, configure the host
to serve `index.html` for client-side routes such as `/projects`.

## What it shows

- A responsive sidebar and top bar, a dashboard with metrics and projects, and
  loading skeletons.
- A projects table with search, filters, sorting, pagination, a detail drawer,
  creation form, completion with undo, and deletion confirmation.
- Simulated data stored in the browser's `localStorage`; the account menu resets
  the demo data. Changes are local to the browser and are not shared with Next.js.
- A light/dark toggle and brand-color menu. Preferences are stored locally; the
  initial color mode follows the system until explicitly changed.
- `ThemeProvider`, `ToastProvider`, and the bundled
  `plume-ui-react/styles.css`. `src/theme.ts` defines the brand palettes and a
  custom `salmon` color scheme, and `src/plume-ui.d.ts` extends `ColorPalette`
  (see [Colors › Customization](https://darioegb.github.io/plume-ui-react/?path=/docs/theme-colors--docs)).

This is a demo, not a production backend: validation and persistence run in the
browser. If browser storage is unavailable, changes last only for the current
session and a warning is logged in the browser console.
