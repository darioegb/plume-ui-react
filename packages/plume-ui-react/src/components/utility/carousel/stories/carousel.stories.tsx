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
  fill = false,
}: Readonly<{ className?: string; fill?: boolean }>): React.ReactNode {
  return (
    <CarouselSlides>
      {slides.map(({ background, caption, title }) => (
        <CarouselSlide className={className} key={title}>
          <div
            style={{
              alignItems: 'flex-start',
              background,
              boxSizing: 'border-box',
              color: '#fff',
              display: 'flex',
              flexDirection: 'column',
              height: fill ? '100%' : '11rem',
              justifyContent: 'flex-end',
              padding: fill ? '1rem 1rem 3.75rem 1.5rem' : '1rem 3.5rem',
              textShadow: '0 1px 2px rgb(0 0 0 / 50%)',
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

function Arrows(): React.ReactNode {
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
    variant: { control: 'radio', options: ['solid', 'overlay', 'unstyled'] },
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
        <Arrows />
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
 * Use the **variant** prop to pick how the buttons look: `solid` (the default) and `overlay`, which reads over a
 * photo. `unstyled` drops the Plume styles so you can style them yourself.
 */
export const Variants: Story = {
  parameters: {
    docs: {
      source: {
        code: `<Carousel aria-label="Solid" variant="solid">
  <CarouselSlides>{/* slides */}</CarouselSlides>
  <CarouselPrev />
  <CarouselNext />
  <CarouselDots />
</Carousel>
<Carousel aria-label="Overlay" variant="overlay">
  <CarouselSlides>{/* slides */}</CarouselSlides>
  <CarouselPrev />
  <CarouselNext />
  <CarouselDots />
</Carousel>
<Carousel aria-label="Unstyled" variant="unstyled">
  <CarouselSlides>{/* slides */}</CarouselSlides>
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
</Carousel>`,
      },
    },
  },
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', ...frame }}>
      {(['solid', 'overlay'] as const).map((variant) => (
        <Carousel aria-label={variant} key={variant} variant={variant}>
          <Panels />
          <Arrows />
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
 * The **appearance** of `CarouselDots` changes the indicator, not only its size: `dots` (the default) are small
 * circles with the active one stretched, `bars` are thin segments like the progress of a story, and `numbers` are
 * buttons with the number of the slide, for a long list where a dot says nothing.
 */
export const Indicators: Story = {
  parameters: {
    docs: {
      source: {
        code: `<Carousel aria-label="Dots">
  <CarouselSlides>{/* slides */}</CarouselSlides>
  <CarouselPrev />
  <CarouselNext />
  <CarouselDots appearance="dots" />
</Carousel>
<Carousel aria-label="Bars">
  <CarouselSlides>{/* slides */}</CarouselSlides>
  <CarouselDots appearance="bars" />
</Carousel>
<Carousel aria-label="Numbers">
  <CarouselSlides>{/* slides */}</CarouselSlides>
  <CarouselDots appearance="numbers" />
</Carousel>`,
      },
    },
  },
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', ...frame }}>
      <Carousel aria-label="Dots">
        <Panels />
        <CarouselPrev />
        <CarouselNext />
        <CarouselDots appearance="dots" />
      </Carousel>
      <Carousel aria-label="Bars">
        <Panels />
        <CarouselDots appearance="bars" />
      </Carousel>
      <Carousel aria-label="Numbers">
        <Panels />
        <CarouselDots appearance="numbers" />
      </Carousel>
    </div>
  ),
}

/**
 * With `appearance="thumbnails"` each dot is a box that you fill with a preview of its slide: pass a function as
 * the `children` of `CarouselDots` that returns a `CarouselDot` with an image (or any element, it fills the box).
 * The active thumbnail is outlined with the color of the scheme. Together with the arrows it is the gallery with
 * a strip of previews found in a product page.
 */
export const Thumbnails: Story = {
  parameters: {
    docs: {
      source: {
        code: `<Carousel aria-label="Product photos">
  <CarouselSlides>
    {photos.map((photo) => (
      <CarouselSlide key={photo.src}>
        <img alt={photo.alt} className="h-64 w-full object-cover" src={photo.src} />
      </CarouselSlide>
    ))}
  </CarouselSlides>
  <CarouselPrev />
  <CarouselNext />
  <CarouselDots appearance="thumbnails">
    {(position) => (
      <CarouselDot>
        <img alt="" src={photos[position].thumbnail} />
      </CarouselDot>
    )}
  </CarouselDots>
</Carousel>`,
      },
    },
  },
  render: () => (
    <Carousel aria-label="Featured places" style={frame}>
      <Panels />
      <CarouselPrev />
      <CarouselNext />
      <CarouselDots appearance="thumbnails" style={{ justifyContent: 'flex-start', overflowX: 'auto' }}>
        {(position) => (
          <CarouselDot>
            <span style={{ background: slides[position]?.background }} />
          </CarouselDot>
        )}
      </CarouselDots>
    </Carousel>
  ),
}

/**
 * With `orientation="vertical"` the slides stack and move up and down, the buttons go to the top and the bottom and the
 * dots become a column at the end. Give the Carousel a height, because the slides fill it. The dots are then
 * moved with <kbd>↑</kbd> and <kbd>↓</kbd>. It works with every appearance, thumbnails included.
 */
export const Vertical: Story = {
  parameters: {
    docs: {
      source: {
        code: `<Carousel aria-label="Featured places" orientation="vertical" style={{ height: '16rem' }}>
  <CarouselSlides>{/* slides */}</CarouselSlides>
  <CarouselPrev />
  <CarouselNext />
  <CarouselDots />
</Carousel>
<Carousel aria-label="Thumbnails" orientation="vertical" style={{ height: '16rem' }}>
  <CarouselSlides>{/* slides */}</CarouselSlides>
  <CarouselDots appearance="thumbnails">
    {(position) => (
      <CarouselDot>
        <img alt="" src={photos[position].thumbnail} />
      </CarouselDot>
    )}
  </CarouselDots>
</Carousel>`,
      },
    },
  },
  render: () => (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '2rem', maxWidth: '100%' }}>
      <Carousel aria-label="Vertical" orientation="vertical" style={{ height: '16rem', width: '16rem' }}>
        <Panels fill />
        <CarouselPrev />
        <CarouselNext />
        <CarouselDots />
      </Carousel>
      <Carousel
        aria-label="Vertical with thumbnails"
        orientation="vertical"
        style={{ height: '16rem', width: '22rem' }}
      >
        <Panels fill />
        <CarouselDots appearance="thumbnails">
          {(position) => (
            <CarouselDot>
              <span style={{ background: slides[position]?.background }} />
            </CarouselDot>
          )}
        </CarouselDots>
      </Carousel>
    </div>
  ),
}

/**
 * **controls** decides where the buttons sit. `overlay` (the default) puts them over the slides, and `inline` leaves
 * them where you place them, so you can build a bar under the slides with the arrows on either side of the dots
 * or a counter, without fighting the positions of the Plume styles.
 */
export const Controls: Story = {
  parameters: {
    docs: {
      source: {
        code: `<Carousel aria-label="Featured places" controls="inline">
  <CarouselSlides>{/* slides */}</CarouselSlides>
  <div className="mt-3 flex items-center justify-between">
    <CarouselPrev />
    <CarouselDots appearance="bars" />
    <CarouselNext />
  </div>
</Carousel>`,
      },
    },
  },
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', ...frame }}>
      <Carousel aria-label="Bar with bars" controls="inline">
        <Panels />
        <div className="mt-3 flex items-center justify-between">
          <CarouselPrev />
          <CarouselDots appearance="bars" />
          <CarouselNext />
        </div>
      </Carousel>
      <Carousel aria-label="Bar with numbers" colorScheme="secondary" controls="inline">
        <Panels />
        <div className="mt-3 flex items-center justify-center gap-2">
          <CarouselPrev />
          <CarouselDots appearance="numbers" />
          <CarouselNext />
        </div>
      </Carousel>
    </div>
  ),
}

/**
 * Use the **size** prop to change the size of the buttons and the dots.
 */
export const Sizes: Story = {
  parameters: {
    docs: {
      source: {
        code: `<div className="flex flex-col gap-8">
  <Carousel aria-label="Size sm" size="sm">
    <CarouselSlides>
      <CarouselSlide>
        <div className="h-44 bg-primary-solid p-4 text-primary-on-solid">Mountains</div>
      </CarouselSlide>
      <CarouselSlide>
        <div className="h-44 bg-success-solid p-4 text-success-on-solid">Forest</div>
      </CarouselSlide>
    </CarouselSlides>
    <CarouselPrev />
    <CarouselNext />
    <CarouselDots />
  </Carousel>
  <Carousel aria-label="Size md" size="md">
    <CarouselSlides>
      <CarouselSlide>
        <div className="h-44 bg-primary-solid p-4 text-primary-on-solid">Mountains</div>
      </CarouselSlide>
      <CarouselSlide>
        <div className="h-44 bg-success-solid p-4 text-success-on-solid">Forest</div>
      </CarouselSlide>
    </CarouselSlides>
    <CarouselPrev />
    <CarouselNext />
    <CarouselDots />
  </Carousel>
  <Carousel aria-label="Size lg" size="lg">
    <CarouselSlides>
      <CarouselSlide>
        <div className="h-44 bg-primary-solid p-4 text-primary-on-solid">Mountains</div>
      </CarouselSlide>
      <CarouselSlide>
        <div className="h-44 bg-success-solid p-4 text-success-on-solid">Forest</div>
      </CarouselSlide>
    </CarouselSlides>
    <CarouselPrev />
    <CarouselNext />
    <CarouselDots />
  </Carousel>
</div>`,
      },
    },
  },
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', ...frame }}>
      {(['sm', 'md', 'lg'] as const).map((size) => (
        <Carousel aria-label={`Size ${size}`} key={size} size={size}>
          <Panels />
          <Arrows />
        </Carousel>
      ))}
    </div>
  ),
}

/**
 * Use the **colorScheme** prop to pick a color from the theme. It colors the buttons and the active dot.
 */
export const Colors: Story = {
  parameters: {
    docs: {
      source: {
        code: `<div className="flex flex-col gap-6">
  <Carousel aria-label="primary" colorScheme="primary" size="sm">
    <CarouselSlides>
      <CarouselSlide>
        <div className="h-44 bg-primary-solid p-4 text-primary-on-solid">Mountains</div>
      </CarouselSlide>
      <CarouselSlide>
        <div className="h-44 bg-success-solid p-4 text-success-on-solid">Forest</div>
      </CarouselSlide>
    </CarouselSlides>
    <CarouselPrev />
    <CarouselNext />
    <CarouselDots />
  </Carousel>
  <Carousel aria-label="success" colorScheme="success" size="sm">
    <CarouselSlides>
      <CarouselSlide>
        <div className="h-44 bg-primary-solid p-4 text-primary-on-solid">Mountains</div>
      </CarouselSlide>
      <CarouselSlide>
        <div className="h-44 bg-success-solid p-4 text-success-on-solid">Forest</div>
      </CarouselSlide>
    </CarouselSlides>
    <CarouselPrev />
    <CarouselNext />
    <CarouselDots />
  </Carousel>
  <Carousel aria-label="error" colorScheme="error" size="sm">
    <CarouselSlides>
      <CarouselSlide>
        <div className="h-44 bg-primary-solid p-4 text-primary-on-solid">Mountains</div>
      </CarouselSlide>
      <CarouselSlide>
        <div className="h-44 bg-success-solid p-4 text-success-on-solid">Forest</div>
      </CarouselSlide>
    </CarouselSlides>
    <CarouselPrev />
    <CarouselNext />
    <CarouselDots />
  </Carousel>
</div>`,
      },
    },
  },
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
          <Arrows />
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
  parameters: {
    docs: {
      source: {
        code: `<Carousel aria-label="Several slides">
  <CarouselSlides style={{ gap: '0.75rem' }}>
    <CarouselSlide style={{ flexBasis: '45%' }}>
      <div className="grid h-32 place-items-center rounded-lg bg-primary-solid text-primary-on-solid">
        Mountains
      </div>
    </CarouselSlide>
    <CarouselSlide style={{ flexBasis: '45%' }}>
      <div className="grid h-32 place-items-center rounded-lg bg-success-solid text-success-on-solid">
        Forest
      </div>
    </CarouselSlide>
    <CarouselSlide style={{ flexBasis: '45%' }}>
      <div className="grid h-32 place-items-center rounded-lg bg-error-solid text-error-on-solid">
        Desert
      </div>
    </CarouselSlide>
  </CarouselSlides>
  <CarouselPrev />
  <CarouselNext />
  <CarouselDots />
</Carousel>`,
      },
    },
  },
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
      <Arrows />
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
        <div
          style={{
            alignItems: 'center',
            display: 'flex',
            gap: '0.5rem',
            justifyContent: 'center',
            marginTop: '0.5rem',
          }}
        >
          <CarouselPlayPause style={{ margin: 0 }} />
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
        <Arrows />
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
  parameters: {
    docs: {
      source: {
        code: `function Example() {
  const slides = ['Mountains', 'Forest', 'Desert', 'Canyon']
  const [index, setIndex] = useState(1)
  return (
    <div className="flex flex-col gap-4">
      <Carousel aria-label="Controlled" index={index} onIndexChange={setIndex}>
        <CarouselSlides>
          {slides.map((title) => (
            <CarouselSlide key={title}>
              <div className="grid h-44 place-items-center bg-primary-solid text-primary-on-solid">
                {title}
              </div>
            </CarouselSlide>
          ))}
        </CarouselSlides>
        <CarouselPrev />
        <CarouselNext />
        <CarouselDots />
      </Carousel>
      <div className="flex flex-wrap items-center gap-2">
        {slides.map((title, position) => (
          <button key={title} onClick={() => setIndex(position)} type="button">
            Show {title}
          </button>
        ))}
      </div>
      <p>Slide: {slides[index]}</p>
    </div>
  )
}`,
      },
    },
  },
  render: () => <ControlledCarousel />,
}

/**
 * Use **labels** to translate what a screen reader says.
 */
export const Translated: Story = {
  parameters: {
    docs: {
      source: {
        code: `<Carousel
  aria-label="Lugares destacados"
  labels={{
    dot: (index, count) => \`Diapositiva \${index + 1} de \${count}\`,
    dots: 'Elegir una diapositiva',
    next: 'Siguiente',
    previous: 'Anterior',
    slide: (index, count) => \`\${index + 1} de \${count}\`,
  }}
>
  <CarouselSlides>
    <CarouselSlide>
      <div className="h-44 bg-primary-solid p-4 text-primary-on-solid">Montañas</div>
    </CarouselSlide>
    <CarouselSlide>
      <div className="h-44 bg-success-solid p-4 text-success-on-solid">Bosque</div>
    </CarouselSlide>
  </CarouselSlides>
  <CarouselPrev />
  <CarouselNext />
  <CarouselDots />
</Carousel>`,
      },
    },
  },
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
 * themselves. Here the dots use the `numbers` appearance, and each one is named and titled after its slide.
 */
export const Compound: Story = {
  parameters: {
    docs: {
      source: {
        code: `<Carousel aria-label="Featured places">
  <CarouselSlides>
    <CarouselSlide>
      <div className="h-44 bg-primary-solid p-4 text-primary-on-solid">Mountains</div>
    </CarouselSlide>
    <CarouselSlide>
      <div className="h-44 bg-success-solid p-4 text-success-on-solid">Forest</div>
    </CarouselSlide>
  </CarouselSlides>
  <CarouselPrev />
  <CarouselNext />
  <CarouselDots appearance="numbers">
    {(position) => (
      <CarouselDot aria-label={\`Go to \${titles[position]}\`} title={titles[position]}>
        {position + 1}
      </CarouselDot>
    )}
  </CarouselDots>
</Carousel>`,
      },
    },
  },
  render: () => (
    <Carousel aria-label="Featured places" style={frame}>
      <Panels />
      <CarouselPrev />
      <CarouselNext />
      <CarouselDots appearance="numbers">
        {(position) => (
          <CarouselDot
            aria-label={`Go to ${slides[position]?.title}`}
            title={slides[position]?.title}
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
    <CarouselSlide><div className="grid h-40 place-items-center bg-primary-solid font-semibold text-primary-on-solid">Mountains</div></CarouselSlide>
    <CarouselSlide><div className="grid h-40 place-items-center bg-secondary-solid font-semibold text-primary-on-solid">Forest</div></CarouselSlide>
    <CarouselSlide><div className="grid h-40 place-items-center bg-secondary-solid font-semibold text-primary-on-solid">Desert</div></CarouselSlide>
  </CarouselSlides>
  <CarouselPrev className="absolute left-2 top-16 size-9 rounded-full bg-surface text-foreground shadow disabled:opacity-40" />
  <CarouselNext className="absolute right-2 top-16 size-9 rounded-full bg-surface text-foreground shadow disabled:opacity-40" />
  <CarouselDots className="mt-3 gap-2">
    {() => <CarouselDot className="size-3 rounded-full bg-border data-[active]:bg-primary-solid" />}
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
          <CarouselDot className="size-3 rounded-full bg-border data-[active]:bg-primary-solid" />
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
    <CarouselSlide><div className="card text-bg-success p-5 text-center">Desert</div></CarouselSlide>
  </CarouselSlides>
  <style>{'.bs-carousel [data-plume-carousel-dot]{height:.75rem;width:.75rem}.bs-carousel [data-plume-carousel-dot][data-active]{background-color:var(--bs-primary)!important;opacity:1!important}'}</style>
  <div className="d-flex align-items-center justify-content-between mt-2">
    <CarouselPrev className="btn btn-outline-secondary btn-sm" />
    <CarouselDots className="d-flex gap-2">
      {() => <CarouselDot className="rounded-circle bg-secondary opacity-50 border-0" />}
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
        {
          '.bs-carousel [data-plume-carousel-dot]{height:.75rem;width:.75rem}.bs-carousel [data-plume-carousel-dot][data-active]{background-color:var(--bs-primary)!important;opacity:1!important}'
        }
      </style>
      <div className="d-flex align-items-center justify-content-between mt-2">
        <CarouselPrev className="btn btn-outline-secondary btn-sm" />
        <CarouselDots className="d-flex gap-2">
          {() => <CarouselDot className="rounded-circle bg-secondary opacity-50 border-0" />}
        </CarouselDots>
        <CarouselNext className="btn btn-outline-secondary btn-sm" />
      </div>
    </Carousel>
  ),
}
