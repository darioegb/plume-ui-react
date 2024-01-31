import { render, fireEvent, waitFor } from '@testing-library/react'
import { Tab, TabList, TabPanel, TabPanels, Tabs } from '..'
import { tabsReducer } from '../tabs-reducer'

describe('Tabs Component', () => {
  it('should call onChange with the correct index when a tab is clicked', () => {
    const onChangeMock = jest.fn()
    const { getByText } = render(
      <Tabs onChange={onChangeMock}>
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
    const onChangeMock = jest.fn()
    const { getByText } = render(
      <Tabs onChange={onChangeMock}>
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
    const { getByText, getByLabelText } = render(
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

    expect(getByLabelText('Tab Panel')).toHaveTextContent('Panel 2 Content')
  })

  it('should load to the correct panel when a tab is clicked on lazy mode', async () => {
    const { getByText, getByLabelText } = render(
      <Tabs isLazy>
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
      expect(getByLabelText('Tab Panel')).toHaveTextContent('Panel 2 Content')
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

    expect(getComputedStyle(tabsContainer).getPropertyValue('--tabs-scheme')).toBe(
      'rgb(99, 102, 241)',
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
