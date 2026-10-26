import type { StoryObj, Meta } from '@storybook/react-vite'
import { useState } from 'react'
import { defaultTheme } from '../../../../theme'
import {
  Carousel,
  CarouselDot,
  CarouselDots,
  CarouselNext,
  CarouselPlayPause,
  CarouselPrev,
  CarouselSlide,
  CarouselSlides,
} from '..'

const colorSchemes = Object.keys(defaultTheme.colors)

const gradient = (from: string, to: string): string =>
  `linear-gradient(135deg, var(--plume-color-${from}-solid), var(--plume-color-${to}-solid))`

const slides = [
  { background: gradient('primary', 'purple'), caption: 'Above the clouds', title: 'Mountains' },
  { background: gradient('success', 'teal'), caption: 'A walk under the trees', title: 'Forest' },
  { background: gradient('error', 'brown'), caption: 'Sand, heat and wind', title: 'Desert' },
  { background: gradient('pink', 'purple'), caption: 'Cut by a river', title: 'Canyon' },
]

const frame = { maxWidth: '100%', width: '28rem' }

function Panels({
  className,
  light = false,
}: Readonly<{ className?: string; light?: boolean }>): React.ReactNode {
  return (
    <CarouselSlides>
      {slides.map(({ background, caption, title }) => (
        <CarouselSlide className={className} key={title}>
          <div
            style={{
              alignItems: 'flex-start',
              background: light ? 'var(--plume-surface-muted)' : background,
              boxSizing: 'border-box',
              color: light ? 'var(--plume-foreground)' : '#fff',
              display: 'flex',
              flexDirection: 'column',
              height: '11rem',
              justifyContent: 'flex-end',
              padding: '1rem 3.5rem',
              textShadow: light ? undefined : '0 1px 2px rgb(0 0 0 / 50%)',
            }}
          >
            <strong style={{ fontSize: '1.25rem' }}>{title}</strong>
            <span style={{ fontSize: '0.875rem', opacity: 0.9 }}>{caption}</span>
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
 * text with **labels.slide**; **labels.roleDescription** and **labels.slideRoleDescription** translate the two
 * `aria-roledescription` words). Only the visible slide can be reached, and it takes the focus to be scrolled with the
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
 * The slides have no background or text of their own: what is inside a `CarouselSlide` is yours, usually an image or
 * a card. The colors in these examples come from the examples themselves, each slide is a `div` with a gradient of
 * two theme colors. The **colorScheme** only colors the buttons and the active dot.
 *
 * Each slide takes the full width. Give a `CarouselSlide` a width (`className` or `style`, like `flex-basis: 50%`)
 * to show several at once.
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
        'CarouselDot',
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
    children: { control: false },
    className: { control: 'text' },
    style: { control: false },
    index: { control: false },
    defaultIndex: { control: 'number' },
    onIndexChange: { control: false },
    loop: { control: 'boolean' },
    autoplay: { control: false },
    labels: { control: false },
    colorScheme: { control: 'select', options: colorSchemes },
    size: { control: 'radio', options: ['sm', 'md', 'lg'] },
    variant: { control: 'radio', options: ['solid', 'outline', 'ghost', 'overlay', 'unstyled'] },
    id: { control: false },
    title: { control: 'text' },
    hidden: { control: false },
    'aria-label': { control: 'text' },
    'aria-labelledby': { control: false },
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
      {(['solid', 'outline', 'ghost', 'overlay'] as const).map((variant) => (
        <Carousel aria-label={variant} key={variant} variant={variant}>
          <Panels light={variant === 'outline' || variant === 'ghost'} />
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
          <CarouselDots className="flex gap-2">
            {() => (
              <CarouselDot className="size-3 rounded-full bg-gray-300 data-[active]:bg-gray-800" />
            )}
          </CarouselDots>
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
 * Use **labels** to translate what a screen reader says.
 */
export const Translated: Story = {
  render: () => (
    <Carousel
      aria-label="Lugares destacados"
      labels={{
        dot: (index, count) => `Diapositiva ${index + 1} de ${count}`,
        dots: 'Elegir una diapositiva',
        next: 'Siguiente',
        previous: 'Anterior',
        slide: (index, count) => `${index + 1} de ${count}`,
      }}
      style={frame}
    >
      <Panels />
      <CarouselPrev />
      <CarouselNext />
      <CarouselDots />
    </Carousel>
  ),
}

/**
 * Every element of the Carousel is a part you can import, and the root holds whatever you put in it. The dots are
 * data-driven, so `CarouselDots` takes a function that gets the position of each dot, or the `CarouselDot` elements
 * themselves. Here the dots show the number of their slide.
 */
export const Compound: Story = {
  render: () => (
    <Carousel aria-label="Featured places" style={frame}>
      <Panels />
      <CarouselPrev />
      <CarouselNext />
      <CarouselDots>
        {(position) => (
          <CarouselDot
            style={{
              alignItems: 'center',
              borderRadius: '9999px',
              color: 'var(--plume-foreground)',
              display: 'inline-flex',
              fontSize: '0.75rem',
              height: '1.5rem',
              justifyContent: 'center',
              width: '1.5rem',
            }}
          >
            {position + 1}
          </CarouselDot>
        )}
      </CarouselDots>
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
  <CarouselDots className="mt-3 gap-2">
    {() => <CarouselDot className="size-2.5 rounded-full bg-border data-[active]:w-6 data-[active]:bg-primary-solid" />}
  </CarouselDots>
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
      <CarouselDots className="mt-3 gap-2">
        {() => (
          <CarouselDot className="size-2.5 rounded-full bg-border data-[active]:w-6 data-[active]:bg-primary-solid" />
        )}
      </CarouselDots>
    </Carousel>
  ),
}

/**
 * Some examples of Carousel with Bootstrap classes: `btn` for the buttons and `card` for the slides. Bootstrap's
 * own carousel needs its JavaScript and a different structure, so the story composes its utilities and keeps the
 * behavior of the component. Bootstrap can't style a dot from its `data-active` attribute, so the story adds that one rule, scoped to its own class.
 */
export const Bootstrap: Story = {
  parameters: {
    docs: {
      source: {
        code: `<Carousel aria-label="Featured places" className="bs-carousel" variant="unstyled">
  <CarouselSlides>
    <CarouselSlide><div className="card text-bg-primary p-5 text-center">Mountains</div></CarouselSlide>
    <CarouselSlide><div className="card text-bg-success p-5 text-center">Forest</div></CarouselSlide>
  </CarouselSlides>
  <style>{'.bs-carousel [data-plume-carousel-dot][data-active]{background-color:var(--bs-primary)}'}</style>
  <div className="d-flex align-items-center justify-content-between mt-2">
    <CarouselPrev className="btn btn-outline-secondary btn-sm" />
    <CarouselDots className="d-flex gap-2">
      {() => <CarouselDot className="rounded-circle bg-secondary-subtle p-1 border-0" />}
    </CarouselDots>
    <CarouselNext className="btn btn-outline-secondary btn-sm" />
  </div>
</Carousel>`,
      },
    },
  },
  render: () => (
    <Carousel aria-label="Featured places" className="bs-carousel" style={frame} variant="unstyled">
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
      <style>
        {'.bs-carousel [data-plume-carousel-dot][data-active]{background-color:var(--bs-primary)}'}
      </style>
      <div className="d-flex align-items-center justify-content-between mt-2">
        <CarouselPrev className="btn btn-outline-secondary btn-sm" />
        <CarouselDots className="d-flex gap-2">
          {() => <CarouselDot className="rounded-circle bg-secondary p-1 border-0" />}
        </CarouselDots>
        <CarouselNext className="btn btn-outline-secondary btn-sm" />
      </div>
    </Carousel>
  ),
}
