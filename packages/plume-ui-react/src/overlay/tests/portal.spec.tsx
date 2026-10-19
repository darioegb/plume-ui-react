import { render, screen } from '@testing-library/react'
import { renderToString } from 'react-dom/server'
import { ThemeProvider } from '../../theme'
import { Portal } from '../portal'

describe('Portal', () => {
  it('renders nothing on the server', () => {
    expect(renderToString(<Portal>content</Portal>)).toBe('')
  })

  it('renders its children into the document body', () => {
    const { container } = render(
      <Portal>
        <p>portaled</p>
      </Portal>,
    )
    expect(document.body).toContainElement(screen.getByText('portaled'))
    expect(container).not.toContainElement(screen.getByText('portaled'))
    expect(screen.getByText('portaled').parentElement).toBe(document.body)
  })

  it('renders into the container it is given', () => {
    const target = document.createElement('div')
    document.body.appendChild(target)
    render(
      <Portal container={target}>
        <p>portaled</p>
      </Portal>,
    )
    expect(target).toContainElement(screen.getByText('portaled'))
    target.remove()
  })

  it('renders into the theme root so the content inherits the tokens', () => {
    render(
      <ThemeProvider applyToBody={false} theme={{ colors: { primary: { 500: '#ff0000' } } }}>
        <Portal>
          <p>portaled</p>
        </Portal>
      </ThemeProvider>,
    )
    const root = screen.getByText('portaled').closest('.plume-root') as HTMLElement
    expect(root).not.toBeNull()
    expect(root).toHaveStyle('--plume-color-primary-500: #ff0000')
    expect(root).toHaveAttribute('data-plume-color-mode', 'light')
  })

  it('uses the closest theme root when providers are nested', () => {
    render(
      <ThemeProvider applyToBody={false} defaultColorMode="light">
        <ThemeProvider applyToBody={false} defaultColorMode="dark">
          <Portal>
            <p>portaled</p>
          </Portal>
        </ThemeProvider>
      </ThemeProvider>,
    )
    expect(screen.getByText('portaled').closest('.plume-root')).toHaveAttribute(
      'data-plume-color-mode',
      'dark',
    )
  })

  it('removes its content when it unmounts', () => {
    const { unmount } = render(
      <Portal>
        <p>portaled</p>
      </Portal>,
    )
    unmount()
    expect(screen.queryByText('portaled')).not.toBeInTheDocument()
  })
})
