import { createContext, useContext } from 'react'

// Pages read this to know whether to render skeleton content
export const PageLoadContext = createContext({ skeleton: false })
export const usePageLoad = () => useContext(PageLoadContext)

// Pages use this to inject tabs/actions into the header
export const HeaderSlotContext = createContext({ setTabs: () => {}, setActions: () => {} })
export const useHeaderSlot = () => useContext(HeaderSlotContext)

// Detail tabs — rows clicked in tables open a detail panel as a closeable mini-tab
export const DetailTabContext = createContext({
  tabs: [],
  activeTabId: null,
  openTab: () => {},
  closeTab: () => {},
  setActiveTab: () => {},
})
export const useDetailTabs = () => useContext(DetailTabContext)
