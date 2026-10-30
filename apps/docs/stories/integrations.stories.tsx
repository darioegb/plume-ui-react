import type { Meta, StoryObj } from '@storybook/react-vite'
import type { CSSProperties } from 'react'
import { Button, Input } from 'plume-ui-react'

const meta: Meta = {
  title: 'Guides/Framework Integration',
  parameters: {
    layout: 'fullscreen',
    options: { showPanel: false },
  },
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
 * Tailwind utilities backed by the variables of Plume, through `plume-ui-react/tailwind.css`, the same file this
 * Storybook uses. They follow the theme and the color mode.
 */
export const Tailwind: Story = {
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
 * Plume components with `variant="unstyled"`, styled only by the classes of Bootstrap.
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
