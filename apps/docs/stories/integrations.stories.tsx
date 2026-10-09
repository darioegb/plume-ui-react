import type { Meta, StoryObj } from '@storybook/react-vite'
import { Button, Input } from '@plume-ui-react/lib'

/**
 * Plume is **CSS-framework agnostic**. Components ship their own scoped styles,
 * but they are designed to drop into any stack:
 *
 * ### Tailwind CSS (token preset)
 *
 * Add the Plume preset to your `tailwind.config.ts`:
 *
 * ```ts
 * import plumePreset from 'tailwind-config/tailwind.config'
 *
 * export default {
 *   presets: [plumePreset],
 *   content: ['./src/**\/*.{ts,tsx}'],
 * }
 * ```
 *
 * Every Plume token becomes a utility backed by a CSS variable from
 * `<ThemeProvider>`: `bg-primary-500`, `text-primary-contrast`, `bg-surface`,
 * `text-foreground`, `border-border`, `rounded-4`, `p-4`, `shadow-md`, `z-1`…
 * Because they resolve to the live CSS variables, they re-theme automatically
 * and flip in dark mode (`[data-plume-color-mode="dark"]`). Wrap your app in
 * `<ThemeProvider>` for the variables to resolve.
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
 * These elements use only Tailwind utilities from the Plume preset. They read
 * the same CSS variables as the components, so they follow the theme and dark
 * mode toggle.
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
