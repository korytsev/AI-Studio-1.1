import { useEffect, useState, useRef } from 'react'
import { useLocation } from 'react-router-dom'
import { Skeleton } from '@/components/ui/skeleton'
import { usePageLoad, useHeaderSlot, useDetailTabs } from '@/components/layout/AppLayout'
import { ROUTES } from '@/lib/routes'

// Tab definitions with badge counts matching the screenshot
const TABS = [
  { path: ROUTES.BRAND_PROTECTION.DOPPEL_REVIEW, label: 'Doppel Review', count: 3 },
  { path: ROUTES.BRAND_PROTECTION.NEEDS_CONFIRMATION, label: 'Needs Review', count: 106 },
  { path: ROUTES.BRAND_PROTECTION.ACTIONED, label: 'Actioned', count: 13 },
  { path: ROUTES.BRAND_PROTECTION.RESOLVED, label: 'Resolved', count: 0 },
  { path: ROUTES.BRAND_PROTECTION.MONITORING, label: 'Monitoring', count: 126 },
  { path: ROUTES.BRAND_PROTECTION.ARCHIVED, label: 'Archived', count: 549 },
]

// Sample detections per tab
const DETECTIONS = {
  '/brand-protection/doppel-review': [
    { id: 'D-0041', type: 'Impersonation', entity: 'acme-corp-login.net', channel: 'Web', severity: 'HIGH', discovered: 'Mar 9, 2026', status: 'DOPPEL REVIEW' },
    { id: 'D-0040', type: 'Fake Domain', entity: 'acme-corp-support.com', channel: 'Web', severity: 'HIGH', discovered: 'Mar 8, 2026', status: 'DOPPEL REVIEW' },
    { id: 'D-0039', type: 'Mobile App', entity: 'Acme Corp Mobile (unofficial)', channel: 'Mobile', severity: 'MEDIUM', discovered: 'Mar 7, 2026', status: 'DOPPEL REVIEW' },
  ],
  '/brand-protection/needs-confirmation': [
    { id: 'D-0038', type: 'Social Media', entity: '@acme_corp_official2', channel: 'Social', severity: 'MEDIUM', discovered: 'Mar 6, 2026', status: 'NEEDS CONFIRMATION' },
    { id: 'D-0037', type: 'Dark Web', entity: 'acme credentials dump', channel: 'Dark Web', severity: 'CRITICAL', discovered: 'Mar 5, 2026', status: 'NEEDS CONFIRMATION' },
    { id: 'D-0036', type: 'Impersonation', entity: 'acme-corp-help.io', channel: 'Web', severity: 'HIGH', discovered: 'Mar 4, 2026', status: 'NEEDS CONFIRMATION' },
  ],
  '/brand-protection/actioned': [
    { id: 'D-0035', type: 'Fake Domain', entity: 'acmecorp-phishing.net', channel: 'Web', severity: 'HIGH', discovered: 'Mar 1, 2026', status: 'ACTIONED' },
    { id: 'D-0034', type: 'Social Media', entity: '@AcmeCorp_fake', channel: 'Social', severity: 'LOW', discovered: 'Feb 28, 2026', status: 'ACTIONED' },
  ],
  '/brand-protection/resolved': [],
  '/brand-protection/monitoring': [
    { id: 'D-0033', type: 'Impersonation', entity: 'acme-helpdesk.co', channel: 'Web', severity: 'MEDIUM', discovered: 'Feb 20, 2026', status: 'MONITORING' },
    { id: 'D-0032', type: 'Fake Domain', entity: 'acmecorp-deals.com', channel: 'Web', severity: 'LOW', discovered: 'Feb 15, 2026', status: 'MONITORING' },
    { id: 'D-0031', type: 'Dark Web', entity: 'acme employee data', channel: 'Dark Web', severity: 'HIGH', discovered: 'Feb 10, 2026', status: 'MONITORING' },
  ],
  '/brand-protection/archived': [
    { id: 'D-0001', type: 'Fake Domain', entity: 'acme-corp-old.net', channel: 'Web', severity: 'LOW', discovered: 'Jan 1, 2026', status: 'ARCHIVED' },
    { id: 'D-0002', type: 'Social Media', entity: '@acme_old_fake', channel: 'Social', severity: 'LOW', discovered: 'Jan 2, 2026', status: 'ARCHIVED' },
  ],
}

function FilterDropdown({ label, options, value, onChange }) {
  const [open, setOpen] = useState(false)
  const ref = useRef(null)
  useEffect(() => {
    function h(e) { if (ref.current && !ref.current.contains(e.target)) setOpen(false) }
    document.addEventListener('mousedown', h)
    return () => document.removeEventListener('mousedown', h)
  }, [])
  const active = value !== options[0]
  return (
    <div ref={ref} className="relative">
      <button type="button" onClick={() => setOpen((o) => !o)}
        className={`flex h-8 items-center gap-1.5 rounded border px-3 text-sm transition-colors cursor-pointer ${
          active ? 'border-[#1C84FC] bg-[#1C84FC]/10 text-[#1C84FC]' : 'border-border bg-muted/20 text-muted-foreground hover:bg-[#e2f98e]/10 hover:text-foreground'
        }`}>
        {active ? value : label}
        <svg className="h-3 w-3 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path d="M6 9l6 6 6-6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>
      {open && (
        <div className="absolute left-0 top-full z-50 mt-1 min-w-[140px] rounded-md border border-border bg-card shadow-lg">
          {options.map((opt) => (
            <button key={opt} type="button" onClick={() => { onChange(opt); setOpen(false) }}
              className={`flex w-full items-center px-3 py-2 text-sm transition-colors cursor-pointer hover:bg-[#e2f98e]/10 ${value === opt ? 'text-[#1C84FC] font-medium' : 'text-foreground'}`}>
              {opt}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

const SEVERITY_COLOR = {
  CRITICAL: 'bg-red-600',
  HIGH: 'bg-orange-500',
  MEDIUM: 'bg-yellow-500',
  LOW: 'bg-[#514d51]',
}

const STATUS_COLOR = {
  'DOPPEL REVIEW': 'bg-[#1C84FC]',
  'NEEDS CONFIRMATION': 'bg-yellow-500',
  'ACTIONED': 'bg-orange-500',
  'MONITORING': 'bg-blue-400',
  'ARCHIVED': 'bg-[#514d51]',
}

function Badge({ label, colorClass }) {
  return (
    <span className={`inline-flex items-center rounded px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-white ${colorClass}`}>
      {label}
    </span>
  )
}

function SkeletonRow() {
  return (
    <tr className="border-b border-border">
      <td className="py-3 pr-4"><Skeleton className="h-4 w-4 rounded" /></td>
      <td className="py-3 pr-4"><Skeleton className="h-[14px] w-16 rounded" /></td>
      <td className="py-3 pr-4"><Skeleton className="h-[22px] w-28 rounded" /></td>
      <td className="py-3 pr-4"><Skeleton className="h-[14px] w-48 rounded" /></td>
      <td className="py-3 pr-4"><Skeleton className="h-[14px] w-16 rounded" /></td>
      <td className="py-3 pr-4"><Skeleton className="h-[22px] w-16 rounded" /></td>
      <td className="py-3"><Skeleton className="h-[14px] w-24 rounded" /></td>
    </tr>
  )
}

function TableSkeleton() {
  return (
    <div className="p-6">
      <table className="w-full text-sm">
        <colgroup>
          <col className="w-8" />
          <col className="w-24" />
          <col className="w-36" />
          <col />
          <col className="w-24" />
          <col className="w-24" />
          <col className="w-32" />
        </colgroup>
        <thead>
          <tr className="border-b border-border">
            {['', 'ID', 'TYPE', 'ENTITY', 'CHANNEL', 'SEVERITY', 'DISCOVERED'].map((h) => (
              <th key={h} className="py-2 pr-4 text-left text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {Array.from({ length: 5 }).map((_, i) => <SkeletonRow key={i} />)}
        </tbody>
      </table>
    </div>
  )
}

export function DRPTabPage() {
  const location = useLocation()
  const { skeleton } = usePageLoad()
  const { setTabs, setActions } = useHeaderSlot()
  const { openTab } = useDetailTabs()
  const [search, setSearch] = useState('')
  const [typeFilter, setTypeFilter] = useState('All Types')
  const [channelFilter, setChannelFilter] = useState('All Channels')
  const [severityFilter, setSeverityFilter] = useState('All Severities')

  const allRows = DETECTIONS[location.pathname] ?? []

  // Derive unique options
  const types = ['All Types', ...new Set(Object.values(DETECTIONS).flat().map((r) => r.type))]
  const channels = ['All Channels', ...new Set(Object.values(DETECTIONS).flat().map((r) => r.channel))]
  const severities = ['All Severities', 'CRITICAL', 'HIGH', 'MEDIUM', 'LOW']

  const rows = allRows.filter((r) => {
    const q = search.toLowerCase()
    if (q && !r.id.toLowerCase().includes(q) && !r.entity.toLowerCase().includes(q) && !r.type.toLowerCase().includes(q)) return false
    if (typeFilter !== 'All Types' && r.type !== typeFilter) return false
    if (channelFilter !== 'All Channels' && r.channel !== channelFilter) return false
    if (severityFilter !== 'All Severities' && r.severity !== severityFilter) return false
    return true
  })

  const hasFilters = search || typeFilter !== 'All Types' || channelFilter !== 'All Channels' || severityFilter !== 'All Severities'

  useEffect(() => {
    return () => { setTabs(null); setActions(null) }
  }, [setTabs, setActions])

  if (skeleton) return <TableSkeleton />

  return (
    <div className="animate-[page-enter_0.18s_ease-out_both]">
      {/* Filter bar */}
      <div className="flex items-center gap-2 border-b border-border px-6 py-2.5 overflow-x-auto">
        <div className="relative flex shrink-0 items-center">
          <svg className="pointer-events-none absolute left-2.5 h-3.5 w-3.5 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <circle cx="11" cy="11" r="8" strokeWidth="2" /><path d="m21 21-4.35-4.35" strokeWidth="2" strokeLinecap="round" />
          </svg>
          <input type="text" placeholder="Search detections…" value={search} onChange={(e) => setSearch(e.target.value)}
            className="h-8 w-44 rounded-md border border-border bg-muted/20 pl-8 pr-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-[#1C84FC]/50" />
          {search && <button type="button" onClick={() => setSearch('')} className="absolute right-2.5 opacity-50 hover:opacity-100 cursor-pointer text-foreground text-xs">✕</button>}
        </div>
        <div className="mx-1 h-5 w-px shrink-0 bg-border/40" />
        <FilterDropdown label="All Types"      options={types}      value={typeFilter}     onChange={setTypeFilter} />
        <FilterDropdown label="All Channels"   options={channels}   value={channelFilter}  onChange={setChannelFilter} />
        <FilterDropdown label="All Severities" options={severities} value={severityFilter} onChange={setSeverityFilter} />
        {hasFilters && (
          <button type="button" onClick={() => { setSearch(''); setTypeFilter('All Types'); setChannelFilter('All Channels'); setSeverityFilter('All Severities') }}
            className="ml-1 shrink-0 cursor-pointer whitespace-nowrap text-sm text-muted-foreground underline-offset-2 hover:text-foreground hover:underline">
            Clear all
          </button>
        )}
      </div>
      <div className="p-6">
      {rows.length === 0 ? (
        <div className="flex h-48 items-center justify-center text-muted-foreground text-sm">
          {hasFilters ? 'No detections match your filters.' : 'No detections in this category.'}
        </div>
      ) : (
        <table className="w-full text-sm">
          <colgroup>
            <col className="w-8" />
            <col className="w-24" />
            <col className="w-36" />
            <col />
            <col className="w-24" />
            <col className="w-24" />
            <col className="w-32" />
          </colgroup>
          <thead>
            <tr className="border-b border-border">
              {['', 'ID', 'TYPE', 'ENTITY / URL', 'CHANNEL', 'SEVERITY', 'DISCOVERED'].map((h) => (
                <th
                  key={h}
                  className="py-2 pr-4 text-left text-xs font-semibold uppercase tracking-wide text-card-foreground"
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
                onClick={() => openTab({ id: row.id, label: row.id, type: 'detection', data: { title: row.entity, ...row } })}
                className="border-b border-border transition-colors cursor-pointer hover:bg-[#e2f98e]/10"
              >
                <td className="py-3 pr-4" onClick={(e) => e.stopPropagation()}>
                  <input type="checkbox" className="accent-[#1C84FC] cursor-pointer" />
                </td>
                <td className="py-3 pr-4 text-muted-foreground font-mono text-xs">{row.id}</td>
                <td className="py-3 pr-4 text-foreground">{row.type}</td>
                <td className="py-3 pr-4 text-foreground font-medium">{row.entity}</td>
                <td className="py-3 pr-4 text-muted-foreground">{row.channel}</td>
                <td className="py-3 pr-4">
                  <Badge label={row.severity} colorClass={SEVERITY_COLOR[row.severity] ?? 'bg-muted'} />
                </td>
                <td className="py-3 text-muted-foreground text-sm">{row.discovered}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      </div>
    </div>
  )
}
