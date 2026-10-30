# Plume UI React — Next.js App Router example

A [Next.js](https://nextjs.org) **App Router** app that consumes the **published npm
package** (`plume-ui-react` `^0.47.0`, the 1.0 contract: parts, `unstyled`, `@layer plume`,
`labels` and `LocaleProvider`) next to **Tailwind CSS 4**. It is a small project dashboard ("Plume Projects") with a
simulated sign in, a sidebar, a top bar and a dashboard, and it shows that
`<ThemeProvider>` is **SSR/RSC-safe**: the theme is serialized to CSS variables and
server-rendered from a cookie, so dark mode has no flash and no per-request global state
leaks between users. It is also translated to **English and Spanish** with
[next-intl](https://next-intl.dev), without locale-prefixed routes, and Plume's own texts
(paginator, date picker, toasts...) follow the language through `<LocaleProvider>`. It grows
with each step of the 1.0 plan.

Sign in with any email and a password of 6 or more characters. The color mode follows the browser's color scheme until you pick light or dark (top bar or Settings); with `system` the server renders light and the client switches on hydration, so a dark browser can flash on the very first visit. The language follows the `Accept-Language` header of the browser until you pick one with the `EN`/`ES` switcher of the top bar (or of the sign in page), which saves it in a cookie.

## Plume + Tailwind CSS 4

Every Plume component keeps its own look (none uses `variant="unstyled"`); Tailwind styles the layout and the
surfaces of the app itself. The Vite example shows the other case: it styles Plume with **Bootstrap 5** instead.

- **Layer order.** `src/app/globals.css` starts with `@layer theme, base, plume, components, utilities;` and then
  imports `tailwindcss`, `plume-ui-react/styles.css` and `./plume-theme.css`. Tailwind's preflight lives in `base`, which
  comes before `plume`, so it normalizes the page without stripping the buttons and inputs of Plume; the utilities
  come after `plume`, so `className="ms-auto mt-4 max-sm:w-full"` on a Plume component always wins.
- **Theme file.** `src/app/plume-theme.css` is the Tailwind theme of Plume, copied from the
  [Framework integration](https://darioegb.github.io/plume-ui-react/?path=/docs/guides-framework-integration--docs)
  guide. It turns the `--plume-*` tokens into utilities (`bg-surface`, `text-muted`, `border-border`,
  `bg-primary-solid`, `text-primary-on-solid`, `rounded-2`, `shadow-lg`, `text-heading-*`, `text-body-sm`...) with
  `@theme inline`, so they follow the brand color of Settings and the color mode.
- **`dark:` variant.** The `@custom-variant dark` line of `globals.css` makes `dark:` follow the
  `data-plume-color-mode='dark'` attribute that `<ThemeProvider>` renders (the cookie, the toggle and Settings), not the
  system preference. The tokens already change with the mode, so `dark:` is only needed for what they don't cover, like
  the ring of the scroll to top button.
- **Utilities for layout, a CSS module for the rest.** The pages use `flex`, `grid`, `gap-*`, `p-*`, responsive
  prefixes (`md:`, `max-sm:`) and the text styles of the theme. The only `.module.css` left is
  `src/components/app-shell.module.css`, which hides the name of the brand when the sidebar collapses to a rail: it
  depends on an attribute of a Plume part, and a CSS rule says that better than a utility. The `appear` animation of the
  scroll to top button is in `@theme` of `globals.css`.
- Server Components stay Server Components: the utilities are plain classes, and Tailwind reads them at build time.

Preflight sets `line-height: 1.5` and makes buttons and inputs inherit the font, so the texts that Plume doesn't style
(the placeholder of an `Input`, the label of a `Button`) take the font of the page.

## Structure

- `postcss.config.mjs` — the `@tailwindcss/postcss` plugin, as in the Next.js guide.
- `src/app/layout.tsx` — Server Component. Reads the color mode cookie and the locale, sets `<html lang>`, imports
  `globals.css` (Tailwind and the whole `plume-ui-react/styles.css`; the Vite example loads one stylesheet per
  component instead) and wraps the app in `<NextIntlClientProvider>` and `<Providers>`.
- `src/app/providers.tsx` — `'use client'` boundary that renders `<ThemeProvider>`, `<PlumeLocale>` and
  `<ToastProvider>`.
- `src/i18n` — `config.ts` has the locales, the cookie name and the `Accept-Language` negotiation, and
  `request.ts` is the next-intl request config: cookie, then `Accept-Language`, then English. There is no
  `[locale]` segment and no middleware, so the URLs do not change. `messages/en.json` and `messages/es.json` have
  the same keys (typed through `src/global.d.ts`), with a `plume` namespace for the texts of the library.
- `src/components/plume-locale.tsx` — `'use client'` bridge: maps the `plume` messages to the `PlumeMessages` of
  `<LocaleProvider>`, memoized, and passes the locale of next-intl (imported as `useIntlLocale`, because Plume
  exports its own `useLocale`).
- `src/components/language-switcher.tsx` — a `Dropdown` that calls the `saveLocale` Server Action; the cookie change
  makes Next render the page again in the new language.
- `src/app/login` — the sign in page: `Card`, `Field`, `Input` and `Alert`, with a Server
  Action that validates the form. The Server Actions return the keys of the `validation` messages and the
  client translates them, so the server code has no language.
- `src/app/(app)` — the pages behind the session: the layout redirects to `/login`, and
  the dashboard is a Server Component made of `Card`, `Badge` and `ProgressBar` (translated with `getTranslations`),
  with a `Skeleton` while its data loads.
- `src/components/app-shell.tsx` — `'use client'` shell: `Sidebar`, `Navbar`, `Breadcrumb`,
  a `Dropdown` account menu, the language switcher and the light/dark switch.
- `src/app/(app)/projects` — a `Table` with sorting, filters and paging, a detail `Drawer`, and a `Stepper` form to create a project (validated in the browser and again in a Server Action).
- `src/app/(app)/team` — a directory of `Card`s with `Avatar` presence, `Chip` skills, a `Popover` to contact and a `Tooltip`, a `Tree` by department, and an invite `Modal`.
- `src/app/(app)/settings` — an `Accordion` with the appearance (light/dark and a **brand color** that recolors the whole app, saved in a cookie and server-rendered), notifications and the workspace.
- `src/lib` — the simulated session and data (statuses, roles and skills are ids that the UI translates; project
  names and descriptions are content and stay as they are) and the date and number formatting with the current locale.
- `src/theme.ts` — the brand palettes for `primary` (the one in Settings) and a custom `salmon` color scheme, passed to `<ThemeProvider theme={...}>`.
- `src/plume-ui.d.ts` extends `ColorPalette` so TypeScript accepts `colorScheme="salmon"`,
  which the visibility badge of the project detail uses
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
