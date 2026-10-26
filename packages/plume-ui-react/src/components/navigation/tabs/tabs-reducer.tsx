import type { Size } from '../../../theme'
import type { TabsAlignment, TabsOrientation, TabsOwnProps, TabsVariant } from './tabs'

export interface TabsState extends TabsOwnProps {
  index: number
  alignment: TabsAlignment
  baseId: string
  lazy: boolean
  isStyled: boolean
  orientation: TabsOrientation
  size: Size
  variant: TabsVariant
}

export type TabsAction =
  | { type: 'SET_ACTIVE_TAB_INDEX'; payload: number }
  | { type: 'SET_CONFIG'; payload: TabsState }

export const tabsReducer = (state: TabsState, { type, payload }: TabsAction): TabsState => {
  switch (type) {
    case 'SET_ACTIVE_TAB_INDEX':
      return { ...state, index: payload }
    case 'SET_CONFIG':
      return { ...state, ...payload }
    default:
      return state
  }
}
