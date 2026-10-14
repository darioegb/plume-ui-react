import type { Meta, StoryObj } from '@storybook/react-vite'
import { Button, Input } from '@plume-ui-react/lib'

/**
 * Plume is **CSS-framework agnostic**. Components ship their own scoped styles,
 * but they are designed to drop into any stack:
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
 *           contrast: 'var(--plume-color-primary-contrast)',
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
  'bg-primary-500 text-primary-contrast',
  'bg-secondary-500 text-secondary-contrast',
  'bg-info-500 text-info-contrast',
  'bg-warning-500 text-warning-contrast',
  'bg-error-500 text-error-contrast',
  'bg-success-500 text-success-contrast',
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
              {className.split(' ')[0].replace('bg-', '').replace('-500', '')}
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
      <Button className='btn btn-outline-secondary' variant='unstyled'>
        Bootstrap outline
      </Button>
      <Input className='form-control' placeholder='Bootstrap input' variant='unstyled' />
    </div>
  ),
}
