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
- `ThemeProvider`, `ToastProvider`, `LocaleProvider`, and only the CSS of the components it uses, one
  `plume-ui-react/css/<component>.css` import each in `src/main.tsx` (the Next.js
  example loads the whole `plume-ui-react/styles.css` instead). `src/theme.ts` defines the brand palettes and a
  custom `salmon` color scheme (the visibility badge of the project detail uses it), and `src/plume-ui.d.ts` extends `ColorPalette`
  (see [Colors › Customization](https://darioegb.github.io/plume-ui-react/?path=/docs/theme-colors--docs)).

It installs `plume-ui-react` `^0.47.0` from npm.

This is a demo, not a production backend: validation and persistence run in the
browser. If browser storage is unavailable, changes last only for the current
session and a warning is logged in the browser console.
