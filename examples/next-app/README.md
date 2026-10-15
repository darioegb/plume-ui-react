# Plume UI React — Next.js App Router example

A [Next.js](https://nextjs.org) **App Router** app that consumes the **published npm
packages** (`@plume-ui-react/lib` and `@plume-ui-react/core`). It demonstrates that
`<ThemeProvider>` is **SSR/RSC-safe**: the theme is serialized to CSS variables and
server-rendered, with no flash and no per-request global state leaking between users.

## Structure

- `src/app/layout.tsx` — Server Component. Imports `@plume-ui-react/lib/styles.css`
  and wraps the app in `<Providers>`.
- `src/app/providers.tsx` — `'use client'` boundary that renders `<ThemeProvider>`.
- `src/app/page.tsx` — Server Component that renders the client `<Demo />`.
- `src/app/demo.tsx` — `'use client'` interactive showcase (`useTheme()` + components).

## Run locally

```bash
npm install
npm run dev
```

## Live demo

<https://plume-ui-react.vercel.app>

## Deploy to Vercel (free Hobby plan)

1. Push this repo to GitHub (already done).
2. In [Vercel](https://vercel.com/new), import `darioegb/plume-ui-react`.
3. Set **Root Directory** to `examples/next-app`.
4. Deploy. The bundled `vercel.json` pins the framework to **Next.js** and the
   install/build commands to **npm**.

This example is excluded from the pnpm workspace and ships its own
`package-lock.json`, so `vercel.json` makes Vercel run `npm install` inside this
folder instead of a workspace-wide `pnpm install` at the repo root. That installs
`@plume-ui-react/*` from npm — exactly what a real consumer would get — and avoids
the root `pnpm-lock.yaml` (which pnpm 12 writes as a multi-document file that
Vercel's bundled pnpm can't parse).
