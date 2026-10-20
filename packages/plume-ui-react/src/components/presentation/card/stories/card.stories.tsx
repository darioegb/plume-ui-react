import type { StoryObj, Meta } from '@storybook/react-vite'
import { Button } from '../../../interaction/button'
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
 * `CardHeader` is a plain `<div>`, not a heading. When the title should show up in the outline of the page, put
 * a heading inside it (`<h3>`, at the level that fits the page).
 *
 * To make a card clickable, put a real link or button inside it. The Card doesn't take an `onClick`.
 *
 * ### Subcomponents
 *
 * | Component | Props |
 * | --- | --- |
 * | `CardHeader` | `className`, `style`, `id`, `children`. The title area, in a larger and bolder type. |
 * | `CardBody` | `className`, `style`, `id`, `children`. The content, which takes the free space of the Card. |
 * | `CardFooter` | `className`, `style`, `id`, `children`. A row for actions. |
 *
 * The parts take their padding and text size from the `size` of the Card, and none of them needs JavaScript, so
 * a Card can be rendered in a Server Component.
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
      description: 'The `CardHeader`, `CardBody` and `CardFooter` of the Card.',
      table: { type: { summary: 'ReactNode' } },
    },
    className: {
      control: 'text',
      description: 'Custom CSS class for the Card.',
      table: { type: { summary: 'string' } },
    },
    style: {
      control: false,
      description: 'Inline styles for the Card.',
      table: { type: { summary: 'CSSProperties' } },
    },
    size: {
      control: 'radio',
      description: 'Size of the Card: the padding of its parts and the size of its text.',
      options: ['sm', 'md', 'lg'],
      table: { type: { summary: `"sm" | "md" | "lg"` }, defaultValue: { summary: 'md' } },
    },
    variant: {
      control: 'radio',
      description:
        'Visual variant. `elevated` floats the Card with a shadow, `outline` draws its border and divides its parts, and `filled` gives it a muted background. `unstyled` drops the Plume styles so you can bring your own.',
      options: ['elevated', 'outline', 'filled', 'unstyled'],
      table: {
        type: { summary: `"elevated" | "outline" | "filled" | "unstyled"` },
        defaultValue: { summary: 'elevated' },
      },
    },
    id: {
      control: false,
      description: 'Id of the Card.',
      table: { category: 'HTML attributes', type: { summary: 'string' } },
    },
    title: {
      control: 'text',
      description: 'Native tooltip of the Card.',
      table: { category: 'HTML attributes', type: { summary: 'string' } },
    },
    role: {
      control: 'text',
      description: 'Role of the Card, for when it is a landmark (`region`) or a group (`group`).',
      table: { category: 'Accessibility', type: { summary: 'AriaRole' } },
    },
    'aria-label': {
      control: 'text',
      description: 'Accessible name of the Card.',
      table: { category: 'Accessibility', type: { summary: 'string' } },
    },
    'aria-labelledby': {
      control: false,
      description: 'Id of the element that names the Card, such as its header.',
      table: { category: 'Accessibility', type: { summary: 'string' } },
    },
  },
  args: {
    style: { width: '20rem' },
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
  render: () => (
    <div className="flex flex-wrap justify-center gap-6">
      {(['elevated', 'outline', 'filled'] as const).map((variant) => (
        <Card key={variant} style={{ width: '16rem' }} variant={variant}>
          <CardHeader>{variant[0].toUpperCase() + variant.slice(1)}</CardHeader>
          <CardBody>A card with the {variant} variant.</CardBody>
        </Card>
      ))}
      <Card
        className="border border-gray-400 rounded-lg"
        style={{ width: '16rem' }}
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
  render: () => (
    <div className="flex flex-wrap justify-center items-start gap-6">
      {(['sm', 'md', 'lg'] as const).map((size) => (
        <Card key={size} size={size} style={{ width: '16rem' }} variant="outline">
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
      <Card style={{ width: '16rem' }} variant="outline">
        <CardBody>Only a body.</CardBody>
      </Card>
      <Card style={{ width: '16rem' }} variant="outline">
        <CardHeader>Header and body</CardHeader>
        <CardBody>No footer.</CardBody>
      </Card>
      <Card style={{ width: '16rem' }} variant="outline">
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
 * To make a card clickable, put a real link inside it. Here the link in the header is stretched over the whole
 * Card with a pseudo element, so the card is one target for the pointer and still one link for the keyboard
 * and screen readers.
 */
export const Clickable: Story = {
  render: () => (
    <Card style={{ position: 'relative', width: '20rem' }} variant="outline">
      <CardHeader>
        <a className="after:absolute after:inset-0 hover:underline" href="#report">
          Weekly report
        </a>
      </CardHeader>
      <CardBody>The whole card is a link to the report.</CardBody>
    </Card>
  ),
}
