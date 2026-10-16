# Plume UI React — Next.js Pages Router example

A [Next.js](https://nextjs.org) **Pages Router** app that uses the Plume UI packages **from this workspace** (`workspace:*`), so it reflects unreleased changes. For an app that installs the published npm packages, see [`examples/next-app`](../next-app).

## Structure

- `src/pages/_app.tsx`: imports `@plume-ui-react/lib/styles.css` and wraps every page in `<ThemeProvider>` with the custom theme.
- `src/theme.ts`: the theme overrides. It replaces the `primary` palette and adds a custom `salmon` color scheme.
- `typings.d.ts`: extends `ColorPalette` (module augmentation on `@plume-ui-react/core`) so TypeScript accepts `colorScheme="salmon"`.
- `src/components/ButtonList.tsx`: Plume buttons with built-in variants, the custom `salmon` scheme, a busy state and Tailwind classes on `variant="unstyled"`.

See [Colors › Customization](https://darioegb.github.io/plume-ui-react/?path=/docs/theme-colors--docs) in the docs for the same steps.

## Run locally

From the repository root, build the packages once and start the example:

```bash
pnpm install
pnpm build
pnpm --filter next-pages dev
```

Then open <http://localhost:3000>.
