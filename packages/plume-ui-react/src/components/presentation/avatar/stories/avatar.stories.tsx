import type { StoryObj, Meta } from '@storybook/react-vite'
import { defaultTheme } from '../../../../theme'
import {
  Avatar,
  AvatarFallback,
  AvatarGroup,
  AvatarImage,
  AvatarOverflow,
  AvatarStatusDot,
} from '..'

const colorSchemes = Object.keys(defaultTheme.colors)

const portrait = `data:image/svg+xml,${encodeURIComponent(
  '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 80 80"><defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#7c3aed"/><stop offset="1" stop-color="#f59e0b"/></linearGradient></defs><rect width="80" height="80" fill="url(#g)"/><circle cx="40" cy="31" r="14" fill="#fff" fill-opacity=".85"/><path d="M12 80c0-17 12-28 28-28s28 11 28 28z" fill="#fff" fill-opacity=".85"/></svg>',
)}`

const people = [
  'Ada Lovelace',
  'Grace Hopper',
  'Margaret Hamilton',
  'Katherine Johnson',
  'Alan Turing',
]

/**
 * A picture of a person or a team, with a fallback for when there is none. It shows the **src** image and, when
 * there is no image or it fails to load, the initials of the **name**, an icon, or whatever you pass as
 * **fallback**. A **status** adds a dot for presence.
 *
 * It is an image for assistive technology, named by the **alt** or the **name** and followed by the status
 * (`Ada Lovelace, Online`). With neither a name nor a status it is decorative and is hidden. Use **alt** when the
 * image says something more than the name, and **labels** to translate the status.
 *
 * `AvatarGroup` stacks several avatars. With **max** it shows that many and a counter with the rest, named by
 * **labels.overflow**. The group gives its **size**, **shape**, **colorScheme** and **variant** to the avatars that
 * don't set their own.
 *
 * Every element of the Avatar is a part with its own `className`, `style` and `ref`. Given no children, the Avatar
 * renders `AvatarImage`, `AvatarFallback` and `AvatarStatusDot`; give it some of them and it renders only those,
 * in the order you write them. The content (**src**, **name**, **fallback**, **status**) stays on the `Avatar`, and the
 * parts read it, so `AvatarImage` shows the **src** while it loads and `AvatarFallback` takes its place when there is
 * no image or it fails.
 *
 * ### Subcomponents
 *
 * | Component | Props |
 * | --- | --- |
 * | `AvatarImage` | `loading`, `crossOrigin`, `decoding`, `referrerPolicy`, `className`, `style`. The `<img>` with the **src** of the Avatar. It renders nothing without a **src** or when the image fails to load. |
 * | `AvatarFallback` | `children` (replaces the content), `className`, `style`. The initials, the **fallback** or an icon. It renders nothing while the image is shown. |
 * | `AvatarStatusDot` | `className`, `style`. The dot of the **status**, with a `data-status` attribute. It renders nothing without a **status**. |
 * | `AvatarOverflow` | `count` (required), `children` (replaces `+count`), and the props of the Avatar except the content. The counter of the group. It is what the group renders when **max** hides avatars, and you can place it yourself. Its name comes from **labels.overflow** of the group. |
 * | `AvatarGroup` | `max`, `labels` (`overflow` is `(hidden) => string`, `N more` by default, and the texts of the status, which the avatars of the group inherit), `size`, `shape`, `colorScheme`, `variant`, `aria-label`, `aria-labelledby`, `id`, `title`, `className`, `style`, `children`. A `role="group"` that stacks the avatars. Name it with `aria-label` (`Team members`). |
 */
export default {
  title: 'Components/Avatar',
  component: Avatar,
  tags: ['autodocs'],
  parameters: {
    docs: {
      importNames: [
        'Avatar',
        'AvatarFallback',
        'AvatarGroup',
        'AvatarImage',
        'AvatarOverflow',
        'AvatarStatusDot',
      ],
      toc: {
        title: 'On this page',
        disable: false,
      },
    },
    layout: 'centered',
  },
  argTypes: {
    name: {
      control: 'text',
      description:
        'Name of the person. Its initials are the fallback, and it names the avatar for assistive technology.',
      table: { type: { summary: 'string' } },
    },
    src: {
      control: 'text',
      description: 'URL of the image. If it fails to load, the fallback is shown.',
      table: { type: { summary: 'string' } },
    },
    alt: {
      control: 'text',
      description:
        'Accessible name of the image, when the name is not enough. It replaces the name.',
      table: { category: 'Accessibility', type: { summary: 'string' } },
    },
    fallback: {
      control: false,
      description:
        'What to show when there is no image: a text, an icon... By default, the initials of the name, or an icon of a person.',
      table: { type: { summary: 'ReactNode' } },
    },
    status: {
      control: 'radio',
      description: 'Adds a dot with the presence of the person.',
      options: [undefined, 'online', 'busy', 'away', 'offline'],
      table: { type: { summary: `"online" | "busy" | "away" | "offline"` } },
    },
    labels: {
      control: false,
      description:
        'The texts of the status for assistive technology, to translate them: `online`, `busy`, `away` and `offline`.',
      table: {
        category: 'Accessibility',
        type: { summary: 'Partial<AvatarLabels>' },
        defaultValue: {
          summary: "{ online: 'Online', busy: 'Busy', away: 'Away', offline: 'Offline' }",
        },
      },
    },
    className: {
      control: 'text',
      description: 'Custom CSS class for the Avatar. The parts take their own `className`.',
      table: { type: { summary: 'string' } },
    },
    children: {
      control: false,
      description:
        'The parts to render, in the order you want: `AvatarImage`, `AvatarFallback` and `AvatarStatusDot`. Without them the Avatar renders all three.',
      table: { type: { summary: 'ReactNode' } },
    },
    style: {
      control: false,
      description:
        'Inline styles for the Avatar. They are applied after the color variables, so they can override them (e.g. `--avatar-solid`).',
      table: { type: { summary: 'CSSProperties' } },
    },
    colorScheme: {
      control: 'select',
      description:
        'Color scheme of the fallback, from the theme palette, including custom schemes added to it.',
      options: colorSchemes,
      table: { type: { summary: 'ColorScheme' }, defaultValue: { summary: 'secondary' } },
    },
    size: {
      control: 'radio',
      description: 'Size of the Avatar.',
      options: ['sm', 'md', 'lg'],
      table: { type: { summary: `"sm" | "md" | "lg"` }, defaultValue: { summary: 'md' } },
    },
    shape: {
      control: 'radio',
      description: 'Corners of the Avatar: `pill` is a circle and `rounded` a rounded square.',
      options: ['pill', 'rounded'],
      table: { type: { summary: `"pill" | "rounded"` }, defaultValue: { summary: 'pill' } },
    },
    variant: {
      control: 'radio',
      description:
        'Visual variant of the fallback. `subtle` tints it, `solid` fills it and `outline` draws its border. `unstyled` drops the Plume styles so you can bring your own.',
      options: ['subtle', 'solid', 'outline', 'unstyled'],
      table: {
        type: { summary: `"subtle" | "solid" | "outline" | "unstyled"` },
        defaultValue: { summary: 'subtle' },
      },
    },
    id: {
      control: false,
      description: 'Id of the Avatar.',
      table: { category: 'HTML attributes', type: { summary: 'string' } },
    },
    title: {
      control: 'text',
      description: 'Native tooltip of the Avatar.',
      table: { category: 'HTML attributes', type: { summary: 'string' } },
    },
    hidden: {
      control: 'boolean',
      description: 'Hides the Avatar.',
      table: { category: 'HTML attributes', type: { summary: 'boolean' } },
    },
    'aria-label': {
      control: 'text',
      description:
        'Accessible name of the Avatar. It replaces the one made from the name and the status.',
      table: { category: 'Accessibility', type: { summary: 'string' } },
    },
    'aria-labelledby': {
      control: false,
      description: 'Id of the element that names the Avatar.',
      table: { category: 'Accessibility', type: { summary: 'string' } },
    },
  },
  args: {
    name: 'Ada Lovelace',
  },
} satisfies Meta<typeof Avatar>

type Story = StoryObj<typeof Avatar>

/**
 * This is the default Avatar: with no image, it shows the initials of the name.
 */
export const Default: Story = {}

/**
 * With **src** it shows the image. If the image can't be loaded, it goes back to the initials.
 */
export const WithImage: Story = {
  args: { src: portrait },
}

/**
 * What it shows when there is no image: the initials of the name, an icon when there is no name, a **fallback**
 * of your own, and the initials again when the image fails to load.
 */
export const Fallbacks: Story = {
  render: () => (
    <div className="flex flex-wrap items-center justify-center gap-4">
      <Avatar name="Ada Lovelace" />
      <Avatar aria-label="Unknown user" />
      <Avatar fallback="AI" name="Assistant" />
      <Avatar name="Grace Hopper" src="/this-image-does-not-exist.png" />
    </div>
  ),
}

/**
 * Use the **variant** prop to pick how the fallback looks: `subtle` tints it, `solid` fills it, `outline` draws
 * its border, and `unstyled` drops the Plume styles so you can style it yourself.
 */
export const Variants: Story = {
  render: () => (
    <div className="flex flex-wrap items-center justify-center gap-4">
      {(['subtle', 'solid', 'outline'] as const).map((variant) => (
        <Avatar colorScheme="primary" key={variant} name="Ada Lovelace" variant={variant} />
      ))}
      <Avatar className="size-10 rounded-full" name="Ada Lovelace" variant="unstyled">
        <AvatarFallback className="bg-gray-900 text-white" />
      </Avatar>
    </div>
  ),
}

/**
 * Use the **size** prop to change the size of the Avatar and its text.
 */
export const Sizes: Story = {
  render: () => (
    <div className="flex flex-wrap items-center justify-center gap-4">
      {(['sm', 'md', 'lg'] as const).map((size) => (
        <Avatar key={size} name="Ada Lovelace" size={size} />
      ))}
      {(['sm', 'md', 'lg'] as const).map((size) => (
        <Avatar key={`image-${size}`} name="Ada Lovelace" size={size} src={portrait} />
      ))}
    </div>
  ),
}

/**
 * Use the **shape** prop to choose between a circle (`pill`) and a rounded square (`rounded`).
 */
export const Shapes: Story = {
  render: () => (
    <div className="flex flex-wrap items-center justify-center gap-4">
      {(['pill', 'rounded'] as const).map((shape) => (
        <Avatar key={shape} name="Ada Lovelace" shape={shape} />
      ))}
      {(['pill', 'rounded'] as const).map((shape) => (
        <Avatar key={`image-${shape}`} name="Ada Lovelace" shape={shape} src={portrait} />
      ))}
    </div>
  ),
}

/**
 * Use the **colorScheme** prop to color the fallback. It takes the colors of the theme, including the ones you
 * add to it.
 */
export const Colors: Story = {
  render: () => (
    <div className="flex flex-wrap items-center justify-center gap-4">
      {colorSchemes.map((colorScheme) => (
        <Avatar colorScheme={colorScheme} key={colorScheme} name={colorScheme} />
      ))}
    </div>
  ),
}

/**
 * **status** adds a dot with the presence of the person. It is also read by assistive technology after the name,
 * so the color is not the only way to tell it. Change the text with **labels**.
 */
export const Status: Story = {
  render: () => (
    <div className="flex flex-wrap items-center justify-center gap-4">
      {(['online', 'busy', 'away', 'offline'] as const).map((status) => (
        <Avatar key={status} name="Ada Lovelace" status={status} />
      ))}
      {(['online', 'busy'] as const).map((status) => (
        <Avatar
          key={`image-${status}`}
          name="Ada Lovelace"
          size="lg"
          src={portrait}
          status={status}
        />
      ))}
      <Avatar labels={{ online: 'En línea' }} name="Ada Lovelace" status="online" />
    </div>
  ),
}

/**
 * Every element is a part. Give the Avatar some of them and it renders only those, in the order you write them, each
 * with its own `className`, `style` and `ref`. The **src**, **name**, **fallback** and **status** stay on the Avatar.
 * Here the status dot goes first, the image is omitted in the second one and the fallback has its own content in the
 * third. `AvatarOverflow` is the counter that `AvatarGroup` renders for **max**, and it can be placed by hand.
 */
export const Compound: Story = {
  render: () => (
    <div className="flex flex-wrap items-center justify-center gap-4">
      <Avatar name="Ada Lovelace" src={portrait} status="online">
        <AvatarStatusDot />
        <AvatarImage />
        <AvatarFallback />
      </Avatar>
      <Avatar name="Grace Hopper" status="busy">
        <AvatarFallback />
      </Avatar>
      <Avatar name="Assistant">
        <AvatarFallback>
          <strong>AI</strong>
        </AvatarFallback>
      </Avatar>
      <AvatarGroup aria-label="Team members">
        <Avatar name="Ada Lovelace" />
        <Avatar name="Grace Hopper" />
        <AvatarOverflow count={3} />
      </AvatarGroup>
    </div>
  ),
}

/**
 * `AvatarGroup` stacks avatars. It gives them its **size**, **shape**, **colorScheme** and **variant**, and with
 * **max** it shows that many and a counter with the rest.
 */
export const Group: Story = {
  render: () => (
    <div className="flex flex-col items-center gap-6">
      <AvatarGroup aria-label="Team members">
        {people.map((name) => (
          <Avatar key={name} name={name} />
        ))}
      </AvatarGroup>
      <AvatarGroup aria-label="Team members, first three" max={3} size="lg">
        {people.map((name) => (
          <Avatar key={name} name={name} />
        ))}
      </AvatarGroup>
      <AvatarGroup
        aria-label="Reviewers"
        colorScheme="primary"
        max={2}
        shape="rounded"
        variant="solid"
      >
        {people.map((name) => (
          <Avatar key={name} name={name} />
        ))}
      </AvatarGroup>
      <AvatarGroup
        aria-label="Con imágenes"
        labels={{ overflow: (hidden) => `${hidden} más` }}
        max={3}
      >
        <Avatar name="Ada Lovelace" src={portrait} />
        <Avatar name="Grace Hopper" />
        <Avatar name="Margaret Hamilton" src={portrait} />
        <Avatar name="Katherine Johnson" />
        <Avatar name="Alan Turing" />
      </AvatarGroup>
    </div>
  ),
}

/**
 * Some examples of Avatar with Tailwind classes. With `variant="unstyled"` the Avatar and its parts have no Plume styles, so each takes the classes you give it.
 */
export const Tailwind: Story = {
  parameters: {
    docs: {
      source: {
        code: `<Avatar
  className="size-12 rounded-full ring-2 ring-blue-700"
  name="Ada Lovelace"
  status="online"
  variant="unstyled"
>
  <AvatarFallback className="flex size-full items-center justify-center rounded-full bg-blue-700 font-semibold text-white" />
  <AvatarStatusDot className="absolute bottom-0 right-0 size-3 rounded-full bg-green-500 ring-2 ring-white" />
</Avatar>`,
      },
    },
  },
  render: () => (
    <div className="flex items-center gap-4">
      <Avatar
        className="size-12 rounded-full ring-2 ring-blue-700"
        name="Ada Lovelace"
        status="online"
        variant="unstyled"
      >
        <AvatarFallback className="flex size-full items-center justify-center rounded-full bg-blue-700 font-semibold text-white" />
        <AvatarStatusDot className="absolute bottom-0 right-0 size-3 rounded-full bg-green-500 ring-2 ring-white" />
      </Avatar>
      <Avatar
        className="size-12 rounded-full ring-2 ring-blue-700"
        name="Ada Lovelace"
        src={portrait}
        variant="unstyled"
      >
        <AvatarImage className="size-full rounded-full object-cover" />
        <AvatarFallback />
      </Avatar>
    </div>
  ),
}

/**
 * Some examples of Avatar with Bootstrap classes.
 */
export const Bootstrap: Story = {
  parameters: {
    docs: {
      source: {
        code: `<Avatar
  className="rounded-circle border border-2 border-primary"
  name="Ada Lovelace"
  status="online"
  style={{ height: '3rem', width: '3rem' }}
  variant="unstyled"
>
  <AvatarFallback className="d-flex align-items-center justify-content-center rounded-circle bg-primary text-white fw-semibold w-100 h-100" />
  <AvatarStatusDot className="position-absolute bottom-0 end-0 p-2 bg-success border border-light rounded-circle" />
</Avatar>`,
      },
    },
  },
  render: () => (
    <div className="d-flex align-items-center gap-3">
      <Avatar
        className="rounded-circle border border-2 border-primary"
        name="Ada Lovelace"
        status="online"
        style={{ height: '3rem', width: '3rem' }}
        variant="unstyled"
      >
        <AvatarFallback className="d-flex align-items-center justify-content-center rounded-circle bg-primary text-white fw-semibold w-100 h-100" />
        <AvatarStatusDot className="position-absolute bottom-0 end-0 p-2 bg-success border border-light rounded-circle" />
      </Avatar>
      <Avatar
        className="rounded-circle border border-2 border-primary"
        name="Ada Lovelace"
        src={portrait}
        style={{ height: '3rem', width: '3rem' }}
        variant="unstyled"
      >
        <AvatarImage className="rounded-circle w-100 h-100 object-fit-cover" />
        <AvatarFallback />
      </Avatar>
    </div>
  ),
}
