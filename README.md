<p align="center">
  <a href="https://github.com/chakra-ui/chakra-ui">
    <img src="https://res.cloudinary.com/dyjeeqbka/image/upload/v1691691368/vy4lo0kyx29t44p3nefp.svg" alt="Chakra logo" width="300" />
  </a>
</p>

<h1 align="center">A Lightweight Design System for React</h1>

![npm package minimized gzipped size (select exports)](https://img.shields.io/bundlejs/size/@plume-ui-react)
![NPM](https://img.shields.io/npm/l/%40plume-ui-react%2Flib)


## Table of Contents

- 📚 [Documentation](#documentation)
- 📦 [Installation](#installation)
- 🖥️ [Technologies](#technologies)
- 🏃 [How to Run](#how-to-run)
- 🧪 [Run Tests](#run-tests)
- 🐛 [Found a bug? Missing a specific feature?](#issues)
- ✍️ [Contributing](#contributing)
- 📖 [Project definition](#project-definition)
- 🌟 [Contributors](#contributors)
- ⚖️ [License](#license)

## Documentation

Not deployed yet❕

## Installation

To use Plume UI React components, all you need to do is install the @plume-ui-react package and its peer dependencies:

```sh
  # with npm
  $ npm install @plume-ui-react
  # with yarn
  $ yarn add @plume-ui-react
  # with pnpm
  $ pnpm @plume-ui-react
```

## Technologies

This guide explains how to use a React design system starter powered by:

- 🏎 [Turborepo](https://turbo.build/repo) — High-performance build system for Monorepos
- 🚀 [React](https://reactjs.org/) — JavaScript library for user interfaces
- 🛠 [Tsup](https://github.com/egoist/tsup) — TypeScript bundler powered by esbuild
- 📖 [Storybook](https://storybook.js.org/) — UI component environment powered by Vite

As well as a few others tools preconfigured:

- [TypeScript](https://www.typescriptlang.org/) for static type checking
- [ESLint](https://eslint.org/) for code linting
- [Prettier](https://prettier.io) for code formatting
- [Changesets](https://github.com/changesets/changesets) for managing versioning and changelogs
- [GitHub Actions](https://github.com/changesets/action) for fully automated package publishing

Others tools preconfigured for docs an examples projects:

- 🎨 [TailwindCss](https://tailwindcss.com/) - Utility-first CSS framework for rapidly building modern websites

## How to run

Run the following command for run docs:

```sh
turbo run dev --filter docs
```

Or use this one for run examples projects:

```sh
turbo run dev --filter='./examples/*'
```

### Useful Commands

- `pnpm build` - Build all packages, including the Storybook site
- `pnpm dev` - Run all packages locally and preview with Storybook
- `pnpm lint` - Lint all packages
- `pnpm test` - Run package tests (you can also run separately on each package)
- `pnpm changeset` - Generate a changeset
- `pnpm clean` - Clean up all `node_modules` and `dist` folders (runs each package's clean script)

## Run Tests

```bash
# Install dependencies if you didn't
# Run tests
$ pnpm run test

# Run test coverage
$ pnpm run test:coverage
```

## Issues

Certainly! Here's a rephrased version of your content:

"Please don't hesitate to open a new issue on the [Plume UI React](https://github.com/darioegb/plume-ui-react/issues) repository. Just provide a suitable title and description. If you've already resolved your issue and want to contribute, I'd be delighted to examine your pull request!"

## Contributing

Thank you for your interest in contributing to the Plume UI React project! Your collaboration is valuable in enhancing our Design System and making it even better. Here's how you can contribute:

### Creating a Pull Request

If you already have a solution for an issue or an enhancement you'd like to implement, we're excited to see it! Follow these steps to submit a Pull Request:

1. [Fork](https://docs.github.com/en/get-started/quickstart/fork-a-repo) the Plume UI React repository to your GitHub account.
2. Clone your fork to your local machine: `git clone https://github.com/darioegb/plume-ui-react.git`.
3. Create a new branch for your contribution: `git checkout -b my-contribution`.
4. Make your changes and ensure they adhere to our [style and contribution guidelines](CONTRIBUTING.md).
5. Push your changes to your GitHub repository: `git push origin my-contribution`.
6. Open a Pull Request from your branch to the main branch of the original repository.

Our team will review your Pull Request and work with you to merge your contributions into the Design System.

### Welcoming Contributors

We value all our contributors, regardless of their level of experience. If you're new to contributing to open-source projects or design systems, don't hesitate to reach out if you need guidance or assistance. We're here to help you succeed!

Thank you for being a part of the My Turbo Components community and for helping us build a robust and efficient Design System.

## Project definition

### Turborepo

[Turborepo](https://turbo.build/repo) is a high-performance build system for JavaScript and TypeScript codebases. It was designed after the workflows used by massive software engineering organizations to ship code at scale. Turborepo abstracts the complex configuration needed for monorepos and provides fast, incremental builds with zero-configuration remote caching.

Using Turborepo simplifies managing your design system monorepo, as you can have a single lint, build, test, and release process for all packages. [Learn more](https://vercel.com/blog/monorepos-are-changing-how-teams-build-software) about how monorepos improve your development workflow.

### Apps & Packages

This Turborepo includes the following packages and applications:

- `apps/docs`: Component documentation site with Storybook
- `examples`: Projects examples using the library
- `packages/components/<component-name>`: Component package
- `packages/components/lib`: UI Components library package
- `packages/core`: Core UI Features
- `packages/types`: Definitions of types
- `packages/utilities/<utility-name>`: Utility package
- `packages/tsconfig`: Shared `tsconfig.json`s used throughout the Turborepo
- `packages/eslint-config-custom`: ESLint preset
- `packages/jest-preset`: Jest preset
- `packages/prettier-config`: Prettier preset

Each package and app is 100% [TypeScript](https://www.typescriptlang.org/). Workspaces enables us to "hoist" dependencies that are shared between packages to the root `package.json`. This means smaller `node_modules` folders and a better local dev experience. To install a dependency for the entire monorepo, use the `-w` workspaces flag with `pnpm add`.

This example sets up your `.gitignore` to exclude all generated files, other folders like `node_modules` used to store your dependencies.

### Compilation

To make the core library code work across all browsers, we need to compile the raw TypeScript and React code to plain JavaScript. We can accomplish this with `tsup`, which uses `esbuild` to greatly improve performance.

Running `pnpm build` from the root of the Turborepo will run the `build` command defined in each package's `package.json` file. Turborepo runs each `build` in parallel and caches & hashes the output to speed up future builds.

For `button`, the `build` command (`tsup`) use the component level setup:

```typescript
export default defineConfig((options) => ({
  entry: ['src/index.ts'],
  dts: true,
  sourcemap: false,
  clean: true,
  minify: !options.watch,
  format: ['cjs', 'esm'],
  target: 'es2020',
  tsconfig: 'tsconfig.json',
  external: ['react'],
  esbuildPlugins: [
    {
      name: 'css-module',
      setup(build): void {
        build.onResolve(
          { filter: /\.module\.css$/, namespace: 'file' },
          (args) => ({
            path: `${args.path}#css-module`,
            namespace: 'css-module',
            pluginData: {
              pathDir: path.join(args.resolveDir, args.path),
            },
          }),
        )
        build.onLoad(
          { filter: /#css-module$/, namespace: 'css-module' },
          async (args) => {
            const { pluginData } = args as {
              pluginData: { pathDir: string }
            }
            const source = await fsPromises.readFile(pluginData.pathDir, 'utf8')
            let cssModule = {}
            const result = await postcss([
              postcssModules({
                getJSON(_, json) {
                  cssModule = json
                },
              }),
            ]).process(source, { from: pluginData.pathDir })
            return {
              pluginData: { css: result.css },
              contents: `import "${
                pluginData.pathDir
              }"; export default ${JSON.stringify(cssModule)}`,
            }
          },
        )
        build.onResolve(
          { filter: /\.module\.css$/, namespace: 'css-module' },
          (args) => ({
            path: path.join(args.resolveDir, args.path, '#css-module-data'),
            namespace: 'css-module',
            pluginData: args.pluginData as { css: string },
          }),
        )
        build.onLoad(
          { filter: /#css-module-data$/, namespace: 'css-module' },
          (args) => ({
            contents: (args.pluginData as { css: string }).css,
            loader: 'css',
          }),
        )
      },
    },
  ],
}))
```

`tsup` compiles `src/index.tsx`, which exports all of the components in the design system, into both ES Modules and CommonJS formats as well as their TypeScript types. The `package.json` for `any package, e.g button` then instructs the consumer to select the correct format:

```json:button/package.json
{
  "name": "@plume-ui-react/button",
  "version": "0.0.0",
  "main": "./dist/index.js",
  "module": "./dist/index.mjs",
  "types": "./dist/index.d.ts",
  "sideEffects": [
    "**/*.module.css"
  ],
  "license": "MIT",
  "files": [
    "dist/**"
  ],
}
```

Run `pnpm build` to confirm compilation is working correctly. You should see a folder `packages/components/button/dist` which contains the compiled output.

```bash
packages
  components
  └── button
    └── dist
        ├── index.css   <-- Styles
        ├── index.d.ts  <-- Types
        ├── index.d.mts  <-- Types ES  Module format
        ├── index.js    <-- CommonJS version
        └── index.mjs   <-- ES Modules version
```

### Components

Each file inside of `packages/components` is a component inside our design system. For example:

```bash
  apps
    ...
  packages
    components
      └── button
      └── spinner
  ...
```

### Storybook

Storybook provides us with an interactive UI playground for our components. This allows us to preview our components in the browser and instantly see changes when developing locally. This example preconfigures Storybook to:

- Use Vite to bundle stories instantly (in milliseconds)
- Automatically find any stories inside the `stories/` folder
- Write MDX for component documentation pages

For example, here's the included Story for our `Button` component:

```ts:apps/docs/stories/button.stories.tsx
import React from 'react'
import type { StoryObj, Meta } from '@storybook/react'
// others imports ...

/**
 * Enhance user interactions with the Button component,
 * featuring customizable styles for triggering actions within forms, dialogs, and other contexts.
 * With support for various sizes and states,
 * it facilitates actions such as form submissions, dialog interactions, and deletion or cancellation operations.
 */
export default {
  title: 'Components/Interaction/Button',
  component: Button,
  tags: ['autodocs'],
  parameters: {
    docs: {
      page: () => DocsTemplate('Button'), // don't forget adding this to new component documentation
      toc: {
        title: 'On this page',
        disable: false,
      },
    },
    layout: 'centered',
  },
  argTypes: {
    children: {
      control: 'object',
      description: 'Content of the button (text, HTML elements, etc.).',
      table: {
        type: { summary: 'ReactNode' },
      },
    },
    // others argTypes ...
  },
  args: {
    disabled: false,
    busy: false,
  },
} satisfies Meta<typeof Button>

type Story = StoryObj<typeof Button>

/**
 * This is the default button with only setting a **label** prop.
 */
export const Default: Story = {
  args: {
    label: 'Default Button',
  },
}

// Others stories ...

```

This example includes a few helpful Storybook scripts:

- `pnpm dev`: Starts Storybook in dev mode with hot reloading at `localhost:6006`
- `pnpm build`: Builds the Storybook UI and generates the static HTML files
- `pnpm preview-storybook`: Starts a local server to view the generated Storybook UI

### Versioning & Publishing Packages

This example uses [Changesets](https://github.com/changesets/changesets) to manage versions, create changelogs, and publish to npm. It's preconfigured so you can start publishing packages immediately.

You'll need to create an `NPM_TOKEN` and `GITHUB_TOKEN` and add it to your GitHub repository settings to enable access to npm. It's also worth installing the [Changesets bot](https://github.com/apps/changeset-bot) on your repository.

### Generating the Changelog

To generate your changelog, run `pnpm changeset` locally:

1. **Which packages would you like to include?** – This shows which packages and changed and which have remained the same. By default, no packages are included. Press `space` to select the packages you want to include in the `changeset`.
1. **Which packages should have a major bump?** – Press `space` to select the packages you want to bump versions for.
1. If doing the first major version, confirm you want to release.
1. Write a summary for the changes.
1. Confirm the changeset looks as expected.
1. A new Markdown file will be created in the `changeset` folder with the summary and a list of the packages included.

### Releasing

When you push your code to GitHub, the [GitHub Action](https://github.com/changesets/action) will run the `release` script defined in the root `package.json`:

```bash
turbo run build --filter=docs^... && changeset publish
```

Turborepo runs the `build` script for all publishable packages (excluding docs) and publishes the packages to npm. By default, this example includes `@plume-ui-react` as the npm organization. To change this, do the following:

To publish packages to a private npm organization scope, **remove** the following from each of the `package.json`'s

```diff
- "publishConfig": {
-  "access": "public"
- },
```

Inside that directory, you can run several commands:

`pnpm run build`
Build all apps and packages

`pnpm run dev`
Develop all apps and packages

`pnpm run lint`
Lint all apps and packages

Turborepo will cache locally by default. For an additional
speed boost, enable Remote Caching with Vercel by
entering the following command:

`pnpm dlx turbo login`

We suggest that you begin by typing:

```
cd plume-ui-react
pnpm dlx turbo login
```

## Contributors

Thanks goes to these wonderful people

<!-- ALL-CONTRIBUTORS-LIST:START - Do not remove or modify this section -->
<!-- prettier-ignore-start -->
<!-- markdownlint-disable -->
<table>
  <tbody>
    <tr>
      <td align="center" valign="top" width="14.28%"><a href="https://github.com/darioegb"><img src="https://avatars2.githubusercontent.com/u/1558318?v=4?s=64" width="64px;" alt="Darío Gonzalez"/><br /><sub><b>Darío Gonzalez</b></sub></a><br /><a href="https://github.com/plume-ui-react/plume-ui-react/commits?author=darioegb" title="Code">💻</a> <a href="#maintenance-darioegb" title="Maintenance">🚧</a> <a href="https://github.com/plume-ui-react/commits?author=darioegb" title="Documentation">📖</a> <a href="#example-darioegb" title="Examples">💡</a></td>
    </tr>
  </tbody>
</table>

## License

This library is open-source and available under the [MIT License](./LICENSE) made by [Dario Gonzalez](https://github.com/darioegb) 🎸. You are free to use and modify it in your projects.
