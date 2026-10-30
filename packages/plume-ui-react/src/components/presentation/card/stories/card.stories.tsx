import type { StoryObj, Meta } from '@storybook/react-vite'
import { Button } from '../../../interaction/button'
import { Badge } from '../../badge'
import { Divider } from '../../divider'
import { Card, CardBody, CardFooter, CardHeader } from '..'

const sample = (
  <>
    <CardHeader>Weekly report</CardHeader>
    <CardBody>Your team closed 24 tickets this week, 6 more than the week before.</CardBody>
    <CardFooter>
      <Button label="View report" size="sm" />
    </CardFooter>
  </>
)

/**
 * A surface that groups related content. Compose it with `CardHeader`, `CardBody` and `CardFooter`, in any
 * combination: all three are optional. A Card is a plain container with no role of its own, so give it a
 * `role` and an `aria-label` only when it is a landmark or a group.
 *
 * Each part carries a `data-plume-card-*` attribute, and with `variant="unstyled"` the Card and its parts keep
 * only the classes you give them.
 *
 * `CardHeader` is a plain `<div>`, not a heading. When the title should show up in the outline of the page, put
 * a heading inside it (`<h3>`, at the level that fits the page).
 *
 * To make a card clickable, put a real link or button inside it. The Card doesn't take an `onClick`.
 */
export default {
  title: 'Components/Card',
  component: Card,
  tags: ['autodocs'],
  parameters: {
    docs: {
      importNames: ['Card', 'CardHeader', 'CardBody', 'CardFooter'],
      toc: {
        title: 'On this page',
        disable: false,
      },
    },
    layout: 'centered',
  },
  argTypes: {
    children: {
      control: false,
    },
    className: {
      control: 'text',
    },
    style: {
      control: false,
    },
    size: {
      control: 'radio',
      options: ['sm', 'md', 'lg'],
    },
    variant: {
      control: 'radio',
      options: ['elevated', 'outline', 'filled', 'unstyled'],
    },
    id: {
      control: false,
    },
    title: {
      control: 'text',
    },
    role: {
      control: 'text',
    },
    'aria-label': {
      control: 'text',
    },
    'aria-labelledby': {
      control: false,
    },
  },
  args: {
    style: { maxWidth: '100%', width: '20rem' },
  },
  render: (args) => <Card {...args}>{sample}</Card>,
} satisfies Meta<typeof Card>

type Story = StoryObj<typeof Card>

/**
 * This is the default Card, with a header, a body and a footer.
 */
export const Default: Story = {}

/**
 * Use the **variant** prop to pick how the Card looks: `elevated` floats it with a shadow, `outline` draws its
 * border and divides its parts, `filled` gives it a muted background, and `unstyled` drops the Plume styles so
 * you can style it yourself.
 */
export const Variants: Story = {
  parameters: {
    docs: {
      source: {
        code: `<div className="flex flex-wrap justify-center gap-6">
  <Card variant="elevated">
    <CardHeader>Elevated</CardHeader>
    <CardBody>A card with the elevated variant.</CardBody>
  </Card>
  <Card variant="outline">
    <CardHeader>Outline</CardHeader>
    <CardBody>A card with the outline variant.</CardBody>
  </Card>
  <Card variant="filled">
    <CardHeader>Filled</CardHeader>
    <CardBody>A card with the filled variant.</CardBody>
  </Card>
  <Card className="rounded-lg border border-gray-400" variant="unstyled">
    <CardHeader className="p-4 font-bold">Unstyled</CardHeader>
    <CardBody className="p-4 pt-0">A card with the unstyled variant.</CardBody>
  </Card>
</div>`,
      },
    },
  },
  render: () => (
    <div className="flex flex-wrap justify-center gap-6">
      {(['elevated', 'outline', 'filled'] as const).map((variant) => (
        <Card key={variant} style={{ maxWidth: '100%', width: '16rem' }} variant={variant}>
          <CardHeader>{variant[0].toUpperCase() + variant.slice(1)}</CardHeader>
          <CardBody>A card with the {variant} variant.</CardBody>
        </Card>
      ))}
      <Card
        className="border border-gray-400 rounded-lg"
        style={{ maxWidth: '100%', width: '16rem' }}
        variant="unstyled"
      >
        <CardHeader className="p-4 font-bold">Unstyled</CardHeader>
        <CardBody className="p-4 pt-0">A card with the unstyled variant.</CardBody>
      </Card>
    </div>
  ),
}

/**
 * Use the **size** prop to change the padding and the text of the Card.
 */
export const Sizes: Story = {
  parameters: {
    docs: {
      source: {
        code: `<div className="flex flex-wrap items-start justify-center gap-6">
  <Card size="sm" variant="outline">
    <CardHeader>Size sm</CardHeader>
    <CardBody>The padding and the text follow the size.</CardBody>
  </Card>
  <Card size="md" variant="outline">
    <CardHeader>Size md</CardHeader>
    <CardBody>The padding and the text follow the size.</CardBody>
  </Card>
  <Card size="lg" variant="outline">
    <CardHeader>Size lg</CardHeader>
    <CardBody>The padding and the text follow the size.</CardBody>
  </Card>
</div>`,
      },
    },
  },
  render: () => (
    <div className="flex flex-wrap justify-center items-start gap-6">
      {(['sm', 'md', 'lg'] as const).map((size) => (
        <Card key={size} size={size} style={{ maxWidth: '100%', width: '16rem' }} variant="outline">
          <CardHeader>Size {size}</CardHeader>
          <CardBody>The padding and the text follow the size.</CardBody>
        </Card>
      ))}
    </div>
  ),
}

/**
 * All the parts are optional: use only the ones the card needs.
 */
export const Parts: Story = {
  render: () => (
    <div className="flex flex-wrap justify-center items-start gap-6">
      <Card style={{ maxWidth: '100%', width: '16rem' }} variant="outline">
        <CardBody>Only a body.</CardBody>
      </Card>
      <Card style={{ maxWidth: '100%', width: '16rem' }} variant="outline">
        <CardHeader>Header and body</CardHeader>
        <CardBody>No footer.</CardBody>
      </Card>
      <Card style={{ maxWidth: '100%', width: '16rem' }} variant="outline">
        <CardBody>Body and footer.</CardBody>
        <CardFooter>
          <Button label="Cancel" size="sm" variant="ghost" />
          <Button label="Save" size="sm" />
        </CardFooter>
      </Card>
    </div>
  ),
}

/**
 * To separate sections inside a `CardBody`, put a `Divider` between them. A `Divider` with a label also works
 * to split the content of a Card in two.
 */
export const Sections: Story = {
  render: () => (
    <Card style={{ maxWidth: '100%', width: '20rem' }} variant="outline">
      <CardHeader>Billing</CardHeader>
      <CardBody>
        <p>Plan: Team, billed monthly.</p>
        <Divider spacing="md" />
        <p>Next invoice: 1 November.</p>
        <Divider spacing="md">Payment</Divider>
        <p>Card ending in 4242.</p>
      </CardBody>
    </Card>
  ),
}

/**
 * To make a card clickable, put a real link inside it. Here the link in the header is stretched over the whole
 * Card with a pseudo element, so the card is one target for the pointer and still one link for the keyboard
 * and screen readers. The link has the focus, so the Card shows the focus ring (`focus-within`) and not just
 * the text of the link.
 */
export const Clickable: Story = {
  render: () => (
    <Card
      className="outline outline-0 outline-offset-2 outline-primary-solid focus-within:outline-2"
      style={{ maxWidth: '100%', position: 'relative', width: '20rem' }}
      variant="outline"
    >
      <CardHeader>
        <a className="outline-hidden after:absolute after:inset-0 hover:underline" href="#report">
          Weekly report
        </a>
      </CardHeader>
      <CardBody>The whole card is a link to the report.</CardBody>
    </Card>
  ),
}

/**
 * The Card is its parts, and each one is a plain element you can fill with anything and style with its own
 * `className`, `style` and `ref`. Here the header holds a title and a `Badge`, and the footer spreads its content to
 * both ends.
 */
export const Compound: Story = {
  parameters: {
    docs: {
      source: {
        code: `<Card style={{ maxWidth: '100%', width: '22rem' }} variant="outline">
  <CardHeader className="flex items-center justify-between">
    <span>Invoice #1042</span>
    <Badge colorScheme="success" size="sm" variant="subtle">
      Paid
    </Badge>
  </CardHeader>
  <CardBody>Design system subscription, October.</CardBody>
  <CardFooter className="justify-between">
    <span>Due Oct 30</span>
    <Button label="Download" size="sm" variant="ghost" />
  </CardFooter>
</Card>`,
      },
    },
  },
  render: () => (
    <Card style={{ maxWidth: '100%', width: '22rem' }} variant="outline">
      <CardHeader className="flex items-center justify-between">
        <span>Invoice #1042</span>
        <Badge colorScheme="success" size="sm" variant="subtle">
          Paid
        </Badge>
      </CardHeader>
      <CardBody>Design system subscription, October.</CardBody>
      <CardFooter className="justify-between">
        <span>Due Oct 30</span>
        <Button label="Download" size="sm" variant="ghost" />
      </CardFooter>
    </Card>
  ),
}

/**
 * Some examples of Card with Tailwind classes. With `variant="unstyled"` the Card and its parts have no Plume styles, so each takes the classes you give it.
 */
export const Tailwind: Story = {
  parameters: {
    docs: {
      source: {
        code: `<Card
  className="w-80 max-w-full overflow-hidden rounded-xl border border-border bg-surface text-foreground shadow-md"
  variant="unstyled"
>
  <CardHeader className="border-b border-border px-4 py-3 font-semibold">Team plan</CardHeader>
  <CardBody className="px-4 py-3 text-sm">
    Up to ten members, with shared projects and a history of thirty days.
  </CardBody>
  <CardFooter className="flex justify-end gap-2 border-t border-border px-4 py-3">
    <Button
      className="rounded-sm bg-blue-700 px-3 py-1.5 text-sm font-semibold text-white hover:bg-blue-800"
      label="Choose"
      variant="unstyled"
    />
  </CardFooter>
</Card>`,
      },
    },
  },
  render: () => (
    <Card
      className="w-80 max-w-full overflow-hidden rounded-xl border border-border bg-surface text-foreground shadow-md"
      variant="unstyled"
    >
      <CardHeader className="border-b border-border px-4 py-3 font-semibold">Team plan</CardHeader>
      <CardBody className="px-4 py-3 text-sm">
        Up to ten members, with shared projects and a history of thirty days.
      </CardBody>
      <CardFooter className="flex justify-end gap-2 border-t border-border px-4 py-3">
        <Button
          className="rounded-sm bg-blue-700 px-3 py-1.5 text-sm font-semibold text-white hover:bg-blue-800"
          label="Choose"
          variant="unstyled"
        />
      </CardFooter>
    </Card>
  ),
}

/**
 * Some examples of Card with Bootstrap classes: `card`, `card-header`, `card-body` and `card-footer`.
 */
export const Bootstrap: Story = {
  parameters: {
    docs: {
      source: {
        code: `<Card className="card" style={{ width: '20rem', maxWidth: '100%' }} variant="unstyled">
  <CardHeader className="card-header fw-semibold">Team plan</CardHeader>
  <CardBody className="card-body">
    Up to ten members, with shared projects and a history of thirty days.
  </CardBody>
  <CardFooter className="card-footer d-flex justify-content-end">
    <Button className="btn btn-primary btn-sm" label="Choose" variant="unstyled" />
  </CardFooter>
</Card>`,
      },
    },
  },
  render: () => (
    <Card className="card" style={{ width: '20rem', maxWidth: '100%' }} variant="unstyled">
      <CardHeader className="card-header fw-semibold">Team plan</CardHeader>
      <CardBody className="card-body">
        Up to ten members, with shared projects and a history of thirty days.
      </CardBody>
      <CardFooter className="card-footer d-flex justify-content-end">
        <Button className="btn btn-primary btn-sm" label="Choose" variant="unstyled" />
      </CardFooter>
    </Card>
  ),
}
