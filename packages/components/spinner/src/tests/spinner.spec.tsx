import { render } from '@testing-library/react'
import { Spinner } from '..'

describe('Spinner component', () => {
  it('renders default spinner', () => {
    const { container } = render(<Spinner />)
    const spinnerElement = container.querySelector('.solid')
    expect(spinnerElement).toBeInTheDocument()
  })

  it('renders spinner with custom size', () => {
    const { container } = render(<Spinner size="lg" />)
    const spinnerElement = container.querySelector('.solid')
    expect(spinnerElement).toHaveClass('lg solid')
  })

  it('renders spinner with custom thickness', () => {
    const { container } = render(<Spinner thickness={5} />)
    const spinnerElement = container.querySelector('.solid')
    expect(spinnerElement).toHaveStyle('--border-width: 5px')
  })

  it('renders spinner with custom color', () => {
    const { container } = render(<Spinner borderColor="blue" />)
    const spinnerElement = container.querySelector('.solid')
    expect(spinnerElement).toHaveStyle('--color: blue;')
  })

  it('renders spinner with individual border colors', () => {
    const { container } = render(
      <Spinner
        borderBottomColor="blue"
        borderLeftColor="purple"
        borderRightColor="green"
        borderTopColor="red"
      />,
    )
    const spinnerElement = container.querySelector('.solid')
    expect(spinnerElement).toHaveStyle(`
      --border-top-color: red;
      --border-right-color: green;
      --border-bottom-color: blue;
      --border-left-color: purple;
    `)
  })

  it('renders spinner with custom speed', () => {
    const { container } = render(<Spinner speed="0.5s" />)
    const spinnerElement = container.querySelector('.solid')
    expect(spinnerElement).toHaveStyle('--animation-duration: 0.5s;')
  })

  it('renders spinner with custom styles', () => {
    const { container } = render(
      <Spinner
        customStyles={{ backgroundColor: 'lightgray', color: 'black' }}
      />,
    )
    const spinnerElement = container.querySelector('.solid')
    expect(spinnerElement).toHaveStyle(`
      background-color: lightgray;
      color: black;
    `)
  })

  it('renders spinner with different variant', () => {
    const { container } = render(<Spinner variant="dashed" />)
    const spinnerElement = container.querySelector('.dashed')
    expect(spinnerElement).toHaveClass('dashed')
  })
})
