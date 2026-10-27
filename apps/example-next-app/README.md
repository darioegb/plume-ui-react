# Plume UI React — Next.js App Router example

A [Next.js](https://nextjs.org) **App Router** app that consumes the **published npm
package** (`plume-ui-react`). It is a small project dashboard ("Plume Projects") with a
simulated sign in, a sidebar, a top bar and a dashboard, and it shows that
`<ThemeProvider>` is **SSR/RSC-safe**: the theme is serialized to CSS variables and
server-rendered from a cookie, so dark mode has no flash and no per-request global state
leaks between users. It grows with each step of the 1.0 plan.

Sign in with any email and a password of 6 or more characters.

## Structure

- `src/app/layout.tsx` — Server Component. Reads the color mode cookie, imports
  `plume-ui-react/styles.css` and wraps the app in `<Providers>`.
- `src/app/providers.tsx` — `'use client'` boundary that renders `<ThemeProvider>` and
  `<ToastProvider>`.
- `src/app/login` — the sign in page: `Card`, `Field`, `Input` and `Alert`, with a Server
  Action that validates the form.
- `src/app/(app)` — the pages behind the session: the layout redirects to `/login`, and
  the dashboard is a Server Component made of `Card`, `Badge` and `ProgressBar`, with a
  `Skeleton` while its data loads.
- `src/components/app-shell.tsx` — `'use client'` shell: `Sidebar`, `Navbar`, `Breadcrumb`,
  a `Dropdown` account menu and the light/dark switch.
- `src/app/(app)/projects` — a `Table` with sorting, filters and paging, a detail `Drawer`, and a `Stepper` form to create a project (validated in the browser and again in a Server Action).
- `src/app/(app)/settings` — an `Accordion` with the appearance (light/dark and a **brand color** that recolors the whole app, saved in a cookie and server-rendered), notifications and the workspace.
- `src/lib` — the simulated session and data.
- `src/theme.ts` — the brand palettes for `primary` (the one in Settings) and a custom `salmon` color scheme, passed to `<ThemeProvider theme={...}>`.
- `src/plume-ui.d.ts` extends `ColorPalette` so TypeScript accepts `colorScheme="salmon"`
  (see [Colors › Customization](https://darioegb.github.io/plume-ui-react/?path=/docs/theme-colors--docs)).

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
3. Set **Root Directory** to `apps/example-next-app`.
4. Deploy. The bundled `vercel.json` pins the framework to **Next.js** and the
   install/build commands to **npm**.

This example is excluded from the pnpm workspace and ships its own
`package-lock.json`, so `vercel.json` makes Vercel run `npm install` inside this
folder instead of a workspace-wide `pnpm install` at the repo root. That installs
`plume-ui-react` from npm — exactly what a real consumer would get — and avoids
the root `pnpm-lock.yaml` (which pnpm 12 writes as a multi-document file that
Vercel's bundled pnpm can't parse).
