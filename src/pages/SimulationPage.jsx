import { useState, useEffect, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { usePageLoad, useHeaderSlot, useDetailTabs } from '@/components/layout/AppLayout'

const CAMPAIGNS = [
  {
    id: 1,
    status: 'IN PROGRESS',
    statusColor: 'bg-blue-500',
    channels: 'Voice',
    dates: 'Feb 25, 2026 – TBD',
    createdBy: 'deanna.curtis@example.com',
    employees: '1,234',
    departments: '67',
    training: null,
  },
  {
    id: 2,
    status: 'IN PROGRESS',
    statusColor: 'bg-blue-500',
    channels: 'Voice',
    dates: 'Feb 25, 2026 – TBD',
    createdBy: 'debbie.baker@example.com',
    employees: '45,585',
    departments: '67',
    training: null,
  },
  {
    id: 3,
    status: 'FINISHED',
    statusColor: 'bg-[#22c55e]',
    channels: 'Telegram, Voice',
    dates: 'Feb 25 – Feb 29, 2026',
    createdBy: 'jessica.hanson@example.com',
    employees: '56,968',
    departments: '12',
    training: {
      status: 'PENDING',
      statusColor: 'bg-yellow-500',
    },
  },
  {
    id: 4,
    status: 'FINISHED',
    statusColor: 'bg-[#22c55e]',
    channels: 'Email',
    dates: 'Feb 25 – Feb 29, 2026',
    createdBy: 'dolores.chambers@example.com',
    employees: '345,965',
    departments: '12',
    training: {
      status: 'IN PROGRESS',
      statusColor: 'bg-blue-500',
      createdBy: 'tim.jennings@example.com',
      dates: 'Feb 25, 2026 – TBD',
      employees: '34,575',
      departments: '23',
    },
  },
  {
    id: 5,
    status: 'FINISHED',
    statusColor: 'bg-[#22c55e]',
    channels: 'Email, Telegram',
    dates: 'Feb 25 – Feb 29, 2026',
    createdBy: 'debbie.baker@example.com',
    employees: '56,968',
    departments: '45',
    training: {
      status: 'CANCELLED',
      statusColor: 'bg-[#514d51]',
    },
  },
  {
    id: 6,
    status: 'FINISHED',
    statusColor: 'bg-[#22c55e]',
    channels: 'Email, Voice',
    dates: 'Feb 25 – Feb 29, 2026',
    createdBy: 'sara.cruz@example.com',
    employees: '296,544',
    departments: '56',
    training: null,
  },
]

const STATUS_COLOR = {
  'IN PROGRESS': 'bg-blue-500',
  'FINISHED': 'bg-[#22c55e]',
  'PENDING': 'bg-yellow-500',
  'CANCELLED': 'bg-[#514d51]',
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
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className={`flex h-8 items-center gap-1.5 rounded border px-3 text-sm transition-colors cursor-pointer ${
          active ? 'border-[#1C84FC] bg-[#1C84FC]/10 text-[#1C84FC]' : 'border-border bg-card text-muted-foreground hover:text-foreground'
        }`}
      >
        {active ? value : label}
        <svg className="h-3 w-3 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path d="M6 9l6 6 6-6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>
      {open && (
        <div className="absolute left-0 top-full z-50 mt-1 min-w-[160px] rounded-md border border-border bg-card shadow-lg">
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

function StatusBadge({ status, color }) {
  return (
    <span
      className={`inline-flex items-center rounded px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-white ${color}`}
    >
      {status}
    </span>
  )
}

// Mirrors the exact row structure from the real table so heights don't shift
function SkeletonSimRow({ subRow = false }) {
  return (
    <tr className={`border-b border-border ${subRow ? 'bg-card/30' : ''}`}>
      {/* checkbox td: py-3 */}
      <td className={subRow ? 'py-2' : 'py-3'}>
        {!subRow && <Skeleton className="h-4 w-4 rounded" />}
      </td>
      {/* status badge td: StatusBadge is inline-flex rounded px-2 py-0.5 text-[10px] */}
      <td className={`${subRow ? 'py-2' : 'py-3'} pr-4`}>
        <Skeleton className={`${subRow ? 'h-4 w-32' : 'h-[22px] w-24'} rounded`} />
      </td>
      {/* channels: text-sm */}
      <td className={`${subRow ? 'py-2' : 'py-3'} pr-4`}>
        <Skeleton className="h-[14px] w-24 rounded" />
      </td>
      {/* dates */}
      <td className={`${subRow ? 'py-2' : 'py-3'} pr-4`}>
        <Skeleton className="h-[14px] w-36 rounded" />
      </td>
      {/* createdBy */}
      <td className={`${subRow ? 'py-2' : 'py-3'} pr-4`}>
        <Skeleton className="h-[14px] w-40 rounded" />
      </td>
      {/* employees: text-right */}
      <td className={`${subRow ? 'py-2' : 'py-3'} pr-4 text-right`}>
        <div className="flex justify-end"><Skeleton className="h-[14px] w-12 rounded" /></div>
      </td>
      {/* departments: text-right */}
      <td className={subRow ? 'py-2' : 'py-3'}>
        <div className="flex justify-end"><Skeleton className="h-[14px] w-8 rounded" /></div>
      </td>
    </tr>
  )
}

function SimulationSkeleton() {
  return (
    <div className="flex flex-col gap-0">
      {/* Tab bar — same height/padding as real: py-3 */}
      <div className="flex items-center justify-between border-b border-border px-6 py-3">
        {/* Segmented control: bg-muted p-1 rounded-lg — same height as real buttons */}
        <div className="flex items-center gap-1 rounded-lg bg-[var(--color-muted)] p-1">
          {['Campaigns', 'Templates', 'Advisories'].map((label) => (
            <div key={label} className="rounded-md px-4 py-1.5">
              <Skeleton className="h-[14px] w-16" />
            </div>
          ))}
        </div>
        {/* Button size="sm" h-8 */}
        <Skeleton className="h-8 w-36 rounded-[0.25rem]" />
      </div>

      {/* Filters row — same h-8 controls, py-3 */}
      <div className="flex items-center gap-3 border-b border-border px-6 py-3">
        <Skeleton className="h-8 w-48 rounded border border-border" />
        {['w-36', 'w-28', 'w-24'].map((w, i) => (
          <Skeleton key={i} className={`h-8 ${w} rounded border border-border`} />
        ))}
      </div>

      {/* Table — uses same <table> structure so column widths are identical */}
      <div className="px-6 py-4">
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="border-b border-border">
              {/* checkbox col w-8 */}
              <th className="w-8 pb-2 text-left"><Skeleton className="h-4 w-4 rounded" /></th>
              {/* text-sm header cells pb-2 */}
              <th className="pb-2 text-left"><Skeleton className="h-[14px] w-12" /></th>
              <th className="pb-2 text-left"><Skeleton className="h-[14px] w-16" /></th>
              <th className="pb-2 text-left"><Skeleton className="h-[14px] w-10" /></th>
              <th className="pb-2 text-left"><Skeleton className="h-[14px] w-20" /></th>
              <th className="pb-2 text-right"><div className="flex justify-end"><Skeleton className="h-[14px] w-16" /></div></th>
              <th className="pb-2 text-right"><div className="flex justify-end"><Skeleton className="h-[14px] w-20" /></div></th>
            </tr>
          </thead>
          <tbody>
            {/* 6 campaign rows, 3 with a training sub-row after them */}
            <SkeletonSimRow />
            <SkeletonSimRow />
            <SkeletonSimRow />
            <SkeletonSimRow subRow />
            <SkeletonSimRow />
            <SkeletonSimRow subRow />
            <SkeletonSimRow />
            <SkeletonSimRow subRow />
            <SkeletonSimRow />
          </tbody>
        </table>
      </div>
    </div>
  )
}

export function SimulationPage() {
  const { skeleton } = usePageLoad()
  const { setTabs, setActions } = useHeaderSlot()
  const { openTab } = useDetailTabs()
  const [activeTab, setActiveTab] = useState('Campaigns')
  const [selected, setSelected] = useState(new Set())
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('All Active Campaigns')
  const [channelFilter, setChannelFilter] = useState('All Channels')
  const [typeFilter, setTypeFilter] = useState('All Types')

  useEffect(() => {
    setTabs(
      <div className="flex items-center gap-1 rounded-lg bg-[var(--color-muted)] p-1">
        {['Campaigns', 'Templates', 'Advisories'].map((label) => (
          <button
            key={label}
            onClick={() => setActiveTab(label)}
            className={`rounded-md px-4 py-1.5 text-sm transition-colors ${
              label === activeTab
                ? 'bg-card font-semibold text-foreground shadow-sm'
                : 'font-normal text-muted-foreground hover:text-foreground'
            }`}
          >
            {label}
          </button>
        ))}
      </div>
    )
    setActions(
      <Button size="sm" className="font-semibold tracking-wide">+ NEW CAMPAIGN</Button>
    )
    return () => { setTabs(null); setActions(null) }
  }, [activeTab])

  if (skeleton) return <SimulationSkeleton />

  const toggleAll = (e) => {
    if (e.target.checked) setSelected(new Set(CAMPAIGNS.map((c) => c.id)))
    else setSelected(new Set())
  }

  const toggleOne = (id) => {
    setSelected((prev) => {
      const next = new Set(prev)
      next.has(id) ? next.delete(id) : next.add(id)
      return next
    })
  }

  const filtered = CAMPAIGNS.filter((c) => {
    const q = search.toLowerCase()
    if (q && !c.createdBy.toLowerCase().includes(q) && !c.channels.toLowerCase().includes(q) && !c.status.toLowerCase().includes(q)) return false
    if (statusFilter !== 'All Active Campaigns' && c.status !== statusFilter) return false
    if (channelFilter !== 'All Channels' && !c.channels.toLowerCase().includes(channelFilter.toLowerCase())) return false
    return true
  })

  const hasFilters = search || statusFilter !== 'All Active Campaigns' || channelFilter !== 'All Channels' || typeFilter !== 'All Types'

  return (
    <div className="flex flex-col gap-0">

      {/* Filters */}
      <div className="flex items-center gap-3 border-b border-border px-6 py-3">
        <div className="flex h-8 w-52 items-center gap-2 rounded border border-border bg-card px-3 text-sm text-muted-foreground focus-within:border-[#1C84FC]/60">
          <svg className="h-3.5 w-3.5 shrink-0 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <circle cx="11" cy="11" r="8" strokeWidth="2" /><path d="m21 21-4.35-4.35" strokeWidth="2" strokeLinecap="round" />
          </svg>
          <input
            type="text"
            placeholder="Search campaigns…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1 bg-transparent text-sm text-foreground placeholder:text-muted-foreground focus:outline-none"
          />
          {search && <button type="button" onClick={() => setSearch('')} className="opacity-50 hover:opacity-100 cursor-pointer text-foreground">✕</button>}
        </div>
        <FilterDropdown
          label="All Active Campaigns"
          options={['All Active Campaigns', 'IN PROGRESS', 'FINISHED', 'PENDING', 'CANCELLED']}
          value={statusFilter}
          onChange={setStatusFilter}
        />
        <FilterDropdown
          label="All Channels"
          options={['All Channels', 'Email', 'Voice', 'Telegram']}
          value={channelFilter}
          onChange={setChannelFilter}
        />
        <FilterDropdown
          label="All Types"
          options={['All Types', 'Simulation', 'Training']}
          value={typeFilter}
          onChange={setTypeFilter}
        />
        {hasFilters && (
          <button type="button" onClick={() => { setSearch(''); setStatusFilter('All Active Campaigns'); setChannelFilter('All Channels'); setTypeFilter('All Types') }}
            className="text-sm text-muted-foreground hover:text-foreground cursor-pointer underline-offset-2 hover:underline">
            Clear all
          </button>
        )}
      </div>

      {/* Table */}
      <div className="px-6 py-4">
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="border-b border-border">
              <th className="w-8 pb-2 text-left">
                <input
                  type="checkbox"
                  className="accent-primary"
                  onChange={toggleAll}
                  checked={selected.size === CAMPAIGNS.length}
                />
              </th>
              <th className="pb-2 text-left font-medium text-muted-foreground">Status</th>
              <th className="pb-2 text-left font-medium text-muted-foreground">Channels</th>
              <th className="pb-2 text-left font-medium text-muted-foreground">Dates</th>
              <th className="pb-2 text-left font-medium text-muted-foreground">Created by</th>
              <th className="pb-2 text-right font-medium text-muted-foreground">Employees</th>
              <th className="pb-2 text-right font-medium text-muted-foreground">Departments</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 && (
              <tr><td colSpan={7} className="py-12 text-center text-sm text-muted-foreground">No campaigns match your filters.</td></tr>
            )}
            {filtered.map((campaign) => (
              <>
                {/* Simulation row */}
                <tr
                  key={campaign.id}
                  onClick={() => openTab({ id: `campaign-${campaign.id}`, label: `Campaign ${campaign.id}`, type: 'campaign', data: { title: `Campaign ${campaign.id}`, name: `Campaign ${campaign.id}`, ...campaign } })}
                  className="border-b border-border transition-colors cursor-pointer hover:bg-[#e2f98e]/10"
                >
                  <td className="py-3" onClick={(e) => e.stopPropagation()}>
                    <input
                      type="checkbox"
                      className="accent-primary"
                      checked={selected.has(campaign.id)}
                      onChange={() => toggleOne(campaign.id)}
                    />
                  </td>
                  <td className="py-3 pr-4">
                    <StatusBadge status={campaign.status} color={campaign.statusColor} />
                  </td>
                  <td className="py-3 pr-4 text-foreground">{campaign.channels}</td>
                  <td className="py-3 pr-4 text-muted-foreground">{campaign.dates}</td>
                  <td className="py-3 pr-4 text-muted-foreground">{campaign.createdBy}</td>
                  <td className="py-3 pr-4 text-right text-foreground">{campaign.employees}</td>
                  <td className="py-3 text-right text-foreground">{campaign.departments}</td>
                </tr>

                {/* Training sub-row */}
                {campaign.training && (
                  <tr
                    key={`${campaign.id}-training`}
                    className="border-b border-border bg-card/30 transition-colors hover:bg-[#e2f98e]/[0.04]"
                  >
                    <td className="py-2" />
                    <td className="py-2 pr-4">
                      <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                        <span className="opacity-50">└</span>
                        <span className="font-medium">Training</span>
                        <StatusBadge
                          status={campaign.training.status}
                          color={campaign.training.statusColor}
                        />
                      </div>
                    </td>
                    <td className="py-2 pr-4 text-muted-foreground text-sm">
                      {campaign.training.channels ?? '–'}
                    </td>
                    <td className="py-2 pr-4 text-muted-foreground text-sm">
                      {campaign.training.dates ?? '–'}
                    </td>
                    <td className="py-2 pr-4 text-muted-foreground text-sm">
                      {campaign.training.createdBy ?? '–'}
                    </td>
                    <td className="py-2 pr-4 text-right text-muted-foreground text-sm">
                      {campaign.training.employees ?? '–'}
                    </td>
                    <td className="py-2 text-right text-muted-foreground text-sm">
                      {campaign.training.departments ?? '–'}
                    </td>
                  </tr>
                )}
              </>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
