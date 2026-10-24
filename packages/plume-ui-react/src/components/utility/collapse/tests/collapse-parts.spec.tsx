import { render, screen } from '@testing-library/react'
import { createRef } from 'react'
import type { CSSProperties } from 'react'
import { Collapse, CollapseBody, CollapseClip } from '..'

describe('Collapse parts', () => {
  it('renders the clip and the body around the content by default', () => {
    const { container } = render(<Collapse>Text</Collapse>)
    const clip = container.querySelector('[data-plume-collapse-clip]')
    const body = screen.getByText('Text')
    expect(clip?.parentElement).toBe(container.firstChild)
    expect(body).toHaveAttribute('data-plume-collapse-body')
    expect(body.parentElement).toBe(clip)
  })

  it('has no class on the clip or the body without any', () => {
    const { container } = render(<Collapse>Text</Collapse>)
    expect(container.querySelector('[data-plume-collapse-clip]')).not.toHaveAttribute('class')
    expect(screen.getByText('Text')).not.toHaveAttribute('class')
  })

  it('wraps a composed body in the clip', () => {
    const { container } = render(
      <Collapse>
        <CollapseBody className="mine">Text</CollapseBody>
      </Collapse>,
    )
    const clip = container.querySelector('[data-plume-collapse-clip]')
    expect(clip?.children).toHaveLength(1)
    expect(screen.getByText('Text')).toHaveClass('mine')
    expect(container.querySelectorAll('[data-plume-collapse-body]')).toHaveLength(1)
  })

  it('renders a composed clip as it is', () => {
    const { container } = render(
      <Collapse>
        <CollapseClip className="clip">
          <CollapseBody className="body">Text</CollapseBody>
        </CollapseClip>
      </Collapse>,
    )
    expect(container.querySelectorAll('[data-plume-collapse-clip]')).toHaveLength(1)
    expect(container.querySelector('[data-plume-collapse-clip]')).toHaveClass('clip')
    expect(screen.getByText('Text')).toHaveClass('body')
  })

  it('lets the clip hold something other than a CollapseBody', () => {
    render(
      <Collapse>
        <CollapseClip>
          <p>Free content</p>
        </CollapseClip>
      </Collapse>,
    )
    expect(screen.getByText('Free content').parentElement).toHaveAttribute(
      'data-plume-collapse-clip',
    )
  })

  it('forwards the ref, the style and the attributes of each part', () => {
    const clip = createRef<HTMLDivElement>()
    const body = createRef<HTMLDivElement>()
    render(
      <Collapse>
        <CollapseClip ref={clip} style={{ '--probe': 'red' } as CSSProperties} title="Clip">
          <CollapseBody ref={body} style={{ '--probe': 'pink' } as CSSProperties} title="Body">
            Text
          </CollapseBody>
        </CollapseClip>
      </Collapse>,
    )
    expect(clip.current).toHaveAttribute('data-plume-collapse-clip')
    expect(clip.current).toHaveAttribute('title', 'Clip')
    expect(clip.current).toHaveStyle('--probe: red')
    expect(body.current).toBe(screen.getByText('Text'))
    expect(body.current).toHaveAttribute('title', 'Body')
    expect(body.current).toHaveStyle('--probe: pink')
  })

  it('keeps the user class on the body in every variant', () => {
    render(
      <Collapse variant="unstyled">
        <CollapseBody className="mine">Text</CollapseBody>
      </Collapse>,
    )
    expect(screen.getByText('Text')).toHaveAttribute('class', 'mine')
  })

  it('renders its parts without a context, so they work in a Server Component', () => {
    render(<CollapseBody>Alone</CollapseBody>)
    expect(screen.getByText('Alone')).toBeInTheDocument()
  })
})
