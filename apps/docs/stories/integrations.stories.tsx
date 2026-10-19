import type { Meta, StoryObj } from '@storybook/react-vite'
import type { CSSProperties } from 'react'
import { Button, Input } from 'plume-ui-react'

/**
 * Plume is **CSS-framework agnostic**. Components ship their own scoped styles,
 * but they are designed to drop into any stack:
 *
 * ### Vite and Next.js
 *
 * Wrap your app in `<ThemeProvider>` and import the stylesheet once. These examples show where the provider goes in each setup:
 * <a href="https://github.com/darioegb/plume-ui-react/tree/main/apps/example-vite" target="_blank" rel="noopener noreferrer">Vite</a>, <a href="https://github.com/darioegb/plume-ui-react/tree/main/apps/example-next-app" target="_blank" rel="noopener noreferrer">Next.js App Router</a> and <a href="https://github.com/darioegb/plume-ui-react/tree/main/apps/example-next-pages" target="_blank" rel="noopener noreferrer">Next.js Pages Router</a>.
 *
 * ### Tailwind CSS
 *
 * Components work as-is next to Tailwind, and `variant="unstyled"` lets you style
 * them with utilities. To use Plume tokens as utilities in your own markup, map the
 * CSS variables emitted by `<ThemeProvider>` in your `tailwind.config.ts`:
 *
 * ```ts
 * export default {
 *   darkMode: ['class', '[data-plume-color-mode="dark"]'],
 *   content: ['./src/**\/*.{ts,tsx}'],
 *   theme: {
 *     extend: {
 *       colors: {
 *         primary: {
 *           DEFAULT: 'var(--plume-color-primary-500)',
 *           solid: 'var(--plume-color-primary-solid)',
 *           'on-solid': 'var(--plume-color-primary-solid-contrast)',
 *           text: 'var(--plume-color-primary-text)',
 *         },
 *         surface: 'var(--plume-surface)',
 *         foreground: 'var(--plume-foreground)',
 *         border: 'var(--plume-border)',
 *       },
 *       borderRadius: { 4: 'var(--plume-radius-4)' },
 *     },
 *   },
 * }
 * ```
 *
 * Because the utilities resolve to the live CSS variables, they re-theme
 * automatically and flip in dark mode. Wrap your app in `<ThemeProvider>` for the
 * variables to resolve. Every token is available as `--plume-<group>-<name>`
 * (e.g. `--plume-color-primary-500`, `--plume-space-4`, `--plume-shadow-md`).
 *
 * For filled surfaces use `solid` with `on-solid`, and for colored text use `text`:
 * unlike the raw `500` shade, they are derived to meet WCAG AA (4.5:1) in light and
 * dark.
 *
 * ### Bootstrap / any other framework (bring your own className)
 *
 * Use `variant="unstyled"` on any component to strip Plume styling and pass the
 * framework's own classes:
 *
 * ```tsx
 * <Button variant="unstyled" className="btn btn-primary">Save</Button>
 * <Input variant="unstyled" className="form-control" />
 * ```
 */
const meta: Meta = {
  title: 'Guides/Framework Integration',
  parameters: {
    layout: 'fullscreen',
    options: { showPanel: false },
  },
  tags: ['autodocs'],
}

export default meta

type Story = StoryObj

// Literal class strings so Tailwind's content scanner can detect them.
const badges = [
  'bg-primary-solid text-primary-on-solid',
  'bg-secondary-solid text-secondary-on-solid',
  'bg-info-solid text-info-on-solid',
  'bg-warning-solid text-warning-on-solid',
  'bg-error-solid text-error-on-solid',
  'bg-success-solid text-success-on-solid',
]

/**
 * These elements use Tailwind utilities backed by Plume CSS variables, through the
 * preset this Storybook uses internally. They follow the theme and dark mode toggle.
 */
export const TailwindPreset: Story = {
  render: () => (
    <div className='flex flex-col gap-4 p-4'>
      <div className='bg-surface text-foreground border border-border rounded-4 p-4 shadow-md'>
        <p className='mb-3 font-semibold'>Surface card — bg-surface / text-foreground / border-border</p>
        <div className='flex flex-wrap gap-2'>
          {badges.map((className) => (
            <span className={`rounded-full px-3 py-1 text-sm ${className}`} key={className}>
              {className.split(' ')[0].replace('bg-', '').replace('-solid', '')}
            </span>
          ))}
        </div>
      </div>
      <div className='bg-surface-muted text-muted rounded-4 p-4'>
        bg-surface-muted / text-muted — muted panel that adapts to dark mode
      </div>
    </div>
  ),
}

/**
 * Plume components with `variant="unstyled"` styled entirely by Bootstrap
 * classes (Bootstrap CSS is loaded globally in this Storybook).
 */
export const Bootstrap: Story = {
  render: () => (
    <div className='d-flex flex-column gap-3 p-4' style={{ maxWidth: 420 }}>
      <Button className='btn btn-primary' variant='unstyled'>
        Bootstrap primary
      </Button>
      <Button
        className='btn btn-outline-secondary'
        style={{ '--bs-btn-color': 'var(--bs-secondary-text-emphasis)' } as CSSProperties}
        variant='unstyled'
      >
        Bootstrap outline
      </Button>
      <Input className='form-control' placeholder='Bootstrap input' variant='unstyled' />
    </div>
  ),
}
