# Plume UI React — Vite example

A client-only [Vite](https://vite.dev) + React SPA that consumes the **published npm
package** (`plume-ui-react`), not the workspace sources. It demonstrates a slice of
the same simulated Plume Projects product as the Next.js example, without a server
or authentication. Storybook is the component gallery.

[![Open in StackBlitz](https://developer.stackblitz.com/img/open_in_stackblitz.svg)](https://darioegb.github.io/plume-ui-react/?path=/docs/guides-examples--docs)

## Run locally

```bash
npm install
npm run dev
```

The example uses Vite 7: the WASM build of Rolldown, which Vite 8 needs, does not load in StackBlitz.

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
- The new project form uses [react-hook-form](https://react-hook-form.com/) as the
  [Forms guide](https://darioegb.github.io/plume-ui-react/?path=/docs/guides-forms--docs) describes: `register` for
  `Input` and `Textarea`, `Controller` for `Select`, `DatePicker` and `RadioGroup`, and the messages of `formState.errors`
  in the `errorText` of each `Field`. The rules live in `src/lib/validation.ts` and return translation keys.
- English and Spanish with [react-i18next](https://react.i18next.com/): the resources are in `src/i18n/` (`es.ts` is typed
  with the keys of `en.ts`). `LocaleProvider` in `src/providers.tsx` takes the `PlumeMessages` built from `t` and the
  language, so the texts of Plume (the paginator, the date picker, the select, the toasts...) and the format of the
  dates follow the language (see
  [Internationalization](https://darioegb.github.io/plume-ui-react/?path=/docs/guides-internationalization--docs)). The
  language switcher is in the top bar; the choice is stored locally, and the first visit follows the browser. Dates and
  numbers use `Intl` with the current language. The names and descriptions of the projects are data, not interface, so
  they are not translated.
- `ThemeProvider`, `ToastProvider`, `LocaleProvider`, and only the CSS of the components it uses (see
  [Plume with Bootstrap 5](#plume-with-bootstrap-5)); the Next.js
  example loads the whole `plume-ui-react/styles.css` instead. `src/theme.ts` defines the brand palettes and a
  custom `salmon` color scheme (the visibility badge of the project detail uses it), and `src/plume-ui.d.ts` extends `ColorPalette`
  (see [Colors › Customization](https://darioegb.github.io/plume-ui-react/?path=/docs/theme-colors--docs)).

It installs `plume-ui-react` `^0.47.0` from npm.

## Plume with Bootstrap 5

The layout of the app and its own surfaces use [Bootstrap 5](https://getbootstrap.com) (CSS only: no JavaScript, no
React-Bootstrap, no Sass), while every Plume component keeps its own look: none uses `variant='unstyled'`.
The [Next.js example](../example-next-app) uses Tailwind CSS 4 instead.

- **Bootstrap for the page, Plume for the components.** The shell, the page headers, the dashboard grid (`row`,
  `row-cols-*`, `col`), the rows of the active projects, the toolbar and the activity list (`list-group`) are Bootstrap
  classes (`d-flex`, `gap-*`, `p-*`, `fw-*`, `text-body-secondary`, `container-fluid`, `visually-hidden`...). Only what
  Bootstrap can't express stays in a CSS module: the sidebar-aware brand, the sticky top bar, the widths of the
  filters, the definition grid of the detail drawer.
- **Cascade layers.** `src/styles.css` is imported first from `src/main.tsx`. It declares
  `@layer reset, base, plume, components, utilities;` and imports `bootstrap/dist/css/bootstrap.min.css` with
  `layer(reset)`, so the order is Bootstrap, then Plume, then the CSS of the app (no layer), which wins over both.
  Bootstrap's reboot is a reset, and a reset with no layer would beat Plume (`button { padding: 0 }` would strip the
  buttons); in `reset` it sits below it and the Plume components keep their styles. The per-component files of Plume
  repeat the declaration of the layers, which does not change the order the first one set.
- **Utilities win.** Bootstrap's utilities are `!important`, and for `!important` the order of the layers is reversed:
  a utility in `reset` beats the styles of Plume and the unlayered CSS of the app. Put utilities on the elements of the
  app (wrappers, `div`s) and use them on a Plume component (`p-0`, `ms-sm-auto`) only for what you do want to
  override. Bootstrap's component classes (`row`, `col`, `list-group`, `container-fluid`) are not `!important` and
  lose to the CSS of the app, as expected.
- **Dark mode.** Bootstrap 5.3 reads `data-bs-theme`; Plume reads `data-plume-color-mode`. `BootstrapColorMode`
  (`src/components/bootstrap-color-mode.tsx`), inside `ThemeProvider` in `src/providers.tsx`, copies the resolved
  color mode of `useTheme()` to `data-bs-theme` on `<html>`. The resolved mode is never `system`: Plume resolves it
  with `prefers-color-scheme` and follows its changes, so the Bootstrap surfaces do too. The CSS of the app uses the
  `--plume-*` tokens; the `--bs-*` variables are only reached through Bootstrap classes.
- **Per-component CSS.** `src/main.tsx` imports `plume-ui-react/tokens.css` and one `plume-ui-react/css/<component>.css`
  per component the app uses, so the bundle carries only those. Each of those files is inside `@layer plume`.

This is a demo, not a production backend: validation and persistence run in the
browser. If browser storage is unavailable, changes last only for the current
session and a warning is logged in the browser console.
