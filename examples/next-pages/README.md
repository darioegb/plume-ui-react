# Plume UI React — Next.js Pages Router example

A [Next.js](https://nextjs.org) **Pages Router** app that uses the Plume UI packages **from this workspace** (`workspace:*`), so it reflects unreleased changes. For an app that installs the published npm packages, see [`examples/next-app`](../next-app).

## Structure

- `src/pages/_app.tsx`: imports `@plume-ui-react/lib/styles.css` and wraps every page in `<ThemeProvider>`, overriding the primary color through the `theme` prop.
- `src/components/ButtonList.tsx`: Plume buttons with built-in variants, color schemes, a busy state and Tailwind classes on `variant="unstyled"`.

## Run locally

From the repository root, build the packages once and start the example:

```bash
pnpm install
pnpm build
pnpm --filter next-pages dev
```

Then open <http://localhost:3000>.
