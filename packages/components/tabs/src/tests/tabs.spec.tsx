import { render, fireEvent, waitFor } from '@testing-library/react'
import { Tabs } from '..'

describe('Tabs Component', () => {
  it('should call onTabChange with the correct index when a tab is clicked', () => {
    const onTabChangeMock = jest.fn()
    const { getByText } = render(
      <Tabs
        onTabChange={onTabChangeMock}
        panelList={[
          { content: <div>Panel 1 Content</div> },
          { content: <div>Panel 2 Content</div> },
        ]}
        tabList={[{ label: 'Tab 1' }, { label: 'Tab 2' }]}
      />,
    )

    fireEvent.click(getByText('Tab 2'))

    expect(onTabChangeMock).toHaveBeenCalledWith(1)
  })

  it('should handle disabled tabs correctly', () => {
    const onTabChangeMock = jest.fn()
    const { getByText } = render(
      <Tabs
        onTabChange={onTabChangeMock}
        panelList={[
          { content: <div>Panel 1 Content</div> },
          { content: <div>Panel 2 Content</div> },
          { content: <div>Panel 3 Content</div> },
        ]}
        tabList={[{ label: 'Tab 1' }, { label: 'Tab 2', disabled: true }, { label: 'Tab 3' }]}
      />,
    )

    fireEvent.click(getByText('Tab 2'))

    expect(onTabChangeMock).not.toHaveBeenCalled()
  })

  it('should switch to the correct panel when a tab is clicked', async () => {
    const { getByText, getByLabelText } = render(
      <Tabs
        panelList={[
          { content: <div>Panel 1 Content</div> },
          { content: <div>Panel 2 Content</div> },
        ]}
        tabList={[{ label: 'Tab 1' }, { label: 'Tab 2' }]}
      />,
    )

    fireEvent.click(getByText('Tab 2'))

    // Wait for the panel to be visible
    await waitFor(() => {
      expect(getByLabelText('Tab Panel')).toHaveTextContent('Panel 2 Content')
    })
  })

  it('should apply custom styles correctly', () => {
    const customStyles = { backgroundColor: 'red', color: 'white' }
    const { container } = render(
      <Tabs
        customStyles={customStyles}
        panelList={[{ content: <div>Panel 1 Content</div> }]}
        tabList={[{ label: 'Tab 1' }]}
      />,
    )

    const tabsContainer = container.firstChild as HTMLDivElement
    expect(tabsContainer.style.backgroundColor).toBe('red')
    expect(tabsContainer.style.color).toBe('white')
  })

  it('should apply the specified colorScheme', () => {
    const { container } = render(
      <Tabs
        colorScheme="primary"
        panelList={[{ content: <div>Panel 1 Content</div> }]}
        tabList={[{ label: 'Tab 1', disabled: false }]}
      />,
    )

    const tabsContainer = container.firstChild as HTMLDivElement

    expect(getComputedStyle(tabsContainer).getPropertyValue('--tabs-scheme')).toBe(
      'rgb(99, 102, 241)',
    )
  })

  it('should not apply styles in unstyled mode', () => {
    const { container } = render(
      <Tabs
        panelList={[{ content: <div>Panel 1 Content</div> }]}
        tabList={[{ label: 'Tab 1', disabled: false }]}
        variant="unstyled"
      />,
    )

    const tabsContainer = container.firstChild as HTMLDivElement

    // Verifica que no haya clases de estilo aplicadas
    expect(tabsContainer.className).toBe('')

    // Verifica que no haya estilos inline aplicados
    // expect(tabsContainer.style.length).toBe(0)
  })
})
