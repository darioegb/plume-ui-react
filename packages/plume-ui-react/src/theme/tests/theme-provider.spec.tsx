import type { Mock } from 'vitest'
import { act, render, renderHook, screen } from '@testing-library/react'
import { userEvent } from '@testing-library/user-event'
import { defaultDarkTheme, defaultTheme } from '../config'
import { ThemeProvider, useTheme } from '../theme-provider'

type Listener = () => void

function mockSystemColorScheme(initiallyDark: boolean): {
  setDark: (dark: boolean) => void
  removeEventListener: Mock
} {
  const listeners = new Set<Listener>()
  const query = {
    matches: initiallyDark,
    addEventListener: vi.fn((_: string, listener: Listener) => listeners.add(listener)),
    removeEventListener: vi.fn((_: string, listener: Listener) => listeners.delete(listener)),
  }
  window.matchMedia = vi.fn().mockReturnValue(query)
  return {
    setDark: (dark) => {
      query.matches = dark
      listeners.forEach((listener) => listener())
    },
    removeEventListener: query.removeEventListener,
  }
}

function ColorModeProbe(): React.ReactNode {
  const { colorMode, setColorMode, theme } = useTheme()
  return (
    <>
      <output>{colorMode}</output>
      <span data-testid="background">{theme.semantic.background}</span>
      <button onClick={() => setColorMode('dark')} type="button">
        dark
      </button>
      <button onClick={() => setColorMode('light')} type="button">
        light
      </button>
    </>
  )
}

const root = (): HTMLElement => screen.getByRole('status').closest('.plume-root') as HTMLElement

describe('ThemeProvider', () => {
  afterEach(() => {
    document.documentElement.removeAttribute('data-plume-color-mode')
    document.body.removeAttribute('style')
  })

  it('emits the theme as CSS variables on its root element', () => {
    render(
      <ThemeProvider>
        <ColorModeProbe />
      </ThemeProvider>,
    )
    expect(root()).toHaveStyle(`--plume-color-primary-500: ${defaultTheme.colors.primary[500]}`)
    expect(root()).toHaveAttribute('data-plume-color-mode', 'light')
  })

  it('merges a partial theme over the default one', () => {
    render(
      <ThemeProvider theme={{ colors: { primary: { 500: '#ff0000' } } }}>
        <ColorModeProbe />
      </ThemeProvider>,
    )
    expect(root()).toHaveStyle('--plume-color-primary-500: #ff0000')
    expect(root()).toHaveStyle(`--plume-color-primary-600: ${defaultTheme.colors.primary[600]}`)
  })

  it('switches between light and dark at runtime', async () => {
    const user = userEvent.setup()
    render(
      <ThemeProvider darkTheme={{ semantic: { background: '#000000' } }}>
        <ColorModeProbe />
      </ThemeProvider>,
    )

    await user.click(screen.getByRole('button', { name: 'dark' }))
    expect(screen.getByRole('status')).toHaveTextContent('dark')
    expect(screen.getByTestId('background')).toHaveTextContent('#000000')
    expect(root()).toHaveAttribute('data-plume-color-mode', 'dark')

    await user.click(screen.getByRole('button', { name: 'light' }))
    expect(screen.getByTestId('background')).toHaveTextContent(defaultTheme.semantic.background)
  })

  it('uses the default dark theme when no dark overrides are given', () => {
    render(
      <ThemeProvider defaultColorMode="dark">
        <ColorModeProbe />
      </ThemeProvider>,
    )
    expect(screen.getByTestId('background')).toHaveTextContent(
      String(defaultDarkTheme.semantic?.background),
    )
  })

  it('themes the page and restores it on unmount', () => {
    document.documentElement.setAttribute('data-plume-color-mode', 'previous')
    const { unmount } = render(
      <ThemeProvider defaultColorMode="dark">
        <ColorModeProbe />
      </ThemeProvider>,
    )
    expect(document.documentElement).toHaveAttribute('data-plume-color-mode', 'dark')
    expect(document.body.style.backgroundColor).not.toBe('')

    unmount()
    expect(document.documentElement).toHaveAttribute('data-plume-color-mode', 'previous')
    expect(document.body.style.backgroundColor).toBe('')
  })

  it('removes the page attribute on unmount when there was none', () => {
    const { unmount } = render(
      <ThemeProvider>
        <ColorModeProbe />
      </ThemeProvider>,
    )
    unmount()
    expect(document.documentElement).not.toHaveAttribute('data-plume-color-mode')
  })

  it('leaves the page alone when applyToBody is false', () => {
    render(
      <ThemeProvider applyToBody={false}>
        <ColorModeProbe />
      </ThemeProvider>,
    )
    expect(document.documentElement).not.toHaveAttribute('data-plume-color-mode')
    expect(document.body.style.backgroundColor).toBe('')
  })

  it('follows the system preference when set to system', () => {
    const system = mockSystemColorScheme(true)
    const { unmount } = render(
      <ThemeProvider defaultColorMode="system">
        <ColorModeProbe />
      </ThemeProvider>,
    )
    expect(screen.getByRole('status')).toHaveTextContent('dark')

    act(() => system.setDark(false))
    expect(screen.getByRole('status')).toHaveTextContent('light')

    unmount()
    expect(system.removeEventListener).toHaveBeenCalledWith('change', expect.any(Function))
  })

  it('applies the className and style to its root element', () => {
    render(
      <ThemeProvider className="app" style={{ padding: '1rem' }}>
        <ColorModeProbe />
      </ThemeProvider>,
    )
    expect(root()).toHaveClass('plume-root app')
    expect(root().style.padding).toBe('1rem')
  })
})

describe('useTheme', () => {
  it('throws outside of a ThemeProvider', () => {
    vi.spyOn(console, 'error').mockImplementation(() => undefined)
    expect(() => {
      renderHook(() => useTheme())
    }).toThrow('useTheme must be used within a <ThemeProvider>')
    vi.restoreAllMocks()
  })
})
