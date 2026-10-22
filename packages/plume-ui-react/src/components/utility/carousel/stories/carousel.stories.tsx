import type { StoryObj, Meta } from '@storybook/react-vite'
import { useState } from 'react'
import { defaultTheme } from '../../../../theme'
import {
  Carousel,
  CarouselDots,
  CarouselNext,
  CarouselPlayPause,
  CarouselPrev,
  CarouselSlide,
  CarouselSlides,
} from '..'

const colorSchemes = Object.keys(defaultTheme.colors)

const slides = [
  { background: 'var(--plume-color-primary-solid)', title: 'Mountains' },
  { background: 'var(--plume-color-success-solid)', title: 'Forest' },
  { background: 'var(--plume-color-warning-solid)', title: 'Desert' },
  { background: 'var(--plume-color-error-solid)', title: 'Canyon' },
]

const frame = { maxWidth: '100%', width: '28rem' }

function Panels({ className }: Readonly<{ className?: string }>): React.ReactNode {
  return (
    <CarouselSlides>
      {slides.map(({ background, title }) => (
        <CarouselSlide className={className} key={title}>
          <div
            style={{
              alignItems: 'center',
              background,
              color: '#fff',
              display: 'flex',
              fontSize: '1.25rem',
              fontWeight: 600,
              height: '10rem',
              justifyContent: 'center',
              textShadow: '0 1px 2px rgb(0 0 0 / 50%)',
            }}
          >
            {title}
          </div>
        </CarouselSlide>
      ))}
    </CarouselSlides>
  )
}

function Controls(): React.ReactNode {
  return (
    <>
      <CarouselPrev />
      <CarouselNext />
      <CarouselDots />
    </>
  )
}

/**
 * A row of slides that shows one at a time, to move through with buttons, dots or a swipe. Use it for a gallery or
 * a set of highlights.
 *
 * It follows the WAI-ARIA carousel pattern: the root is a `region` with `aria-roledescription="carousel"` (give
 * it an `aria-label`), and every slide is a tab panel with `aria-roledescription="slide"` named "1 of 4", as in the tabbed variant of the pattern, so the dots are its tabs (change the
 * text with **slideLabel**). Only the visible slide can be reached, and it takes the focus to be scrolled with the
 * keyboard: the others are `inert`. The previous and next
 * buttons say what they do and are disabled at the ends unless there is a **loop**, and the dots are a tab list
 * where <kbd>←</kbd> and <kbd>→</kbd> move between them and <kbd>Home</kbd> and <kbd>End</kbd> go to the first
 * and the last.
 *
 * The slides scroll with the browser's own scrolling and snap in place, so a swipe, the wheel, the scroll keys and
 * the buttons all work and stay in sync with the dots. With `prefers-reduced-motion` the slides jump instead of
 * gliding.
 *
 * **Autoplay.** With **autoplay** (the time in milliseconds between slides) the carousel moves by itself, and goes
 * back to the first slide after the last. It pauses while the pointer is over it or the focus is inside, and it
 * doesn't run at all with `prefers-reduced-motion`. Moving content has to be stoppable, so always add a
 * `CarouselPlayPause` button. While it runs, the slides are not announced by screen readers.
 *
 * Each slide takes the full width. Give a `CarouselSlide` a width (`className` or `style`, like `flex-basis: 50%`)
 * to show several at once.
 *
 * ### Subcomponents
 *
 * | Component | Props |
 * | --- | --- |
 * | `CarouselSlides` | `id`, `title`, `className`, `style`, `children`. The strip that holds and scrolls the slides. Each child is one slide. |
 * | `CarouselSlide` | `aria-label`, `title`, `hidden`, `className`, `style`, `children`. One slide. It has `data-active` while it is the visible one. |
 * | `CarouselPrev`, `CarouselNext` | `label`, `icon`, `disabled`, `onClick`, `id`, `title`, `className`, `style`, `children`. The buttons that go to the previous and the next slide. `label` is the accessible name (`"Previous slide"`, `"Next slide"`), `icon` replaces the arrow and `children` replaces all of its content. |
 * | `CarouselDots` | `dotLabel`, `dotClassName`, `aria-label`, `id`, `title`, `hidden`, `className`, `style`. One dot per slide, as a tab list. `dotLabel` is the name of each (`"Slide 1 of 4"`). A dot has `data-active` while its slide is the visible one. |
 * | `CarouselPlayPause` | `pauseLabel`, `playLabel`, `disabled`, `onClick`, `id`, `title`, `className`, `style`, `children`. Pauses and resumes the autoplay. It has `data-playing` while the carousel moves. |
 */
export default {
  title: 'Components/Carousel',
  component: Carousel,
  tags: ['autodocs'],
  parameters: {
    docs: {
      importNames: [
        'Carousel',
        'CarouselSlides',
        'CarouselSlide',
        'CarouselPrev',
        'CarouselNext',
        'CarouselDots',
        'CarouselPlayPause',
      ],
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
      description:
        'The parts of the Carousel: a `CarouselSlides` with the slides, and the buttons and dots you want.',
      table: { type: { summary: 'ReactNode' } },
    },
    className: {
      control: 'text',
      description: 'Custom CSS class for the Carousel.',
      table: { type: { summary: 'string' } },
    },
    style: {
      control: false,
      description:
        'Inline styles for the Carousel. They are applied after the color variables, so they can override them (e.g. `--carousel-solid`).',
      table: { type: { summary: 'CSSProperties' } },
    },
    index: {
      control: false,
      description:
        'The visible slide, starting at 0. Makes the Carousel controlled: pass `onIndexChange` to update it.',
      table: { type: { summary: 'number' } },
    },
    defaultIndex: {
      control: 'number',
      description: 'The slide that is visible first, when it is not controlled.',
      table: { type: { summary: 'number' }, defaultValue: { summary: '0' } },
    },
    onIndexChange: {
      control: false,
      description:
        'Called with the new index when the visible slide changes, by a button, a dot, autoplay or a swipe.',
      table: { category: 'Events', type: { summary: '(index: number) => void' } },
    },
    loop: {
      control: 'boolean',
      description:
        'Makes the buttons go from the last slide to the first, and the other way round, instead of stopping.',
      table: { type: { summary: 'boolean' }, defaultValue: { summary: 'false' } },
    },
    autoplay: {
      control: false,
      description:
        'Time in milliseconds between slides. Without it the Carousel only moves when the user asks. It pauses on hover and focus and never runs with `prefers-reduced-motion`.',
      table: { type: { summary: 'number | false' }, defaultValue: { summary: 'false' } },
    },
    slideLabel: {
      control: false,
      description:
        'Returns the accessible name of a slide, from its index and the number of slides.',
      table: {
        type: { summary: '(index: number, count: number) => string' },
        defaultValue: { summary: '(i, n) => `${i + 1} of ${n}`' },
      },
    },
    colorScheme: {
      control: 'select',
      description:
        'Color scheme from the theme palette, including custom schemes added to it. It colors the buttons and the active dot.',
      options: colorSchemes,
      table: { type: { summary: 'ColorScheme' }, defaultValue: { summary: 'primary' } },
    },
    size: {
      control: 'radio',
      description: 'Size of the buttons and the dots.',
      options: ['sm', 'md', 'lg'],
      table: { type: { summary: `"sm" | "md" | "lg"` }, defaultValue: { summary: 'md' } },
    },
    variant: {
      control: 'radio',
      description:
        'Visual variant of the buttons. `solid` fills them with the color, `outline` draws a border on a neutral background. `unstyled` drops the Plume styles so you can bring your own; the scrolling and the snapping keep working.',
      options: ['solid', 'outline', 'unstyled'],
      table: {
        type: { summary: `"solid" | "outline" | "unstyled"` },
        defaultValue: { summary: 'solid' },
      },
    },
    id: {
      control: false,
      description: 'Id of the Carousel. The slides and the controls take their ids from it.',
      table: { category: 'HTML attributes', type: { summary: 'string' } },
    },
    title: {
      control: 'text',
      description: 'Native tooltip of the Carousel.',
      table: { category: 'HTML attributes', type: { summary: 'string' } },
    },
    hidden: {
      control: false,
      description: 'Hides the Carousel.',
      table: { category: 'HTML attributes', type: { summary: 'boolean' } },
    },
    'aria-label': {
      control: 'text',
      description: 'Accessible name of the Carousel, for example "Featured places".',
      table: { category: 'Accessibility', type: { summary: 'string' } },
    },
    'aria-labelledby': {
      control: false,
      description: 'Id of the element that names the Carousel.',
      table: { category: 'Accessibility', type: { summary: 'string' } },
    },
  },
  args: {
    'aria-label': 'Featured places',
    children: (
      <>
        <Panels />
        <Controls />
      </>
    ),
    style: frame,
  },
} satisfies Meta<typeof Carousel>

type Story = StoryObj<typeof Carousel>

/**
 * This is the default Carousel: it stops at the first and the last slide, and it only moves when the user asks.
 */
export const Default: Story = {}

/**
 * Use the **variant** prop to pick how the buttons look. `unstyled` drops the Plume styles so you can style them
 * yourself.
 */
export const Variants: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', ...frame }}>
      {(['solid', 'outline'] as const).map((variant) => (
        <Carousel aria-label={variant} key={variant} variant={variant}>
          <Panels />
          <Controls />
        </Carousel>
      ))}
      <Carousel aria-label="unstyled" variant="unstyled">
        <Panels />
        <div className="mt-2 flex items-center justify-between">
          <CarouselPrev
            className="rounded border border-gray-400 px-3 py-1 disabled:opacity-40"
            label="Back"
          >
            Back
          </CarouselPrev>
          <CarouselDots
            className="flex gap-2"
            dotClassName="size-3 rounded-full bg-gray-300 data-[active]:bg-gray-800"
          />
          <CarouselNext
            className="rounded border border-gray-400 px-3 py-1 disabled:opacity-40"
            label="Next"
          >
            Next
          </CarouselNext>
        </div>
      </Carousel>
    </div>
  ),
}

/**
 * Use the **size** prop to change the size of the buttons and the dots.
 */
export const Sizes: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', ...frame }}>
      {(['sm', 'md', 'lg'] as const).map((size) => (
        <Carousel aria-label={`Size ${size}`} key={size} size={size}>
          <Panels />
          <Controls />
        </Carousel>
      ))}
    </div>
  ),
}

/**
 * Use the **colorScheme** prop to pick a color from the theme. It colors the buttons and the active dot.
 */
export const Colors: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', ...frame }}>
      {colorSchemes.map((scheme) => (
        <Carousel
          aria-label={scheme}
          colorScheme={scheme as keyof typeof defaultTheme.colors}
          key={scheme}
          size="sm"
        >
          <Panels />
          <Controls />
        </Carousel>
      ))}
    </div>
  ),
}

/**
 * With **loop** the buttons go from the last slide to the first, and the other way round, so they are never
 * disabled.
 */
export const Loop: Story = {
  args: { loop: true },
}

/**
 * Give a `CarouselSlide` a width to show several slides at once. Here every slide takes 45% of the strip, so the
 * next one peeks out. The strip still snaps slide by slide.
 */
export const Peek: Story = {
  render: () => (
    <Carousel aria-label="Several slides" style={frame}>
      <CarouselSlides style={{ gap: '0.75rem' }}>
        {slides.map(({ background, title }) => (
          <CarouselSlide key={title} style={{ flexBasis: '45%' }}>
            <div
              style={{
                alignItems: 'center',
                background,
                borderRadius: '0.5rem',
                color: '#fff',
                display: 'flex',
                fontWeight: 600,
                height: '8rem',
                justifyContent: 'center',
              }}
            >
              {title}
            </div>
          </CarouselSlide>
        ))}
      </CarouselSlides>
      <Controls />
    </Carousel>
  ),
}

/**
 * With **autoplay** the Carousel moves by itself every number of milliseconds. It pauses while the pointer is
 * over it or the focus is inside, and it doesn't run with `prefers-reduced-motion`. Always add a
 * `CarouselPlayPause` so the user can stop it.
 */
export const Autoplay: Story = {
  args: {
    autoplay: 3500,
    children: (
      <>
        <Panels />
        <CarouselPrev />
        <CarouselNext />
        <div style={{ alignItems: 'center', display: 'flex', justifyContent: 'center' }}>
          <CarouselPlayPause />
          <CarouselDots />
        </div>
      </>
    ),
  },
}

function ControlledCarousel(): React.ReactNode {
  const [index, setIndex] = useState(1)
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', ...frame }}>
      <Carousel aria-label="Controlled" index={index} onIndexChange={setIndex}>
        <Panels />
        <Controls />
      </Carousel>
      <div className="flex flex-wrap items-center gap-2">
        {slides.map(({ title }, position) => (
          <button
            className="rounded border border-gray-400 px-2 py-1 text-sm"
            key={title}
            onClick={() => setIndex(position)}
            type="button"
          >
            Show {title}
          </button>
        ))}
      </div>
      <p className="text-sm">Slide: {slides[index]?.title}</p>
    </div>
  )
}

/**
 * Pass **index** and **onIndexChange** to control the visible slide, for example to show one from outside.
 */
export const Controlled: Story = {
  render: () => <ControlledCarousel />,
}

/**
 * Use **slideLabel** and the label props to translate what a screen reader says.
 */
export const Translated: Story = {
  render: () => (
    <Carousel
      aria-label="Lugares destacados"
      slideLabel={(index, count) => `${index + 1} de ${count}`}
      style={frame}
    >
      <Panels />
      <CarouselPrev label="Anterior" />
      <CarouselNext label="Siguiente" />
      <CarouselDots
        aria-label="Elegir una diapositiva"
        dotLabel={(index, count) => `Diapositiva ${index + 1} de ${count}`}
      />
    </Carousel>
  ),
}

/**
 * Some examples of Carousel with Tailwind classes. With `variant="unstyled"` the Plume classes are gone and the
 * structure stays: the strip scrolls and snaps, and the slides take the full width. Style the controls with their
 * own classes, and use `data-[active]:` on the dots.
 */
export const Tailwind: Story = {
  parameters: {
    docs: {
      source: {
        code: `<Carousel aria-label="Featured places" className="relative w-[28rem] max-w-full" variant="unstyled">
  <CarouselSlides className="overflow-x-auto rounded-xl">
    <CarouselSlide><div className="grid h-40 place-items-center bg-primary-solid text-primary-on-solid">Mountains</div></CarouselSlide>
    <CarouselSlide><div className="grid h-40 place-items-center bg-success-solid text-success-on-solid">Forest</div></CarouselSlide>
  </CarouselSlides>
  <CarouselPrev className="absolute left-2 top-16 size-9 rounded-full bg-surface text-foreground shadow disabled:opacity-40" />
  <CarouselNext className="absolute right-2 top-16 size-9 rounded-full bg-surface text-foreground shadow disabled:opacity-40" />
  <CarouselDots className="mt-3 gap-2" dotClassName="size-2.5 rounded-full bg-border data-[active]:w-6 data-[active]:bg-primary-solid" />
</Carousel>`,
      },
    },
  },
  render: () => (
    <Carousel aria-label="Featured places" className="relative" style={frame} variant="unstyled">
      <CarouselSlides className="rounded-xl">
        {slides.slice(0, 3).map(({ title }, position) => (
          <CarouselSlide key={title}>
            <div
              className={`grid h-40 place-items-center font-semibold text-primary-on-solid ${position === 0 ? 'bg-primary-solid' : 'bg-secondary-solid'}`}
            >
              {title}
            </div>
          </CarouselSlide>
        ))}
      </CarouselSlides>
      <CarouselPrev className="absolute left-2 top-16 size-9 rounded-full bg-surface text-foreground shadow disabled:opacity-40" />
      <CarouselNext className="absolute right-2 top-16 size-9 rounded-full bg-surface text-foreground shadow disabled:opacity-40" />
      <CarouselDots
        className="mt-3 gap-2"
        dotClassName="size-2.5 rounded-full bg-border data-[active]:w-6 data-[active]:bg-primary-solid"
      />
    </Carousel>
  ),
}

/**
 * Some examples of Carousel with Bootstrap classes: `btn` for the buttons and `card` for the slides. Bootstrap's
 * own carousel needs its JavaScript and a different structure, so the story composes its utilities and keeps the
 * behavior of the component. Bootstrap can't style a dot from its `data-active` attribute, so the story adds that one rule.
 */
export const Bootstrap: Story = {
  parameters: {
    docs: {
      source: {
        code: `<Carousel aria-label="Featured places" variant="unstyled">
  <CarouselSlides>
    <CarouselSlide><div className="card text-bg-primary p-5 text-center">Mountains</div></CarouselSlide>
    <CarouselSlide><div className="card text-bg-success p-5 text-center">Forest</div></CarouselSlide>
  </CarouselSlides>
  <style>{'[data-plume-carousel-dot][data-active]{background-color:var(--bs-primary)}'}</style>
  <div className="d-flex align-items-center justify-content-between mt-2">
    <CarouselPrev className="btn btn-outline-secondary btn-sm" />
    <CarouselDots className="d-flex gap-2" dotClassName="rounded-circle bg-secondary-subtle p-1 border-0" />
    <CarouselNext className="btn btn-outline-secondary btn-sm" />
  </div>
</Carousel>`,
      },
    },
  },
  render: () => (
    <Carousel aria-label="Featured places" style={frame} variant="unstyled">
      <CarouselSlides>
        {slides.slice(0, 3).map(({ title }, position) => (
          <CarouselSlide key={title}>
            <div
              className={`card p-5 text-center ${position === 0 ? 'text-bg-primary' : 'text-bg-success'}`}
            >
              {title}
            </div>
          </CarouselSlide>
        ))}
      </CarouselSlides>
      <style>{'[data-plume-carousel-dot][data-active]{background-color:var(--bs-primary)}'}</style>
      <div className="d-flex align-items-center justify-content-between mt-2">
        <CarouselPrev className="btn btn-outline-secondary btn-sm" />
        <CarouselDots
          className="d-flex gap-2"
          dotClassName="rounded-circle bg-secondary p-1 border-0"
        />
        <CarouselNext className="btn btn-outline-secondary btn-sm" />
      </div>
    </Carousel>
  ),
}
