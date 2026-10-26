import { render, fireEvent, screen, waitFor } from '@testing-library/react'
import { Tab, TabList, TabPanel, TabPanels, Tabs, type TabsProps } from '..'
import { tabsReducer } from '../tabs-reducer'

describe('Tabs Component', () => {
  it('should call onChange with the correct index when a tab is clicked', () => {
    const onChangeMock = vi.fn()
    const { getByText } = render(
      <Tabs onIndexChange={onChangeMock}>
        <TabList>
          <Tab>Tab 1</Tab>
          <Tab>Tab 2</Tab>
        </TabList>
        <TabPanels>
          <TabPanel>Panel 1 Content</TabPanel>
          <TabPanel>Panel 2 Content</TabPanel>
        </TabPanels>
      </Tabs>,
    )

    fireEvent.click(getByText('Tab 2'))

    expect(onChangeMock).toHaveBeenCalledWith(1)
  })

  it('should handle disabled tabs correctly', () => {
    const onChangeMock = vi.fn()
    const { getByText } = render(
      <Tabs onIndexChange={onChangeMock}>
        <TabList>
          <Tab>Tab 1</Tab>
          <Tab disabled>Tab 2</Tab>
        </TabList>
        <TabPanels>
          <TabPanel>Panel 1 Content</TabPanel>
          <TabPanel>Panel 2 Content</TabPanel>
        </TabPanels>
      </Tabs>,
    )

    fireEvent.click(getByText('Tab 2'))

    expect(onChangeMock).not.toHaveBeenCalled()
  })

  it('should switch to the correct panel when a tab is clicked', () => {
    const { getByText } = render(
      <Tabs>
        <TabList>
          <Tab>Tab 1</Tab>
          <Tab>Tab 2</Tab>
        </TabList>
        <TabPanels>
          <TabPanel>Panel 1 Content</TabPanel>
          <TabPanel>Panel 2 Content</TabPanel>
        </TabPanels>
      </Tabs>,
    )

    fireEvent.click(getByText('Tab 2'))

    expect(screen.getByRole('tabpanel', { name: 'Tab 2' })).toHaveTextContent('Panel 2 Content')
  })

  it('should load to the correct panel when a tab is clicked on lazy mode', async () => {
    const { getByText } = render(
      <Tabs lazy>
        <TabList>
          <Tab>Tab 1</Tab>
          <Tab>Tab 2</Tab>
        </TabList>
        <TabPanels>
          <TabPanel>Panel 1 Content</TabPanel>
          <TabPanel>Panel 2 Content</TabPanel>
        </TabPanels>
      </Tabs>,
    )

    fireEvent.click(getByText('Tab 2'))

    await waitFor(() => {
      expect(screen.getByRole('tabpanel', { name: 'Tab 2' })).toHaveTextContent('Panel 2 Content')
    })
  })

  it('should apply custom styles correctly', () => {
    const style = { backgroundColor: 'red', color: 'white' }
    const { container } = render(
      <Tabs style={style}>
        <TabList>
          <Tab label="Tab 1" />
        </TabList>
        <TabPanels>
          <TabPanel>Panel 1 Content</TabPanel>
        </TabPanels>
      </Tabs>,
    )

    const tabsContainer = container.firstChild as HTMLDivElement
    expect(tabsContainer.style.backgroundColor).toBe('red')
    expect(tabsContainer.style.color).toBe('white')
  })

  it('should apply the specified colorScheme', () => {
    const { container } = render(
      <Tabs colorScheme="primary">
        <TabList>
          <Tab label="Tab 1" />
        </TabList>
        <TabPanels>
          <TabPanel>Panel 1 Content</TabPanel>
        </TabPanels>
      </Tabs>,
    )

    const tabsContainer = container.firstChild as HTMLDivElement
    const style = getComputedStyle(tabsContainer)

    expect(style.getPropertyValue('--tabs-scheme')).toBe('var(--plume-color-primary-text)')
    expect(style.getPropertyValue('--tabs-solid')).toBe('var(--plume-color-primary-solid)')
    expect(style.getPropertyValue('--tabs-text-color')).toBe(
      'var(--plume-color-primary-solid-contrast)',
    )
  })

  it('should not apply styles in unstyled mode', () => {
    const { container } = render(
      <Tabs variant="unstyled">
        <TabList>
          <Tab label="Tab 1" />
        </TabList>
        <TabPanels>
          <TabPanel>Panel 1 Content</TabPanel>
        </TabPanels>
      </Tabs>,
    )

    const tabsContainer = container.firstChild as HTMLDivElement

    expect(tabsContainer.className).toBe('')
  })

  describe('accessibility', () => {
    const renderTabs = (props: TabsProps = {}): void => {
      render(
        <Tabs {...props}>
          <TabList aria-label="Settings">
            <Tab>One</Tab>
            <Tab disabled>Two</Tab>
            <Tab>Three</Tab>
            <Tab>Four</Tab>
          </TabList>
          <TabPanels>
            <TabPanel>Panel One</TabPanel>
            <TabPanel>Panel Two</TabPanel>
            <TabPanel>Panel Three</TabPanel>
            <TabPanel>Panel Four</TabPanel>
          </TabPanels>
        </Tabs>,
      )
    }

    const tab = (name: string): HTMLElement => screen.getByRole<HTMLElement>('tab', { name })

    it('names the tab list with the given label', () => {
      renderTabs()
      expect(screen.getByRole('tablist', { name: 'Settings' })).toHaveAttribute(
        'aria-orientation',
        'horizontal',
      )
    })

    it('links the active tab and its panel', () => {
      renderTabs()
      const panel = screen.getByRole('tabpanel', { name: 'One' })
      expect(tab('One')).toHaveAttribute('aria-controls', panel.id)
      expect(tab('One')).toHaveAttribute('aria-selected', 'true')
      expect(tab('Three')).toHaveAttribute('aria-selected', 'false')
      expect(tab('Three')).not.toHaveAttribute('aria-controls')
    })

    it('builds the ids from the Tabs id', () => {
      renderTabs({ id: 'settings' })
      expect(tab('One')).toHaveAttribute('id', 'settings-tab-0')
      expect(screen.getByRole('tabpanel')).toHaveAttribute('id', 'settings-panel-0')
    })

    it('keeps only the active tab in the tab order', () => {
      renderTabs()
      expect(tab('One')).toHaveAttribute('tabindex', '0')
      expect(tab('Three')).toHaveAttribute('tabindex', '-1')
      expect(screen.getByRole('tabpanel')).toHaveAttribute('tabindex', '0')
    })

    it('moves with the arrow keys, skipping disabled tabs and wrapping around', () => {
      const onChange = vi.fn()
      renderTabs({ onIndexChange: onChange })
      tab('One').focus()

      fireEvent.keyDown(tab('One'), { key: 'ArrowRight' })
      expect(tab('Three')).toHaveFocus()
      expect(tab('Three')).toHaveAttribute('aria-selected', 'true')
      expect(onChange).toHaveBeenLastCalledWith(2)

      fireEvent.keyDown(tab('Three'), { key: 'ArrowLeft' })
      expect(tab('One')).toHaveFocus()

      fireEvent.keyDown(tab('One'), { key: 'ArrowLeft' })
      expect(tab('Four')).toHaveFocus()
      expect(screen.getByRole('tabpanel')).toHaveTextContent('Panel Four')
    })

    it('jumps to the first and last tab with Home and End', () => {
      renderTabs()
      tab('One').focus()

      fireEvent.keyDown(tab('One'), { key: 'End' })
      expect(tab('Four')).toHaveFocus()

      fireEvent.keyDown(tab('Four'), { key: 'Home' })
      expect(tab('One')).toHaveFocus()
    })

    it('uses the up and down arrows when vertical', () => {
      renderTabs({ orientation: 'vertical' })
      tab('One').focus()

      fireEvent.keyDown(tab('One'), { key: 'ArrowRight' })
      expect(tab('One')).toHaveFocus()

      fireEvent.keyDown(tab('One'), { key: 'ArrowDown' })
      expect(tab('Three')).toHaveFocus()
    })
  })

  describe('position of tabs and panels', () => {
    function Labelled({ children }: Readonly<{ children: React.ReactNode }>): React.ReactNode {
      return <span title="wrapper">{children}</span>
    }

    it('keeps working when a tab and a panel are wrapped by another component', () => {
      render(
        <Tabs>
          <TabList aria-label="Wrapped">
            <Labelled>
              <Tab>One</Tab>
            </Labelled>
            <Labelled>
              <Tab>Two</Tab>
            </Labelled>
          </TabList>
          <TabPanels>
            <Labelled>
              <TabPanel>First</TabPanel>
            </Labelled>
            <Labelled>
              <TabPanel>Second</TabPanel>
            </Labelled>
          </TabPanels>
        </Tabs>,
      )
      expect(screen.getByRole('tab', { name: 'One' })).toHaveAttribute('aria-selected', 'true')
      expect(screen.getByRole('tabpanel')).toHaveTextContent('First')

      fireEvent.click(screen.getByRole('tab', { name: 'Two' }))
      expect(screen.getByRole('tab', { name: 'Two' })).toHaveAttribute('aria-selected', 'true')
      expect(screen.getByRole('tab', { name: 'One' })).toHaveAttribute('aria-selected', 'false')
      expect(screen.getByRole('tabpanel')).toHaveTextContent('Second')
      expect(screen.getByRole('tabpanel')).toHaveAttribute(
        'aria-labelledby',
        screen.getByRole('tab', { name: 'Two' }).id,
      )
    })

    it('takes the position a tab and a panel are given', () => {
      render(
        <Tabs index={1}>
          <TabList aria-label="Explicit">
            <div>
              <Tab index={0}>One</Tab>
              <Tab index={1}>Two</Tab>
            </div>
          </TabList>
          <TabPanels>
            <TabPanel index={0}>First</TabPanel>
            <TabPanel index={1}>Second</TabPanel>
          </TabPanels>
        </Tabs>,
      )
      expect(screen.getByRole('tab', { name: 'Two' })).toHaveAttribute('aria-selected', 'true')
      expect(screen.getByRole('tab', { name: 'One' })).toHaveAttribute('aria-selected', 'false')
      expect(screen.getByRole('tabpanel')).toHaveAttribute(
        'aria-labelledby',
        screen.getByRole('tab', { name: 'Two' }).id,
      )
    })

    it('ignores the texts between the tabs when it counts them', () => {
      render(
        <Tabs>
          <TabList aria-label="With text">
            <Tab>One</Tab>
            {false}
            <Tab>Two</Tab>
          </TabList>
          <TabPanels>
            <TabPanel>First</TabPanel>
            <TabPanel>Second</TabPanel>
          </TabPanels>
        </Tabs>,
      )
      fireEvent.click(screen.getByRole('tab', { name: 'Two' }))
      expect(screen.getByRole('tabpanel')).toHaveTextContent('Second')
    })
  })

  it('Unknown action does not modify state', () => {
    const initialState = {
      index: 0,
      alignment: 'left',
      isLazy: false,
      isStyled: true,
      size: 'md',
      variant: 'underline',
    } as never
    const action = { type: 'UNKNOWN_ACTION', payload: {} } as never
    const newState = tabsReducer(initialState, action)
    expect(newState).toEqual(initialState)
  })
})

describe('Tabs parts', () => {
  it('carries the plume attributes and the state of every part', () => {
    const { container } = render(
      <Tabs>
        <TabList style={{ '--probe': 'list' } as React.CSSProperties}>
          <Tab style={{ '--probe': 'tab' } as React.CSSProperties}>One</Tab>
          <Tab>Two</Tab>
        </TabList>
        <TabPanels style={{ '--probe': 'panels' } as React.CSSProperties}>
          <TabPanel style={{ '--probe': 'panel' } as React.CSSProperties}>First</TabPanel>
          <TabPanel>Second</TabPanel>
        </TabPanels>
      </Tabs>,
    )
    expect(container.querySelector('[data-plume-tabs]')).toHaveAttribute(
      'data-orientation',
      'horizontal',
    )
    expect(container.querySelector('[data-plume-tabs-list]')).toHaveStyle('--probe: list')
    const tabs = container.querySelectorAll('[data-plume-tabs-tab]')
    expect(tabs).toHaveLength(2)
    expect(tabs[0]).toHaveAttribute('data-active')
    expect(tabs[0]).toHaveStyle('--probe: tab')
    expect(tabs[1]).not.toHaveAttribute('data-active')
    expect(container.querySelector('[data-plume-tabs-panels]')).toHaveStyle('--probe: panels')
    expect(container.querySelector('[data-plume-tabs-panel]')).toHaveStyle('--probe: panel')
  })

  it('moves the active mark with the selection and reports the orientation', () => {
    const { container } = render(
      <Tabs orientation="vertical">
        <TabList>
          <Tab>One</Tab>
          <Tab>Two</Tab>
        </TabList>
      </Tabs>,
    )
    fireEvent.click(screen.getByText('Two'))
    const tabs = container.querySelectorAll('[data-plume-tabs-tab]')
    expect(tabs[1]).toHaveAttribute('data-active')
    expect(tabs[0]).not.toHaveAttribute('data-active')
    expect(container.querySelector('[data-plume-tabs-list]')).toHaveAttribute(
      'data-orientation',
      'vertical',
    )
  })
})
