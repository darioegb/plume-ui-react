import { render, screen } from '@testing-library/react'
import { userEvent } from '@testing-library/user-event'
import { createRef, useState } from 'react'
import {
  Accordion,
  AccordionBody,
  AccordionContent,
  AccordionHeading,
  AccordionIcon,
  AccordionItem,
  AccordionTitle,
  AccordionTrigger,
} from '..'
import type { AccordionProps } from '..'

function Demo(props: Readonly<Partial<AccordionProps>>) {
  return (
    <Accordion {...(props as AccordionProps)}>
      <AccordionItem value="a">
        <AccordionTrigger>Alpha</AccordionTrigger>
        <AccordionContent>Alpha content</AccordionContent>
      </AccordionItem>
      <AccordionItem value="b">
        <AccordionTrigger>Beta</AccordionTrigger>
        <AccordionContent>Beta content</AccordionContent>
      </AccordionItem>
      <AccordionItem disabled value="c">
        <AccordionTrigger>Gamma</AccordionTrigger>
        <AccordionContent>Gamma content</AccordionContent>
      </AccordionItem>
      <AccordionItem value="d">
        <AccordionTrigger>Delta</AccordionTrigger>
        <AccordionContent>Delta content</AccordionContent>
      </AccordionItem>
    </Accordion>
  )
}

const trigger = (name: string): HTMLElement => screen.getByRole('button', { name })
const expanded = (name: string): string | null => trigger(name).getAttribute('aria-expanded')

describe('Accordion component', () => {
  describe('rendering', () => {
    it('renders a trigger and a region for every item', () => {
      render(<Demo />)
      expect(screen.getAllByRole('button')).toHaveLength(4)
      expect(document.querySelectorAll('section')).toHaveLength(4)
    })

    it('starts with every item closed', () => {
      render(<Demo />)
      expect(expanded('Alpha')).toBe('false')
      expect(expanded('Beta')).toBe('false')
    })

    it('is an outline, medium accordion by default', () => {
      const { container } = render(<Demo />)
      expect(container.firstChild).toHaveClass('accordion', 'outline', 'md')
    })

    it.each(['outline', 'filled'] as const)('supports the %s variant', (variant) => {
      const { container } = render(<Demo variant={variant} />)
      expect(container.firstChild).toHaveClass(variant)
    })

    it.each(['sm', 'md', 'lg'] as const)('supports the %s size', (size) => {
      const { container } = render(<Demo size={size} />)
      expect(container.firstChild).toHaveClass(size)
    })

    it('takes its color from the color scheme', () => {
      const { container } = render(<Demo colorScheme="success" />)
      expect(container.firstChild).toHaveStyle({
        '--accordion-solid': 'var(--plume-color-success-solid)',
        '--accordion-tint-text': 'var(--plume-color-success-tint-text)',
      })
    })

    it('keeps the className and style', () => {
      const { container } = render(<Demo className="mine" style={{ width: '300px' }} />)
      expect(container.firstChild).toHaveClass('accordion', 'mine')
      expect(container.firstChild).toHaveStyle({ width: '300px' })
    })

    it('forwards the ref to the root element', () => {
      const ref = createRef<HTMLDivElement>()
      render(
        <Accordion ref={ref}>
          <AccordionItem value="a">
            <AccordionTrigger>Alpha</AccordionTrigger>
            <AccordionContent>Alpha content</AccordionContent>
          </AccordionItem>
        </Accordion>,
      )
      expect(ref.current).toBe(document.querySelector('[data-plume-accordion]'))
    })

    it('forwards the allowed attributes to the root element', () => {
      render(<Demo aria-label="Questions" id="faq" title="FAQ" />)
      const root = document.querySelector('[data-plume-accordion]')
      expect(root).toHaveAttribute('aria-label', 'Questions')
      expect(root).toHaveAttribute('id', 'faq')
      expect(root).toHaveAttribute('title', 'FAQ')
    })

    it('renders a level 3 heading around each trigger by default', () => {
      render(<Demo />)
      expect(screen.getAllByRole('heading', { level: 3 })).toHaveLength(4)
    })

    it('uses the heading level of the trigger', () => {
      render(
        <Accordion>
          <AccordionItem value="a">
            <AccordionTrigger headingLevel={2}>Alpha</AccordionTrigger>
            <AccordionContent>Alpha content</AccordionContent>
          </AccordionItem>
        </Accordion>,
      )
      expect(screen.getByRole('heading', { level: 2, name: 'Alpha' })).toBeInTheDocument()
    })
  })

  describe('opening and closing', () => {
    it('opens an item on click', async () => {
      render(<Demo />)
      await userEvent.click(trigger('Alpha'))
      expect(expanded('Alpha')).toBe('true')
      expect(trigger('Alpha').closest('[data-plume-accordion-item]')).toHaveAttribute('data-open')
    })

    it('opens an item with Enter and Space', async () => {
      render(<Demo />)
      trigger('Alpha').focus()
      await userEvent.keyboard('{Enter}')
      expect(expanded('Alpha')).toBe('true')
      trigger('Beta').focus()
      await userEvent.keyboard(' ')
      expect(expanded('Beta')).toBe('true')
    })

    it('closes the open item when it is clicked again', async () => {
      render(<Demo />)
      await userEvent.click(trigger('Alpha'))
      await userEvent.click(trigger('Alpha'))
      expect(expanded('Alpha')).toBe('false')
    })

    it('closes the other item when one opens', async () => {
      render(<Demo />)
      await userEvent.click(trigger('Alpha'))
      await userEvent.click(trigger('Beta'))
      expect(expanded('Alpha')).toBe('false')
      expect(expanded('Beta')).toBe('true')
    })

    it('keeps the open item open when it is not collapsible', async () => {
      render(<Demo collapsible={false} defaultValue="a" />)
      await userEvent.click(trigger('Alpha'))
      expect(expanded('Alpha')).toBe('true')
    })

    it('can have several items open with the multiple type', async () => {
      render(<Demo type="multiple" />)
      await userEvent.click(trigger('Alpha'))
      await userEvent.click(trigger('Beta'))
      expect(expanded('Alpha')).toBe('true')
      expect(expanded('Beta')).toBe('true')
      await userEvent.click(trigger('Alpha'))
      expect(expanded('Alpha')).toBe('false')
      expect(expanded('Beta')).toBe('true')
    })

    it('does not toggle a disabled item', async () => {
      render(<Demo />)
      expect(trigger('Gamma')).toBeDisabled()
      await userEvent.click(trigger('Gamma'))
      expect(expanded('Gamma')).toBe('false')
      expect(trigger('Gamma').closest('[data-plume-accordion-item]')).toHaveAttribute(
        'data-disabled',
      )
    })

    it('disables every item with the disabled prop', () => {
      render(<Demo disabled />)
      screen.getAllByRole('button').forEach((button) => expect(button).toBeDisabled())
    })
  })

  describe('value', () => {
    it('starts with the default value open', () => {
      render(<Demo defaultValue="b" />)
      expect(expanded('Beta')).toBe('true')
      expect(expanded('Alpha')).toBe('false')
    })

    it('starts with several default values open', () => {
      render(<Demo defaultValue={['a', 'd']} type="multiple" />)
      expect(expanded('Alpha')).toBe('true')
      expect(expanded('Delta')).toBe('true')
      expect(expanded('Beta')).toBe('false')
    })

    it('calls onValueChange with the value, or an empty string when all close', async () => {
      const onValueChange = vi.fn()
      render(<Demo onValueChange={onValueChange} />)
      await userEvent.click(trigger('Alpha'))
      expect(onValueChange).toHaveBeenLastCalledWith('a')
      await userEvent.click(trigger('Alpha'))
      expect(onValueChange).toHaveBeenLastCalledWith('')
    })

    it('calls onValueChange with a list in the multiple type', async () => {
      const onValueChange = vi.fn()
      render(<Demo onValueChange={onValueChange} type="multiple" />)
      await userEvent.click(trigger('Alpha'))
      await userEvent.click(trigger('Beta'))
      expect(onValueChange).toHaveBeenLastCalledWith(['a', 'b'])
    })

    it('follows the value when it is controlled', async () => {
      const onValueChange = vi.fn()
      const { rerender } = render(<Demo onValueChange={onValueChange} value="a" />)
      await userEvent.click(trigger('Beta'))
      expect(onValueChange).toHaveBeenCalledWith('b')
      expect(expanded('Alpha')).toBe('true')
      expect(expanded('Beta')).toBe('false')
      rerender(<Demo onValueChange={onValueChange} value="b" />)
      expect(expanded('Beta')).toBe('true')
    })

    it('works as a controlled component', async () => {
      function Controlled() {
        const [value, setValue] = useState('a')
        return (
          <>
            <button onClick={() => setValue('d')} type="button">
              Go to Delta
            </button>
            <Demo onValueChange={setValue} value={value} />
          </>
        )
      }
      render(<Controlled />)
      await userEvent.click(screen.getByRole('button', { name: 'Go to Delta' }))
      expect(expanded('Delta')).toBe('true')
      expect(expanded('Alpha')).toBe('false')
    })
  })

  describe('accessibility', () => {
    it('connects each trigger with its region', () => {
      render(<Demo defaultValue="a" />)
      const alpha = trigger('Alpha')
      const region = screen.getByRole('region', { name: 'Alpha' })
      expect(alpha).toHaveAttribute('aria-controls', region.id)
      expect(region).toHaveAttribute('aria-labelledby', alpha.id)
    })

    it('marks the open region', () => {
      render(<Demo defaultValue="a" />)
      expect(
        document.getElementById(trigger('Alpha').getAttribute('aria-controls') ?? ''),
      ).toHaveAttribute('data-open')
      expect(
        document.getElementById(trigger('Beta').getAttribute('aria-controls') ?? ''),
      ).not.toHaveAttribute('data-open')
    })

    it('hides the icon from screen readers', () => {
      render(<Demo />)
      expect(document.querySelector('[data-plume-accordion-icon]')).toHaveAttribute(
        'aria-hidden',
        'true',
      )
    })

    it('uses a different icon, or none', () => {
      render(
        <Accordion>
          <AccordionItem value="a">
            <AccordionTrigger icon={<span>+</span>}>Alpha</AccordionTrigger>
            <AccordionContent>A</AccordionContent>
          </AccordionItem>
          <AccordionItem value="b">
            <AccordionTrigger icon={null}>Beta</AccordionTrigger>
            <AccordionContent>B</AccordionContent>
          </AccordionItem>
        </Accordion>,
      )
      expect(screen.getByText('+')).toBeInTheDocument()
      expect(trigger('Beta').querySelector('[data-plume-accordion-icon]')).toBeNull()
    })
  })

  describe('keyboard', () => {
    it('moves between the triggers with the arrows, skipping the disabled ones', async () => {
      render(<Demo />)
      trigger('Alpha').focus()
      await userEvent.keyboard('{ArrowDown}')
      expect(trigger('Beta')).toHaveFocus()
      await userEvent.keyboard('{ArrowDown}')
      expect(trigger('Delta')).toHaveFocus()
      await userEvent.keyboard('{ArrowUp}')
      expect(trigger('Beta')).toHaveFocus()
    })

    it('wraps around at the ends', async () => {
      render(<Demo />)
      trigger('Alpha').focus()
      await userEvent.keyboard('{ArrowUp}')
      expect(trigger('Delta')).toHaveFocus()
      await userEvent.keyboard('{ArrowDown}')
      expect(trigger('Alpha')).toHaveFocus()
    })

    it('goes to the first and the last trigger with Home and End', async () => {
      render(<Demo />)
      trigger('Beta').focus()
      await userEvent.keyboard('{End}')
      expect(trigger('Delta')).toHaveFocus()
      await userEvent.keyboard('{Home}')
      expect(trigger('Alpha')).toHaveFocus()
    })

    it('ignores the other keys', async () => {
      render(<Demo />)
      trigger('Alpha').focus()
      await userEvent.keyboard('{ArrowRight}')
      expect(trigger('Alpha')).toHaveFocus()
    })

    it('only moves among the triggers of its own accordion', async () => {
      render(
        <Accordion defaultValue="outer">
          <AccordionItem value="outer">
            <AccordionTrigger>Outer</AccordionTrigger>
            <AccordionContent>
              <Accordion defaultValue="inner">
                <AccordionItem value="inner">
                  <AccordionTrigger>Inner</AccordionTrigger>
                  <AccordionContent>Inner content</AccordionContent>
                </AccordionItem>
              </Accordion>
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="other">
            <AccordionTrigger>Other</AccordionTrigger>
            <AccordionContent>Other content</AccordionContent>
          </AccordionItem>
        </Accordion>,
      )
      trigger('Outer').focus()
      await userEvent.keyboard('{ArrowDown}')
      expect(trigger('Other')).toHaveFocus()
    })
  })

  describe('unstyled', () => {
    it('drops every Plume class and keeps the user ones', () => {
      render(
        <Accordion className="root" variant="unstyled">
          <AccordionItem className="item" value="a">
            <AccordionHeading className="heading">
              <AccordionTrigger className="trigger">
                <AccordionTitle className="title">Alpha</AccordionTitle>
                <AccordionIcon className="icon" />
              </AccordionTrigger>
            </AccordionHeading>
            <AccordionContent className="content">
              <AccordionBody className="body">Alpha content</AccordionBody>
            </AccordionContent>
          </AccordionItem>
        </Accordion>,
      )
      expect(document.querySelector('[data-plume-accordion]')).toHaveAttribute('class', 'root')
      expect(document.querySelector('[data-plume-accordion-item]')).toHaveAttribute('class', 'item')
      expect(trigger('Alpha')).toHaveAttribute('class', 'trigger')
      expect(screen.getByRole('heading')).toHaveAttribute('class', 'heading')
      expect(document.querySelector('[data-plume-accordion-icon]')).toHaveAttribute('class', 'icon')
      expect(document.querySelector('[data-plume-accordion-content]')).toHaveAttribute(
        'class',
        'content',
      )
      expect(screen.getByText('Alpha content')).toHaveAttribute('class', 'body')
      expect(document.querySelector('[data-plume-accordion-title]')).toHaveAttribute(
        'class',
        'title',
      )
    })

    it('has no class at all without any', () => {
      render(
        <Accordion variant="unstyled">
          <AccordionItem value="a">
            <AccordionTrigger>Alpha</AccordionTrigger>
            <AccordionContent>Alpha content</AccordionContent>
          </AccordionItem>
        </Accordion>,
      )
      expect(document.querySelector('[data-plume-accordion]')).not.toHaveAttribute('class')
      expect(trigger('Alpha')).not.toHaveAttribute('class')
    })

    it('adds the classes of the parts next to the Plume ones in every variant', () => {
      render(
        <Accordion>
          <AccordionItem value="a">
            <AccordionHeading className="heading">
              <AccordionTrigger>
                <AccordionTitle>Alpha</AccordionTitle>
                <AccordionIcon className="icon" />
              </AccordionTrigger>
            </AccordionHeading>
            <AccordionContent>
              <AccordionBody className="body">Alpha content</AccordionBody>
            </AccordionContent>
          </AccordionItem>
        </Accordion>,
      )
      expect(screen.getByRole('heading')).toHaveClass('heading')
      expect(document.querySelector('[data-plume-accordion-icon]')).toHaveClass('icon')
      expect(screen.getByText('Alpha content')).toHaveClass('body')
    })
  })

  describe('usage', () => {
    it('throws when an item is rendered outside an accordion', () => {
      const error = vi.spyOn(console, 'error').mockImplementation(() => undefined)
      expect(() => render(<AccordionItem value="a">x</AccordionItem>)).toThrow(
        'AccordionItem must be used within a <Accordion>',
      )
      error.mockRestore()
    })

    it('throws when a trigger is rendered outside an item', () => {
      const error = vi.spyOn(console, 'error').mockImplementation(() => undefined)
      expect(() =>
        render(
          <Accordion>
            <AccordionTrigger>x</AccordionTrigger>
          </Accordion>,
        ),
      ).toThrow('AccordionTrigger must be used within an <AccordionItem>')
      error.mockRestore()
    })

    it('throws when a content is rendered outside an accordion', () => {
      const error = vi.spyOn(console, 'error').mockImplementation(() => undefined)
      expect(() => render(<AccordionContent>x</AccordionContent>)).toThrow(
        'AccordionContent must be used within a <Accordion>',
      )
      error.mockRestore()
    })
  })
})
