/**
 * Central route paths. Use these for NavLink hrefs and route definitions.
 */
export const ROUTES = {
  HOME: '/',

  BRAND_PROTECTION: {
    key: 'brand-protection',
    base: '/brand-protection',
    OVERVIEW: '/brand-protection/overview',
    DOPPEL_REVIEW: '/brand-protection/doppel-review',
    NEEDS_CONFIRMATION: '/brand-protection/needs-confirmation',
    ACTIONED: '/brand-protection/actioned',
    RESOLVED: '/brand-protection/resolved',
    MONITORING: '/brand-protection/monitoring',
    ARCHIVED: '/brand-protection/archived',
  },

  HUMAN_RISK: {
    key: 'human-risk',
    base: '/human-risk',
    OVERVIEW: '/human-risk/overview',
    TAB2: '/human-risk/tab2',
    TAB3: '/human-risk/tab3',
    TAB4: '/human-risk/tab4',
  },

  EMAIL_PROTECTION: {
    key: 'email-protection',
    base: '/email-protection',
    OVERVIEW: '/email-protection/overview',
    NEEDS_REVIEW: '/email-protection/needs-review',
    ARCHIVE: '/email-protection/archive',
  },
}

export const PRODUCT_SECTIONS = [
  {
    id: ROUTES.BRAND_PROTECTION.key,
    label: 'Digital Risk Protection',
    base: ROUTES.BRAND_PROTECTION.base,
    overviewPath: ROUTES.BRAND_PROTECTION.OVERVIEW,
    tabs: [
      { path: ROUTES.BRAND_PROTECTION.NEEDS_CONFIRMATION, label: 'Needs Review' },
      { path: ROUTES.BRAND_PROTECTION.DOPPEL_REVIEW, label: 'Doppel Review' },
      { path: ROUTES.BRAND_PROTECTION.MONITORING, label: 'Monitoring' },
      { path: ROUTES.BRAND_PROTECTION.ARCHIVED, label: 'Archived' },
    ],
  },
  {
    id: ROUTES.HUMAN_RISK.key,
    label: 'Human Risk Management',
    base: ROUTES.HUMAN_RISK.base,
    overviewPath: ROUTES.HUMAN_RISK.OVERVIEW,
    tabs: [
      { path: ROUTES.HUMAN_RISK.TAB2, label: 'Simulation' },
      { path: ROUTES.HUMAN_RISK.TAB3, label: 'Training' },
    ],
  },
  {
    id: ROUTES.EMAIL_PROTECTION.key,
    label: 'Email Protection',
    base: ROUTES.EMAIL_PROTECTION.base,
    overviewPath: ROUTES.EMAIL_PROTECTION.OVERVIEW,
    tabs: [
      { path: ROUTES.EMAIL_PROTECTION.NEEDS_REVIEW, label: 'Needs Review', badge: 25 },
      { path: ROUTES.EMAIL_PROTECTION.ARCHIVE, label: 'Archive' },
    ],
  },
]

/**
 * Returns the page name (matches side nav label): Home, Overview, Tab 2, etc.
 */
export function getPageTitle(pathname) {
  if (pathname === '/') return 'Home'
  if (pathname === '/settings') return 'Settings'
  if (pathname === '/logout') return 'Logout'
  const section = PRODUCT_SECTIONS.find((s) => pathname === s.base || pathname.startsWith(s.base + '/'))
  if (section) {
    const tab = section.tabs.find((t) => pathname === t.path)
    return tab ? tab.label : section.label
  }
  return 'Dashboard'
}

/**
 * Returns the single header title: "Product / Page" (e.g. "Human Risk Management / Overview") for product routes, or just the page name for others.
 */
export function getHeaderTitle(pathname) {
  if (pathname === '/') return 'Home'
  if (pathname === '/settings') return 'Settings'
  if (pathname === '/logout') return 'Logout'
  const section = PRODUCT_SECTIONS.find((s) => pathname === s.base || pathname.startsWith(s.base + '/'))
  if (section) {
    const tab = section.tabs.find((t) => pathname === t.path)
    return tab ? `${section.label} / ${tab.label}` : section.label
  }
  return 'Dashboard'
}

/**
 * Returns structured header parts: { productName, pageName } for product routes, or { pageName } for others.
 */
export function getHeaderParts(pathname) {
  if (pathname === '/') return { pageName: 'Home' }
  if (pathname === '/settings') return { pageName: 'Settings' }
  if (pathname === '/logout') return { pageName: 'Logout' }
  const section = PRODUCT_SECTIONS.find((s) => pathname === s.base || pathname.startsWith(s.base + '/'))
  if (section) {
    // On overview: show section name as the main title, no yellow label above
    if (pathname === section.overviewPath || pathname === section.base) return { pageName: section.label }
    const tab = section.tabs.find((t) => pathname === t.path)
    return { productName: section.label, pageName: tab ? tab.label : section.label }
  }
  return { pageName: 'Dashboard' }
}
