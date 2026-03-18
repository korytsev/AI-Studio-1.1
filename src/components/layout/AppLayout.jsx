import { useLocation, Outlet } from 'react-router-dom'
import { useEffect, useState, useCallback, useRef } from 'react'
import { X } from 'lucide-react'
import { getHeaderParts } from '@/lib/routes'
import { Sidebar } from './Sidebar'
import { DetailPanel } from './DetailPanel'
import {
  PageLoadContext,
  HeaderSlotContext,
  DetailTabContext,
} from './layoutContext'

export { usePageLoad, useHeaderSlot, useDetailTabs } from './layoutContext'

const SPINNER_MS = 500
const SKELETON_MS = 800
const DETAIL_SPINNER_MS = 300

const TAB_BORDER = 'var(--border)'

function PageSpinner() {
  return (
    <div className="flex h-full w-full items-center justify-center">
      <svg
        className="h-7 w-7 animate-spin text-muted-foreground/40"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
      >
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2.5" />
        <path
          className="opacity-75"
          fill="currentColor"
          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
        />
      </svg>
    </div>
  )
}

// Mini tab pill — full header height, open bottom on active tab
function DetailTabPill({ tabRef, isActive, onActivate, onClose }) {
  return (
    <button
      ref={tabRef}
      onClick={onActivate}
      className={`flex h-full items-center gap-2.5 px-4 text-sm transition-colors duration-150 ${
        isActive ? 'text-foreground' : 'text-muted-foreground hover:text-foreground'
      }`}
      style={isActive ? {
        borderLeft: `1px solid ${TAB_BORDER}`,
        borderRight: `1px solid ${TAB_BORDER}`,
        borderTop: `1px solid ${TAB_BORDER}`,
        borderBottom: 'none',
        background: 'var(--color-background)',
      } : {
        border: '1px solid transparent',
      }}
    >
      <span className="text-sm">Details</span>
      <span
        role="button"
        tabIndex={0}
        onClick={(e) => { e.stopPropagation(); onClose() }}
        onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.stopPropagation(); onClose() } }}
        className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-muted-foreground/60 transition-colors hover:bg-foreground/10 hover:text-foreground"
      >
        <X className="h-3.5 w-3.5" />
      </span>
    </button>
  )
}

export function AppLayout() {
  const { pathname } = useLocation()
  const { productName, pageName } = getHeaderParts(pathname)

  const [phase, setPhase] = useState('ready')
  const [displayPath, setDisplayPath] = useState(pathname)
  const [headerTabs, setHeaderTabs] = useState(null)
  const [headerActions, setHeaderActions] = useState(null)

  // Detail tabs state
  const [detailTabs, setDetailTabs] = useState([])
  const [activeDetailTabId, setActiveDetailTabId] = useState(null)
  const [detailPhase, setDetailPhase] = useState('ready')
  const [displayedDetailTabId, setDisplayedDetailTabId] = useState(null)

  // Refs for measuring the active tab position to split the border line
  const headerRef = useRef(null)
  const tabStripRef = useRef(null)
  const activeTabRef = useRef(null)
  const [activeTabRect, setActiveTabRect] = useState(null)

  const openTab = useCallback((tab) => {
    setDetailTabs((prev) => {
      const exists = prev.find((t) => t.id === tab.id)
      if (exists) {
        setActiveDetailTabId(tab.id)
        return prev
      }
      setActiveDetailTabId(tab.id)
      return [...prev, tab]
    })
  }, [])

  const closeTab = useCallback((id) => {
    setDetailTabs((prev) => {
      const idx = prev.findIndex((t) => t.id === id)
      const next = prev.filter((t) => t.id !== id)
      setActiveDetailTabId((cur) => {
        if (cur !== id) return cur
        if (next.length === 0) return null
        return next[Math.max(0, idx - 1)].id
      })
      return next
    })
  }, [])

  const setActiveTab = useCallback((id) => setActiveDetailTabId(id), [])

  // Clear detail tabs on route change
  useEffect(() => {
    setDetailTabs([])
    setActiveDetailTabId(null)
    setDisplayedDetailTabId(null)
    setDetailPhase('ready')
    setActiveTabRect(null)
  }, [pathname])

  // Animate between detail tabs
  useEffect(() => {
    if (activeDetailTabId === displayedDetailTabId) return
    setDetailPhase('spinner')
    const t = setTimeout(() => {
      setDisplayedDetailTabId(activeDetailTabId)
      setDetailPhase('ready')
    }, DETAIL_SPINNER_MS)
    return () => clearTimeout(t)
  }, [activeDetailTabId])

  // Measure active tab position relative to header so we can split the border
  useEffect(() => {
    function measure() {
      if (!activeTabRef.current || !headerRef.current) {
        setActiveTabRect(null)
        return
      }
      const tabRect = activeTabRef.current.getBoundingClientRect()
      const headerRect = headerRef.current.getBoundingClientRect()
      setActiveTabRect({
        left: tabRect.left - headerRect.left,
        width: tabRect.width,
      })
    }
    measure()
    window.addEventListener('resize', measure)
    return () => window.removeEventListener('resize', measure)
  }, [activeDetailTabId, detailTabs])

  useEffect(() => {
    if (pathname === displayPath) return
    setHeaderTabs(null)
    setHeaderActions(null)
    setPhase('spinner')
    const t1 = setTimeout(() => { setDisplayPath(pathname); setPhase('skeleton') }, SPINNER_MS)
    const t2 = setTimeout(() => { setPhase('ready') }, SPINNER_MS + SKELETON_MS)
    return () => { clearTimeout(t1); clearTimeout(t2) }
  }, [pathname])

  const activeDetailTab = detailTabs.find((t) => t.id === activeDetailTabId) ?? null
  const displayedDetailTab = detailTabs.find((t) => t.id === displayedDetailTabId) ?? null

  return (
    <DetailTabContext.Provider value={{ tabs: detailTabs, activeTabId: activeDetailTabId, openTab, closeTab, setActiveTab }}>
      <div className="flex h-screen overflow-hidden bg-[var(--color-sidebar)]">
        <Sidebar />
        <div className="flex h-screen flex-1 flex-col">
          <div className="h-3 shrink-0 bg-[var(--color-sidebar)]" aria-hidden />
          <div className="flex min-h-0 flex-1 flex-col overflow-hidden rounded-tl-xl bg-background" style={{ border: `1px solid ${TAB_BORDER}`, borderBottom: 'none', borderRight: 'none' }}>

            {/* Header — darker bg when detail tabs are open */}
            <header
              ref={headerRef}
              className="relative flex h-14 shrink-0 items-center gap-3 px-6 transition-colors duration-200"
              style={{ background: activeDetailTab ? 'var(--color-muted)' : 'var(--color-background)' }}
            >

              {/* Left: section label + page title */}
              <div className="flex shrink-0 flex-col justify-center">
                {productName && displayPath !== '/' && (
                  <span className="text-[11px] font-medium leading-none tracking-wide" style={{ color: '#e2f98e' }}>
                    {productName}
                  </span>
                )}
                <h1 className="text-xl font-semibold leading-tight text-foreground">
                  {displayPath === '/' ? 'Good Morning, Andrei' : pageName}
                </h1>
              </div>

              {/* Detail tabs — full height, open-bottom browser-tab style */}
              {detailTabs.length > 0 && (
                <div ref={tabStripRef} className="flex h-full items-stretch overflow-x-auto">
                  {detailTabs.map((tab) => (
                    <DetailTabPill
                      key={tab.id}
                      tabRef={tab.id === activeDetailTabId ? activeTabRef : null}
                      isActive={tab.id === activeDetailTabId}
                      onActivate={() => setActiveTab(tab.id)}
                      onClose={() => closeTab(tab.id)}
                    />
                  ))}
                </div>
              )}

              {/* Center: page-level tabs — only shown when no detail tab active */}
              {headerTabs && !activeDetailTab && (
                <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
                  <div className="pointer-events-auto">{headerTabs}</div>
                </div>
              )}

              {/* Right: actions */}
              <div className="ml-auto flex shrink-0 items-center gap-2">
                {!activeDetailTab && headerActions}
              </div>

              {/* Bottom border — rendered as absolute line, split around the active tab */}
              {activeDetailTab && activeTabRect ? (
                <>
                  {/* Left segment */}
                  <div
                    className="absolute bottom-0 left-0"
                    style={{ width: activeTabRect.left, height: 1, background: TAB_BORDER }}
                  />
                  {/* Right segment */}
                  <div
                    className="absolute bottom-0 right-0"
                    style={{
                      left: activeTabRect.left + activeTabRect.width,
                      height: 1,
                      background: TAB_BORDER,
                    }}
                  />
                </>
              ) : (
                <div
                  className="absolute bottom-0 left-0 right-0"
                  style={{ height: 1, background: TAB_BORDER }}
                />
              )}
            </header>

            <div className="min-h-0 flex-1 overflow-hidden">
              {activeDetailTab ? (
                detailPhase === 'spinner' ? (
                  <PageSpinner />
                ) : (
                  <DetailPanel key={displayedDetailTabId} tab={displayedDetailTab ?? activeDetailTab} />
                )
              ) : (
                <div key={displayPath} className="page-enter h-full overflow-auto">
                  {phase === 'spinner' ? (
                    <PageSpinner />
                  ) : (
                    <HeaderSlotContext.Provider value={{ setTabs: setHeaderTabs, setActions: setHeaderActions }}>
                      <PageLoadContext.Provider value={{ skeleton: phase === 'skeleton' }}>
                        <Outlet />
                      </PageLoadContext.Provider>
                    </HeaderSlotContext.Provider>
                  )}
                </div>
              )}
            </div>

          </div>
        </div>
      </div>
    </DetailTabContext.Provider>
  )
}
