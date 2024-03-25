import type { ReactNode } from 'react'
import { createContext, useContext, useEffect, useMemo, useReducer } from 'react'
import type { TabsState } from './tabs-reducer'
import { tabsReducer } from './tabs-reducer'
import styles from './tabs.module.css'

interface TabContextProps extends TabsState {
  alignmentClass: string
  sizeClass: string
  variantClass: string
  setActiveTabIndex: (index: number) => void
}

const TabContext = createContext<TabContextProps | undefined>(undefined)

interface TabProviderProps {
  children: ReactNode
  config: TabsState
}

export function TabsProvider({ config, children }: Readonly<TabProviderProps>): ReactNode {
  const [state, dispatch] = useReducer(tabsReducer, config)

  const alignmentClass = state.alignment !== 'left' || state.isStyled ? styles[state.alignment] : ''
  const sizeClass = state.isStyled ? styles[state.size] : ''
  const variantClass = state.isStyled ? styles[state.variant] : ''

  useEffect(() => {
    dispatch({
      type: 'SET_CONFIG',
      payload: config,
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps -- Just adding needed dependencies
  }, [
    config.alignment,
    config.colorScheme,
    config.index,
    config.isLazy,
    config.size,
    config.variant,
  ])

  const setActiveTabIndex = (index: number): void => {
    dispatch({ type: 'SET_ACTIVE_TAB_INDEX', payload: index })
  }

  return (
    <TabContext.Provider
      value={useMemo(
        () => ({
          ...state,
          alignmentClass,
          sizeClass,
          variantClass,
          setActiveTabIndex,
        }),
        [alignmentClass, sizeClass, state, variantClass],
      )}
    >
      {children}
    </TabContext.Provider>
  )
}

export const useTabs = (): TabContextProps => {
  const context = useContext(TabContext)
  if (!context) {
    throw new Error('useTabs must be used within a TabsProvider')
  }
  return context
}
