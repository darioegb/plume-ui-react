# Contributing to Plume UI React

Thanks for your interest in improving Plume UI React. Please read the [Code of Conduct](CODE_OF_CONDUCT.md) before taking part.

## Reporting issues

[Open an issue](https://github.com/darioegb/plume-ui-react/issues) for bugs, feature requests or questions. For bugs, include the package and version, what you expected, what happened, and a minimal reproduction (the [Vite playground on StackBlitz](https://stackblitz.com/github/darioegb/plume-ui-react/tree/main/examples/vite-playground) is a quick way to share one). For larger changes, open an issue to discuss them before sending a pull request.

## Setting up

Requirements: Node.js 20 (see `.nvmrc`) and pnpm (`corepack enable` picks the version pinned in `package.json`).

```sh
git clone https://github.com/<your-user>/plume-ui-react.git
cd plume-ui-react
pnpm install
pnpm dev   # Storybook at http://localhost:6006
```

The [root README](README.md#development) lists the available commands and the repository structure.

## Making changes

1. Fork the repository and create a branch from `main` (see [Branch names](#branch-names)).
2. Make your change. Component code, styles, stories and tests live together in `packages/components/<name>/src`.
3. Add or update tests, and stories when the change is visible in the docs.
4. Run `pnpm lint` and `pnpm test`, and check your change in Storybook.
5. If you changed a published package, run `pnpm changeset` and commit the generated file (see [Changesets](#changesets)).
6. Open a pull request against `main` describing what changed and why.

## Commit messages

Commits follow [Conventional Commits](https://www.conventionalcommits.org) and are checked by commitlint on every commit. Use a lowercase subject and, when it helps, the package as the scope:

```text
<type>(<scope>): <subject>
```

| Type | Use for | Example |
| --- | --- | --- |
| `feat` | A new feature | `feat(tabs): add a segment variant` |
| `fix` | A bug fix | `fix(input): fit addons on narrow screens` |
| `docs` | Documentation, stories, READMEs | `docs(button): add an icon-only example` |
| `refactor` | Code changes without behavior changes | `refactor(core): extract token serialization` |
| `perf` | Performance improvements | `perf(datepicker): memoize the month grid` |
| `test` | Adding or updating tests | `test(use-mask): cover escaped characters` |
| `chore` | Tooling, dependencies, maintenance | `chore: update storybook to 9.1` |
| `ci` | GitHub Actions workflows | `ci: cache the pnpm store` |

## Branch names

Name branches after the commit type: `feat/<topic>`, `fix/<topic>`, `docs/<topic>`, `chore/<topic>` (for example `fix/input-min-width`).

## Changesets

Releases are managed with [Changesets](https://github.com/changesets/changesets). A pull request that changes a published package (`@plume-ui-react/*`) needs a changeset describing the change and its version bump (`patch`, `minor` or `major`). Changes limited to the docs app, examples, stories or READMEs don't need one.

After a pull request is merged, the Release workflow opens a **Version packages** pull request; merging it publishes to npm.

## License

By contributing, you agree that your contributions are licensed under the project's [MIT License](LICENSE).
