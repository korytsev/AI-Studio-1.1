import { useEffect, useState, useRef } from 'react'
import { useLocation, NavLink } from 'react-router-dom'
import { Skeleton } from '@/components/ui/skeleton'
import { usePageLoad, useHeaderSlot, useDetailTabs } from '@/components/layout/AppLayout'
import { Calendar, Clock, Tag, AlertCircle, Radio, Link2, ChevronDown, Search, SlidersHorizontal, Building2 } from 'lucide-react'


const NEEDS_REVIEW_COUNT = 25

const ALERTS = {
  '/email-protection/needs-review': [
    { id: 'DA-1712', alertCreated: '04/17/25 13:33', lastActivity: '03/04/26 09:44', product: 'Social Media', url: 't.me/western_union', preview: null, source: 'Manual Upload: samuel.mwangi@doppel.com (ui_upload)', state: 'ACTIVE', severity: 'HIGH', brand: 'Western Union', tags: ['NC AGED'] },
    { id: 'DA-42641', alertCreated: '04/21/25 03:25', lastActivity: '02/18/26 14:01', product: 'Social Media', url: 't.me/michael_jordan8', preview: null, source: 'Manual Upload: abhishek.kumar@doppel.com (ui_upload)', state: 'ACTIVE', severity: 'HIGH', brand: 'Michael Jordan', tags: [] },
    { id: 'DA-40112', alertCreated: '04/19/25 21:48', lastActivity: '05/07/25 12:23', product: 'Apps', url: 'nintendo-today.en.uptodown.com/android', preview: null, source: 'Web Search API (google_search)', state: 'ACTIVE', severity: 'HIGH', brand: 'Nintendo', tags: [] },
    { id: 'DA-1860', alertCreated: '04/17/25 14:03', lastActivity: '04/21/25 12:52', product: 'Social Media', url: 'quora.com/profile/Nintendo-Switch-12', preview: null, source: 'Manual Upload: samuel.mwangi@doppel.com (ui_upload)', state: 'ACTIVE', severity: 'HIGH', brand: 'Nintendo', tags: [] },
    { id: 'DA-42643', alertCreated: '04/21/25 03:26', lastActivity: '04/21/25 04:54', product: 'Social Media', url: 'in.pinterest.com/AIR_Jordan_23', preview: null, source: 'Manual Upload: abhishek.kumar@doppel.com (ui_upload)', state: 'ACTIVE', severity: 'HIGH', brand: 'Michael Jordan', tags: [] },
    { id: 'DA-54287', alertCreated: '11/11/25 20:36', lastActivity: '11/11/25 20:36', product: 'Social Media', url: 't.me/Youtubek', preview: null, source: 'Manual Upload: Vaibhav (ui_upload)', state: 'ACTIVE', severity: 'MEDIUM', brand: 'Google', tags: [] },
    { id: 'DA-1024', alertCreated: '04/17/25 09:46', lastActivity: '04/17/25 09:49', product: 'Apps', url: 'malavida.com/en/soft/stranger-things-1984/android', preview: null, source: 'Web Search API (google_search)', state: 'ACTIVE', severity: 'HIGH', brand: 'Stranger Things', tags: [] },
    { id: 'DA-1052', alertCreated: '04/17/25 09:51', lastActivity: '04/17/25 14:07', product: 'Social Media', url: 'tiktok.com/@68448860600', preview: null, source: 'Social Media API (vetric)', state: 'ACTIVE', severity: 'HIGH', brand: 'Stranger Things', tags: [] },
    { id: 'DA-2301', alertCreated: '05/02/25 08:14', lastActivity: '05/03/25 10:22', product: 'Email', url: 'phish-acme.net/login', preview: null, source: 'Email Gateway API', state: 'ACTIVE', severity: 'CRITICAL', brand: 'Acme Corp', tags: ['URGENT'] },
    { id: 'DA-2302', alertCreated: '05/02/25 09:05', lastActivity: '05/04/25 11:00', product: 'Web', url: 'acme-corp-secure.com', preview: null, source: 'Web Search API (google_search)', state: 'ACTIVE', severity: 'HIGH', brand: 'Acme Corp', tags: [] },
    { id: 'DA-2303', alertCreated: '05/03/25 14:22', lastActivity: '05/05/25 08:45', product: 'Social Media', url: 'instagram.com/acme_official2', preview: null, source: 'Social Media API (vetric)', state: 'ACTIVE', severity: 'MEDIUM', brand: 'Acme Corp', tags: [] },
    { id: 'DA-2304', alertCreated: '05/04/25 07:18', lastActivity: '05/06/25 09:30', product: 'Apps', url: 'apkpure.com/acme-app-fake', preview: null, source: 'Web Search API (google_search)', state: 'ACTIVE', severity: 'HIGH', brand: 'Acme Corp', tags: [] },
    { id: 'DA-2305', alertCreated: '05/05/25 11:44', lastActivity: '05/07/25 13:15', product: 'Dark Web', url: 'darkforum.onion/acme-creds', preview: null, source: 'Dark Web Monitor', state: 'ACTIVE', severity: 'CRITICAL', brand: 'Acme Corp', tags: ['NC AGED'] },
    { id: 'DA-2306', alertCreated: '05/06/25 16:02', lastActivity: '05/08/25 10:00', product: 'Social Media', url: 'twitter.com/acmecorp_fake', preview: null, source: 'Social Media API (vetric)', state: 'ACTIVE', severity: 'LOW', brand: 'Acme Corp', tags: [] },
    { id: 'DA-2307', alertCreated: '05/07/25 08:55', lastActivity: '05/09/25 14:20', product: 'Email', url: 'support-acme.io/reset', preview: null, source: 'Email Gateway API', state: 'ACTIVE', severity: 'HIGH', brand: 'Acme Corp', tags: [] },
    { id: 'DA-2308', alertCreated: '05/08/25 12:30', lastActivity: '05/10/25 09:10', product: 'Web', url: 'acme-helpdesk.co/ticket', preview: null, source: 'Web Search API (google_search)', state: 'ACTIVE', severity: 'MEDIUM', brand: 'Acme Corp', tags: [] },
    { id: 'DA-2309', alertCreated: '05/09/25 10:05', lastActivity: '05/11/25 11:45', product: 'Social Media', url: 'facebook.com/acme.corp.official2', preview: null, source: 'Social Media API (vetric)', state: 'ACTIVE', severity: 'HIGH', brand: 'Acme Corp', tags: [] },
    { id: 'DA-2310', alertCreated: '05/10/25 15:18', lastActivity: '05/12/25 08:30', product: 'Apps', url: 'play.google.com/store/apps/acme-fake', preview: null, source: 'Web Search API (google_search)', state: 'ACTIVE', severity: 'HIGH', brand: 'Acme Corp', tags: ['URGENT'] },
    { id: 'DA-2311', alertCreated: '05/11/25 09:42', lastActivity: '05/13/25 10:00', product: 'Email', url: 'billing-acme.com/invoice', preview: null, source: 'Email Gateway API', state: 'ACTIVE', severity: 'CRITICAL', brand: 'Acme Corp', tags: [] },
    { id: 'DA-2312', alertCreated: '05/12/25 13:55', lastActivity: '05/14/25 12:20', product: 'Web', url: 'acme-deals.shop', preview: null, source: 'Web Search API (google_search)', state: 'ACTIVE', severity: 'MEDIUM', brand: 'Acme Corp', tags: [] },
    { id: 'DA-2313', alertCreated: '05/13/25 08:10', lastActivity: '05/15/25 09:05', product: 'Social Media', url: 'linkedin.com/company/acme-corp-official2', preview: null, source: 'Social Media API (vetric)', state: 'ACTIVE', severity: 'LOW', brand: 'Acme Corp', tags: [] },
    { id: 'DA-2314', alertCreated: '05/14/25 11:28', lastActivity: '05/16/25 14:00', product: 'Dark Web', url: 'paste.onion/acme-passwords', preview: null, source: 'Dark Web Monitor', state: 'ACTIVE', severity: 'CRITICAL', brand: 'Acme Corp', tags: ['NC AGED'] },
    { id: 'DA-2315', alertCreated: '05/15/25 14:44', lastActivity: '05/17/25 10:30', product: 'Email', url: 'noreply-acme.net/verify', preview: null, source: 'Email Gateway API', state: 'ACTIVE', severity: 'HIGH', brand: 'Acme Corp', tags: [] },
    { id: 'DA-2316', alertCreated: '05/16/25 07:33', lastActivity: '05/18/25 08:55', product: 'Apps', url: 'aptoide.com/app/acme-mobile-fake', preview: null, source: 'Web Search API (google_search)', state: 'ACTIVE', severity: 'HIGH', brand: 'Acme Corp', tags: [] },
    { id: 'DA-2317', alertCreated: '05/17/25 10:20', lastActivity: '05/19/25 11:10', product: 'Web', url: 'myacme-portal.com/login', preview: null, source: 'Web Search API (google_search)', state: 'ACTIVE', severity: 'HIGH', brand: 'Acme Corp', tags: [] },
  ],
  '/email-protection/archive': [
    {
      id: 'DA-0812',
      alertCreated: '01/05/25 10:11',
      lastActivity: '02/01/25 08:22',
      product: 'Social Media',
      url: 'facebook.com/fake-brand-page',
      preview: null,
      source: 'Web Search API (google_search)',
      state: 'RESOLVED',
      severity: 'LOW',
      brand: 'Acme',
      tags: ['ARCHIVED'],
    },
    {
      id: 'DA-0755',
      alertCreated: '12/14/24 17:45',
      lastActivity: '01/10/25 09:30',
      product: 'Apps',
      url: 'apkpure.com/fake-app/com.acme',
      preview: null,
      source: 'Web Search API (google_search)',
      state: 'RESOLVED',
      severity: 'MEDIUM',
      brand: 'Acme',
      tags: [],
    },
  ],
}

const SEVERITY_COLOR = {
  HIGH: 'bg-orange-500',
  MEDIUM: 'bg-yellow-500',
  LOW: 'bg-[#514d51]',
  CRITICAL: 'bg-red-600',
}

const STATE_COLOR = {
  ACTIVE: 'bg-[#1C84FC]',
  RESOLVED: 'bg-[#22c55e]',
  MONITORING: 'bg-blue-400',
}

const FILTERS = [
  { label: 'Created At',     icon: Calendar },
  { label: 'Last Activity',  icon: Clock },
  { label: 'Brand',          icon: Building2 },
  { label: 'Tag',            icon: Tag },
  { label: 'Severity',       icon: AlertCircle },
  { label: 'Source',         icon: Radio },
  { label: 'All Alerts',     icon: Link2 },
]

function FilterPill({ label, icon: Icon, options, value, onChange }) {
  const [open, setOpen] = useState(false)
  const ref = useRef(null)
  useEffect(() => {
    function h(e) { if (ref.current && !ref.current.contains(e.target)) setOpen(false) }
    document.addEventListener('mousedown', h)
    return () => document.removeEventListener('mousedown', h)
  }, [])
  const active = value !== null
  return (
    <div ref={ref} className="relative shrink-0">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className={`flex cursor-pointer items-center gap-1.5 rounded-md border px-2.5 py-1.5 text-sm font-medium transition-colors ${
          active
            ? 'border-[#1C84FC] bg-[#1C84FC]/10 text-[#1C84FC]'
            : 'border-border bg-muted/20 text-muted-foreground hover:bg-[#e2f98e]/10 hover:text-foreground'
        }`}
      >
        <Icon className="h-3.5 w-3.5 shrink-0" />
        {active ? value : label}
        {active
          ? <span onClick={(e) => { e.stopPropagation(); onChange(null) }} className="ml-0.5 opacity-60 hover:opacity-100">✕</span>
          : <ChevronDown className="h-3 w-3 shrink-0 opacity-60" />
        }
      </button>
      {open && (
        <div className="absolute left-0 top-full z-50 mt-1 min-w-[140px] rounded-md border border-border bg-card shadow-lg">
          {options.map((opt) => (
            <button key={opt} type="button"
              onClick={() => { onChange(opt === value ? null : opt); setOpen(false) }}
              className={`flex w-full items-center px-3 py-2 text-sm transition-colors cursor-pointer hover:bg-[#e2f98e]/10 ${value === opt ? 'text-[#1C84FC] font-medium' : 'text-foreground'}`}>
              {opt}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

function FilterBar({ search, onSearch, filters, onFilter, onClear }) {
  // Derive unique options from ALERTS data
  const allRows = Object.values(ALERTS).flat()
  const brands = [...new Set(allRows.map((r) => r.brand))].sort()
  const severities = [...new Set(allRows.map((r) => r.severity))].sort()
  const sources = [...new Set(allRows.map((r) => r.source.split(':')[0].trim()))].sort()
  const tags = [...new Set(allRows.flatMap((r) => r.tags))].filter(Boolean).sort()

  const hasFilters = search || Object.values(filters).some(Boolean)

  return (
    <div className="flex items-center gap-2 border-b border-border px-6 py-2.5 overflow-x-auto">
      <div className="relative flex shrink-0 items-center">
        <Search className="pointer-events-none absolute left-2.5 h-3.5 w-3.5 text-muted-foreground" />
        <input
          type="text"
          placeholder="Search…"
          value={search}
          onChange={(e) => onSearch(e.target.value)}
          className="h-8 w-44 rounded-md border border-border bg-muted/20 pl-8 pr-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-[#1C84FC]/50"
        />
        {search && <button type="button" onClick={() => onSearch('')} className="absolute right-2.5 opacity-50 hover:opacity-100 cursor-pointer text-foreground text-xs">✕</button>}
      </div>

      <div className="mx-1 h-5 w-px shrink-0 bg-border/40" />

      <FilterPill label="Brand"    icon={Building2}    options={brands}     value={filters.brand}    onChange={(v) => onFilter('brand', v)} />
      <FilterPill label="Tag"      icon={Tag}          options={tags}       value={filters.tag}      onChange={(v) => onFilter('tag', v)} />
      <FilterPill label="Severity" icon={AlertCircle}  options={severities} value={filters.severity} onChange={(v) => onFilter('severity', v)} />
      <FilterPill label="Source"   icon={Radio}        options={sources}    value={filters.source}   onChange={(v) => onFilter('source', v)} />

      {hasFilters && (
        <button type="button" onClick={onClear}
          className="ml-1 shrink-0 cursor-pointer whitespace-nowrap text-sm text-muted-foreground underline-offset-2 hover:text-foreground hover:underline">
          Clear all
        </button>
      )}
    </div>
  )
}

function FilterBarSkeleton() {
  return (
    <div className="flex items-center gap-2 border-b border-border px-6 py-2.5">
      <Skeleton className="h-8 w-44 rounded-md" />
      <div className="mx-1 h-5 w-px shrink-0 bg-border/40" />
      {Array.from({ length: 7 }).map((_, i) => (
        <Skeleton key={i} className="h-8 w-24 rounded-md" />
      ))}
    </div>
  )
}

function Badge({ label, colorClass }) {
  return (
    <span className={`inline-flex items-center rounded px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-white ${colorClass}`}>
      {label}
    </span>
  )
}

function PreviewThumb() {
  return (
    <div className="h-10 w-14 shrink-0 rounded bg-muted/40 overflow-hidden flex items-center justify-center">
      <div className="h-full w-full bg-gradient-to-br from-muted/60 to-muted/20" />
    </div>
  )
}

function SkeletonRow() {
  return (
    <tr className="border-b border-border">
      <td className="py-3 pr-3 w-8"><Skeleton className="h-4 w-4 rounded" /></td>
      <td className="py-3 pr-4"><Skeleton className="h-[13px] w-28 rounded" /></td>
      <td className="py-3 pr-4"><Skeleton className="h-[13px] w-28 rounded" /></td>
      <td className="py-3 pr-4"><Skeleton className="h-[13px] w-20 rounded" /></td>
      <td className="py-3 pr-4"><Skeleton className="h-[13px] w-16 rounded" /></td>
      <td className="py-3 pr-4"><Skeleton className="h-[13px] w-36 rounded" /></td>
      <td className="py-3 pr-4"><Skeleton className="h-10 w-14 rounded" /></td>
      <td className="py-3 pr-4"><Skeleton className="h-[13px] w-40 rounded" /></td>
      <td className="py-3 pr-4"><Skeleton className="h-[22px] w-14 rounded" /></td>
      <td className="py-3 pr-4"><Skeleton className="h-[22px] w-14 rounded" /></td>
      <td className="py-3 pr-4"><Skeleton className="h-[13px] w-16 rounded" /></td>
      <td className="py-3"><Skeleton className="h-[18px] w-16 rounded" /></td>
    </tr>
  )
}

function TableSkeleton() {
  return (
    <div>
      <FilterBarSkeleton />
    <div className="p-6">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-border">
            {['', 'Alert Created', 'Last Activity', 'Product', 'ID', 'URL', 'Preview', 'Source', 'State', 'Severity', 'Brand', 'Tags'].map((h) => (
              <th key={h} className="py-2 pr-4 text-left text-xs font-semibold uppercase tracking-wide text-muted-foreground whitespace-nowrap">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {Array.from({ length: 6 }).map((_, i) => <SkeletonRow key={i} />)}
        </tbody>
      </table>
    </div>
    </div>
  )
}

const ARCHIVE_TABS = ['Malicious', 'Benign', 'Graymails', 'Simulations']

export function EmailTabPage() {
  const location = useLocation()
  const { skeleton } = usePageLoad()
  const { setTabs, setActions } = useHeaderSlot()
  const { openTab } = useDetailTabs()
  const isArchive = location.pathname === '/email-protection/archive'
  const [archiveTab, setArchiveTab] = useState('Malicious')
  const [search, setSearch] = useState('')
  const [filters, setFilters] = useState({ brand: null, tag: null, severity: null, source: null })

  const setFilter = (key, val) => setFilters((prev) => ({ ...prev, [key]: val }))
  const clearAll = () => { setSearch(''); setFilters({ brand: null, tag: null, severity: null, source: null }) }

  const allRows = ALERTS[location.pathname] ?? []
  const rows = allRows.filter((r) => {
    const q = search.toLowerCase()
    if (q && !r.id.toLowerCase().includes(q) && !r.url.toLowerCase().includes(q) && !r.brand.toLowerCase().includes(q) && !r.source.toLowerCase().includes(q)) return false
    if (filters.brand && r.brand !== filters.brand) return false
    if (filters.tag && !r.tags.includes(filters.tag)) return false
    if (filters.severity && r.severity !== filters.severity) return false
    if (filters.source && !r.source.startsWith(filters.source)) return false
    return true
  })

  useEffect(() => {
    if (isArchive) {
      setTabs(
        <div className="flex items-center gap-1 rounded-lg bg-[#1a1719] p-1">
          {ARCHIVE_TABS.map((tab) => (
            <button
              key={tab}
              type="button"
              onClick={() => setArchiveTab(tab)}
              className={`rounded-md px-3 py-1.5 text-sm font-medium transition-colors cursor-pointer whitespace-nowrap ${
                archiveTab === tab
                  ? 'bg-[#2e2a2e] text-foreground shadow-sm'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      )
    } else {
      setTabs(null)
    }
    return () => { setTabs(null); setActions(null) }
  }, [setTabs, setActions, isArchive, archiveTab])

  if (skeleton) return <TableSkeleton />

  return (
    <div className="animate-[page-enter_0.18s_ease-out_both]">
      <FilterBar search={search} onSearch={setSearch} filters={filters} onFilter={setFilter} onClear={clearAll} />
      <div className="p-6 overflow-x-auto">
      {rows.length === 0 ? (
        <div className="flex h-48 items-center justify-center text-muted-foreground text-sm">
          {search || Object.values(filters).some(Boolean) ? 'No alerts match your filters.' : 'No alerts in this category.'}
        </div>
      ) : (
        <table className="w-full min-w-[1100px] text-sm">
          <thead>
            <tr className="border-b border-border">
              {['', 'Alert Created', 'Last Activity', 'Product', 'ID', 'URL', 'Preview', 'Source', 'State', 'Severity', 'Brand', 'Tags'].map((h) => (
                <th
                  key={h}
                  className="py-2 pr-4 text-left text-xs font-semibold uppercase tracking-wide text-card-foreground whitespace-nowrap"
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr
                key={row.id}
                onClick={() => openTab({ id: row.id, label: row.id, type: 'email', data: { title: row.url, subject: row.url, ...row } })}
                className="border-b border-border transition-colors cursor-pointer hover:bg-[#e2f98e]/10"
              >
                <td className="py-3 pr-3 w-8" onClick={(e) => e.stopPropagation()}>
                  <input type="checkbox" className="accent-[#1C84FC] cursor-pointer" />
                </td>
                <td className="py-3 pr-4 text-sm text-muted-foreground whitespace-nowrap">{row.alertCreated}</td>
                <td className="py-3 pr-4 text-sm text-muted-foreground whitespace-nowrap">{row.lastActivity}</td>
                <td className="py-3 pr-4 text-sm text-foreground whitespace-nowrap">{row.product}</td>
                <td className="py-3 pr-4 font-mono text-xs text-muted-foreground whitespace-nowrap">{row.id}</td>
                <td className="py-3 pr-4 text-sm text-foreground max-w-[160px]">
                  <span className="line-clamp-2 break-all">{row.url}</span>
                </td>
                <td className="py-3 pr-4">
                  <PreviewThumb />
                </td>
                <td className="py-3 pr-4 text-sm text-muted-foreground max-w-[180px]">
                  <span className="line-clamp-2">{row.source}</span>
                </td>
                <td className="py-3 pr-4 whitespace-nowrap">
                  <Badge label={row.state} colorClass={STATE_COLOR[row.state] ?? 'bg-muted'} />
                </td>
                <td className="py-3 pr-4 whitespace-nowrap">
                  <Badge label={row.severity} colorClass={SEVERITY_COLOR[row.severity] ?? 'bg-muted'} />
                </td>
                <td className="py-3 pr-4 text-sm text-foreground whitespace-nowrap">{row.brand}</td>
                <td className="py-3">
                  <div className="flex flex-wrap gap-1">
                    {row.tags.map((tag) => (
                      <span key={tag} className="rounded bg-muted/50 px-1.5 py-0.5 text-[10px] font-medium text-muted-foreground">
                        {tag}
                      </span>
                    ))}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      </div>
    </div>
  )
}
