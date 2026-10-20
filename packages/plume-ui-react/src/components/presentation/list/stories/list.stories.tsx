import type { StoryObj, Meta } from '@storybook/react-vite'
import { Icon } from '../../icon'
import { List, ListIcon, ListItem } from '..'

const check = (
  <svg
    fill="none"
    stroke="currentColor"
    strokeLinecap="round"
    strokeLinejoin="round"
    strokeWidth="2"
    viewBox="0 0 24 24"
  >
    <path d="M20 6 9 17l-5-5" />
  </svg>
)

const features = [
  'Server Components ready',
  'Light and dark mode',
  'Fully typed',
  'No dependencies',
]

/**
 * A list of items. Compose it with `ListItem`, and with `ListIcon` when an item has an icon instead of a
 * bullet. The `variant` picks the markers and the element: an `ordered` list is an `<ol>`, the others are a
 * `<ul>`. A list with no markers (`plain`) keeps its list role, which some browsers drop when the bullets go.
 *
 * ### Subcomponents
 *
 * | Component | Props |
 * | --- | --- |
 * | `ListItem` | `className`, `style`, `id`, `value`, `children`. A `<li>`. |
 * | `ListIcon` | `className`, `style`, `id`, `children`. Puts an icon at the start of a `ListItem`, lined up with the first line of text. It is hidden from screen readers. |
 *
 * None of the parts needs JavaScript, so a List can be rendered in a Server Component.
 */
export default {
  title: 'Components/List',
  component: List,
  tags: ['autodocs'],
  parameters: {
    docs: {
      importNames: ['List', 'ListItem', 'ListIcon'],
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
      description: 'The `ListItem` elements of the List.',
      table: { type: { summary: 'ReactNode' } },
    },
    className: {
      control: 'text',
      description: 'Custom CSS class for the List.',
      table: { type: { summary: 'string' } },
    },
    style: {
      control: false,
      description: 'Inline styles for the List.',
      table: { type: { summary: 'CSSProperties' } },
    },
    size: {
      control: 'radio',
      description: 'Size of the text of the List.',
      options: ['sm', 'md', 'lg'],
      table: { type: { summary: `"sm" | "md" | "lg"` }, defaultValue: { summary: 'md' } },
    },
    spacing: {
      control: 'radio',
      description: 'Space between the items.',
      options: ['sm', 'md', 'lg'],
      table: { type: { summary: `"sm" | "md" | "lg"` }, defaultValue: { summary: 'md' } },
    },
    variant: {
      control: 'radio',
      description:
        'Visual variant. `unordered` shows bullets, `ordered` shows numbers and renders an `<ol>`, and `plain` shows no markers. `unstyled` drops the Plume styles so you can bring your own.',
      options: ['unordered', 'ordered', 'plain', 'unstyled'],
      table: {
        type: { summary: `"unordered" | "ordered" | "plain" | "unstyled"` },
        defaultValue: { summary: 'unordered' },
      },
    },
    as: {
      control: 'radio',
      description:
        'The element to render. By default it follows the variant: `ol` for `ordered` and `ul` for the rest. Use it to get an `<ol>` with the `unstyled` variant.',
      options: [undefined, 'ul', 'ol'],
      table: { type: { summary: `"ul" | "ol"` } },
    },
    id: {
      control: false,
      description: 'Id of the List.',
      table: { category: 'HTML attributes', type: { summary: 'string' } },
    },
    title: {
      control: 'text',
      description: 'Native tooltip of the List.',
      table: { category: 'HTML attributes', type: { summary: 'string' } },
    },
    role: {
      control: 'text',
      description: 'Role of the List. A `plain` list gets `list` by default.',
      table: { category: 'Accessibility', type: { summary: 'AriaRole' } },
    },
    'aria-label': {
      control: 'text',
      description: 'Accessible name of the List.',
      table: { category: 'Accessibility', type: { summary: 'string' } },
    },
    'aria-labelledby': {
      control: false,
      description: 'Id of the element that names the List.',
      table: { category: 'Accessibility', type: { summary: 'string' } },
    },
  },
  render: (args) => (
    <List {...args}>
      {features.map((feature) => (
        <ListItem key={feature}>{feature}</ListItem>
      ))}
    </List>
  ),
} satisfies Meta<typeof List>

type Story = StoryObj<typeof List>

/**
 * This is the default List, with bullets.
 */
export const Default: Story = {}

/**
 * Use the **variant** prop to pick the markers: `unordered` shows bullets, `ordered` shows numbers, `plain`
 * shows none, and `unstyled` drops the Plume styles so you can style it yourself.
 */
export const Variants: Story = {
  render: () => (
    <div className="flex flex-wrap justify-center gap-10">
      {(['unordered', 'ordered', 'plain'] as const).map((variant) => (
        <List aria-label={variant} key={variant} variant={variant}>
          {features.slice(0, 3).map((feature) => (
            <ListItem key={feature}>{feature}</ListItem>
          ))}
        </List>
      ))}
      <List aria-label="unstyled" className="list-none space-y-1 m-0 p-0" variant="unstyled">
        {features.slice(0, 3).map((feature) => (
          <ListItem key={feature}>{feature}</ListItem>
        ))}
      </List>
    </div>
  ),
}

/**
 * Use the **size** prop to change the size of the text.
 */
export const Sizes: Story = {
  render: () => (
    <div className="flex flex-wrap justify-center gap-10">
      {(['sm', 'md', 'lg'] as const).map((size) => (
        <List aria-label={size} key={size} size={size}>
          {features.slice(0, 3).map((feature) => (
            <ListItem key={feature}>{feature}</ListItem>
          ))}
        </List>
      ))}
    </div>
  ),
}

/**
 * Use the **spacing** prop to change the space between the items.
 */
export const Spacing: Story = {
  render: () => (
    <div className="flex flex-wrap justify-center gap-10">
      {(['sm', 'md', 'lg'] as const).map((spacing) => (
        <List aria-label={spacing} key={spacing} spacing={spacing}>
          {features.slice(0, 3).map((feature) => (
            <ListItem key={feature}>{feature}</ListItem>
          ))}
        </List>
      ))}
    </div>
  ),
}

/**
 * Put a **ListIcon** with an **Icon** at the start of an item to use it instead of the bullet. Combine it with
 * the `plain` variant.
 */
export const WithIcons: Story = {
  render: () => (
    <List aria-label="Features" variant="plain">
      {features.map((feature) => (
        <ListItem key={feature}>
          <ListIcon>
            <Icon colorScheme="success" size="sm">
              {check}
            </Icon>
          </ListIcon>
          {feature}
        </ListItem>
      ))}
    </List>
  ),
}

/**
 * An ordered list of steps. The **start** and **value** of a numbered list are the native ones of `<ol>`:
 * set `value` on a `ListItem` to change its number.
 */
export const Ordered: Story = {
  render: () => (
    <List aria-label="Steps" variant="ordered">
      <ListItem>Install the package</ListItem>
      <ListItem>Wrap the app in the ThemeProvider</ListItem>
      <ListItem value={10}>Import the stylesheet</ListItem>
    </List>
  ),
}
