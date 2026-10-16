<p align="center">
  <a href="https://darioegb.github.io/plume-ui-react/">
    <img src="https://darioegb.github.io/plume-ui-react/logo.svg" alt="" width="72" />
  </a>
</p>

<h1 align="center">Plume UI React</h1>

<p align="center">A lightweight design system for React</p>

<p align="center">
  <img alt="Bundle size" src="https://img.shields.io/bundlejs/size/%40plume-ui-react%2Flib" />
  <img alt="npm downloads" src="https://img.shields.io/npm/dm/%40plume-ui-react%2Flib" />
  <img alt="Last commit" src="https://img.shields.io/github/last-commit/darioegb/plume-ui-react" />
  <img alt="License" src="https://img.shields.io/npm/l/%40plume-ui-react%2Flib" />
  <a href="https://sonarcloud.io/summary/new_code?id=darioegb_plume-ui-react"><img alt="Quality Gate Status" src="https://sonarcloud.io/api/project_badges/measure?project=darioegb_plume-ui-react&metric=alert_status" /></a>
</p>

Components ship their own scoped styles and are themed entirely through CSS variables, so they adapt to your brand and switch between light and dark without runtime color math.

- **Themeable**: every design token is a CSS variable emitted by `<ThemeProvider>`.
- **Light & dark**: built in, driven by a single `colorMode`.
- **Framework-agnostic**: use the components as they are, or set `variant="unstyled"` and style them with Tailwind or Bootstrap.
- **Typed**: written in TypeScript, with React 18 and 19 support.

## Contents

- [Documentation](#documentation)
- [Installation](#installation)
- [Components](#components)
- [Examples](#examples)
- [Development](#development)
- [Releasing](#releasing)
- [Contributing](#contributing)
- [License](#license)

## Documentation

The [documentation site](https://darioegb.github.io/plume-ui-react/) has a live playground, props and examples for every component, plus the color palette, design tokens and framework integration guides.

## Installation

```sh
npm install @plume-ui-react/lib
# or
pnpm add @plume-ui-react/lib
# or
yarn add @plume-ui-react/lib
```

`@plume-ui-react/lib` includes every component and re-exports `@plume-ui-react/core` (`ThemeProvider`, `useTheme`, tokens and types), so it is the only package you need. `react` and `react-dom` are peer dependencies.

Import the stylesheet once and wrap your app in `<ThemeProvider>`:

```tsx
import '@plume-ui-react/lib/styles.css'
import { Button, ThemeProvider } from '@plume-ui-react/lib'

export function App() {
  return (
    <ThemeProvider defaultColorMode="light">
      <Button colorScheme="primary" label="Click me" />
    </ThemeProvider>
  )
}
```

## Components

| Component | Docs |
| --- | --- |
| Button | [Button](https://darioegb.github.io/plume-ui-react/?path=/docs/components-button--docs) |
| DatePicker | [DatePicker](https://darioegb.github.io/plume-ui-react/?path=/docs/components-datepicker--docs) |
| Input | [Input](https://darioegb.github.io/plume-ui-react/?path=/docs/components-input--docs) |
| Spinner | [Spinner](https://darioegb.github.io/plume-ui-react/?path=/docs/components-spinner--docs) |
| Tabs | [Tabs](https://darioegb.github.io/plume-ui-react/?path=/docs/components-tabs--docs) |

Each component is also published on its own (for example `@plume-ui-react/button`). With individual packages, install `@plume-ui-react/core` as well.

## Examples

Standalone apps that consume the **published npm packages** (not the workspace sources):

- **[Vite playground](examples/vite-playground)**: try the components live and edit the code.

  [![Open in StackBlitz](https://developer.stackblitz.com/img/open_in_stackblitz.svg)](https://stackblitz.com/github/darioegb/plume-ui-react/tree/main/examples/vite-playground)

- **[Next.js App Router](examples/next-app)**: SSR/RSC-safe `<ThemeProvider>` usage, deployed on Vercel.
- **[Next.js Pages Router](examples/next-pages)**: uses the workspace packages (`workspace:*`).

## Development

This is a [pnpm](https://pnpm.io) + [Turborepo](https://turborepo.com) monorepo. Packages are bundled with [tsup](https://tsup.egoist.dev), documented with [Storybook](https://storybook.js.org) and tested with [Jest](https://jestjs.io) and Testing Library.

Requirements: Node.js 20 (see `.nvmrc`) and pnpm (`corepack enable` picks the version pinned in `package.json`).

```sh
pnpm install
pnpm dev            # Storybook with hot reload at http://localhost:6006
```

| Command | Description |
| --- | --- |
| `pnpm dev` | Run the docs (Storybook) in development mode |
| `pnpm build` | Build every publishable package |
| `pnpm build:docs` | Build the packages and the static Storybook site (`apps/docs/storybook-static`) |
| `pnpm build:examples` | Build the example apps |
| `pnpm test` | Run the package tests |
| `pnpm test:coverage` | Run the tests with coverage |
| `pnpm lint` / `pnpm lint:fix` | Lint every package |
| `pnpm changeset` | Describe a change that should be released |
| `pnpm clean` | Remove build output and `node_modules` |

### Repository structure

```text
apps/
  docs/                      Storybook documentation site
examples/                    Example apps (Vite, Next.js App Router, Next.js Pages Router)
packages/
  components/<name>/         One package per component, with its stories and tests
  components/lib/            @plume-ui-react/lib: all components in a single package
  core/                      ThemeProvider, design tokens and shared types
  hooks/<name>/              Shared hooks (use-mask, use-debounce, use-click-outside)
  utilities/<name>/          Shared utilities (color, date, lazy, merge)
  tailwind-config/           Tailwind preset that maps the design tokens to utilities
  eslint-config-custom/      Shared ESLint config
  jest-preset/               Shared Jest preset
  tsconfig/                  Shared TypeScript configs
```

Component stories live next to each component (`packages/components/<name>/src/stories`) and are picked up by the docs app.

## Releasing

Versioning and publishing use [Changesets](https://github.com/changesets/changesets):

1. If a pull request changes a published package, add a changeset with `pnpm changeset` and commit the generated file. Changes to the docs, examples or stories don't need one.
2. When it is merged into `main`, the Release workflow opens (or updates) a **Version packages** pull request that bumps versions and updates the changelogs.
3. Merging that pull request publishes the new versions to npm.

The documentation site is deployed to GitHub Pages on every push to `main`.

## Contributing

Bug reports, ideas and pull requests are welcome. Please [open an issue](https://github.com/darioegb/plume-ui-react/issues) first for larger changes, and read the [contributing guidelines](CONTRIBUTING.md) and [code of conduct](CODE_OF_CONDUCT.md). Commit messages follow [Conventional Commits](https://www.conventionalcommits.org) (checked by commitlint).

## Contributors

<!-- ALL-CONTRIBUTORS-LIST:START - Do not remove or modify this section -->
<!-- prettier-ignore-start -->
<!-- markdownlint-disable -->
<table>
  <tbody>
    <tr>
      <td align="center" valign="top" width="14.28%"><a href="https://github.com/darioegb"><img src="https://avatars2.githubusercontent.com/u/1558318?v=4?s=64" width="64px;" alt="Darío Gonzalez"/><br /><sub><b>Darío Gonzalez</b></sub></a><br /><a href="https://github.com/darioegb/plume-ui-react/commits?author=darioegb" title="Code">💻</a> <a href="#maintenance-darioegb" title="Maintenance">🚧</a> <a href="https://github.com/darioegb/plume-ui-react/commits?author=darioegb" title="Documentation">📖</a> <a href="#example-darioegb" title="Examples">💡</a></td>
    </tr>
  </tbody>
</table>

## License

[MIT](./LICENSE) © [Dario Gonzalez](https://github.com/darioegb)
