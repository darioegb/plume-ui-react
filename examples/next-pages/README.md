# Plume UI React — Next.js Pages Router example

A [Next.js](https://nextjs.org) **Pages Router** app that consumes the **published npm
package** (`@plume-ui-react/lib`). It renders the same demo as the
[App Router](../next-app) and [Vite](../vite-playground) examples; the difference is
where `<ThemeProvider>` lives.

## Structure

- `src/pages/_app.tsx` — imports `@plume-ui-react/lib/styles.css` and wraps every page
  in `<ThemeProvider>`, so the theme is server-rendered with each page.
- `src/pages/_document.tsx` — document shell (`lang`, base body styles).
- `src/pages/index.tsx` — renders the `<Demo />`.
- `src/components/demo.tsx` — interactive showcase (`useTheme()` + components).
- A custom theme in `src/theme.ts`, passed to `<ThemeProvider theme={theme}>`: it overrides the `primary` palette and adds a `salmon` color scheme.
- `src/plume-ui.d.ts` extends `ColorPalette` so TypeScript accepts `colorScheme="salmon"` (see [Colors › Customization](https://darioegb.github.io/plume-ui-react/?path=/docs/theme-colors--docs)).

## Run locally

```bash
npm install
npm run dev
```

This example is excluded from the pnpm workspace and ships its own
`package-lock.json`, so it installs `@plume-ui-react/*` from npm, exactly like a
real consumer.
