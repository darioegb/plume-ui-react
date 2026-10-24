import { render, screen } from '@testing-library/react'
import { createRef } from 'react'
import { Divider, DividerLabel } from '..'

describe('DividerLabel', () => {
  it('takes the class, the style and the ref of the label', () => {
    const ref = createRef<HTMLSpanElement>()
    render(
      <Divider>
        <DividerLabel className="mine" ref={ref} style={{ margin: '2px' }}>
          or
        </DividerLabel>
      </Divider>,
    )
    expect(screen.getByText('or')).toHaveClass('label', 'mine')
    expect(screen.getByText('or')).toHaveStyle({ margin: '2px' })
    expect(ref.current).toHaveAttribute('data-plume-divider-label')
  })

  it('lets you put other content next to the label', () => {
    render(
      <Divider>
        <svg data-testid="icon" />
        <DividerLabel>or</DividerLabel>
      </Divider>,
    )
    expect(screen.getByTestId('icon')).toBeInTheDocument()
    expect(screen.getByText('or').parentElement).toHaveClass('labeled')
  })

  it('wraps a plain child in the label part', () => {
    render(<Divider>or</Divider>)
    expect(screen.getByText('or')).toHaveAttribute('data-plume-divider-label')
  })
})
